# 10 — Frontend-to-Backend Gap Analysis & Migration Specification

## 1. Architectural Gap Overview
The MOTORCIRCLE frontend is an interactive prototype where 100% of state, business rules, access control, and persistence are executed inside the client browser via Zustand and `localStorage`.

To become a secure, production-grade platform, every client-side assumption must be systematically audited and replaced with enterprise backend guarantees.

```
┌──────────────────────────────────────────────┐
│             CURRENT FRONTEND                 │
│  - State: Monolithic Zustand Store           │
│  - Persistence: Browser localStorage         │
│  - Auth: Simulated Persona Switcher / "123456"│
│  - Privacy: Filter in-memory arrays          │
│  - Currency: JavaScript `number`             │
│  - Concurrency: Zero protection              │
└──────────────────────┬───────────────────────┘
                       │
                       ▼ Migration Strategy
┌──────────────────────────────────────────────┐
│           ENTERPRISE SPRING BOOT             │
│  - State: Stateless REST + Redis Session     │
│  - Persistence: MySQL 8.0 InnoDB + Flyway    │
│  - Auth: DLT SMS OTP + Asymmetric RS256 JWT  │
│  - Privacy: Row-Level Security & Masked DTOs │
│  - Currency: java.math.BigDecimal / DECIMAL  │
│  - Concurrency: ACID Isolation & Locking     │
└──────────────────────────────────────────────┘
```

---

## 2. Comprehensive 10-Dimension Gap Matrix

| # | Dimension | Current Frontend Implementation (`src/`) | Required Enterprise Backend Architecture | Critical Action Required |
| :- | :--- | :--- | :--- | :--- |
| **1** | **State & Persistence** | Persisted via `localStorage` key `motorcircle_demo_state_v1` (`src/store/index.ts:1100`). Data is confined to a single browser. | MySQL 8.0 relational database with Flyway versioning and Redis caching for active sessions and demand tallies. | Replace Zustand `persist` middleware with React Query / Axios REST API client. |
| **2** | **Monetary Precision** | Defined as TypeScript `number` (`src/types/index.ts:133-146`). Subject to floating-point rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`). | Exact `java.math.BigDecimal` on server, mapped to `DECIMAL(12, 2)` in MySQL. | Audit all quotation arithmetic in backend calculation engine. |
| **3** | **Identity & Auth** | Persona switching via `switchUser()` (`src/store/index.ts:311`) and fixed OTP `123456` (`src/pages/SignInPage.tsx:48`). | Cryptographically random OTP dispatched via SMS gateway, signed RS256 JWT access token (15m), HttpOnly refresh cookie (7d). | Implement Spring Security 6.x filter chain, OTP rate limiting, and token revocation. |
| **4** | **Business Logic Placement** | Quota verification, date checking, and discount rules executed in client store (`src/store/index.ts`). Susceptible to client tampering. | Stateless Spring `@Service` classes with Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Min`) and declarative `@Transactional`. | Move all validation and state transition rules to backend services. |
| **5** | **Privacy & PII Exposure** | Entire dataset including all buyers' phone numbers and emails is downloaded to client and filtered in memory (`src/pages/dealer/DealerLeadsPage.tsx:18`). High privacy vulnerability. | Strict Object-Level Access Control (OLAC). Server serializes masked DTOs (`buyerPhone: "+91******3210"`). Full PII serialized ONLY if verified `Consent` exists. | Enforce DTO projection and Spring Security method authorization (`@PreAuthorize`). |
| **6** | **Concurrency & Race Conditions** | Single-threaded JavaScript environment. No concurrency protection. Two buyers joining simultaneously will overwrite counts. | Database transactions with `@Version` optimistic locking on `BuyerGroup` and pessimistic locking on quotation consent. | Add `version INT NOT NULL DEFAULT 0` column to `buyer_groups` and `quotations`. |
| **7** | **Error Handling** | Generic client alert/toasts (`src/store/index.ts`). | RFC 7807 Problem Details JSON format with machine-readable error codes and localized user messages. | Implement `@RestControllerAdvice` global exception translation. |
| **8** | **Search & Pagination** | In-memory JavaScript `.filter()` and `.slice()` on mock arrays. | Database-backed indexing (`B-Tree`) with Spring Data `Pageable` (`PageRequest.of(page, size, Sort)`). | Implement repository query methods with composite indices on `(city, stage)` and `(car_id, price)`. |
| **9** | **Asset Management** | Hardcoded external image URLs from Unsplash (`src/data/mockData.ts:35`). | Secure object storage (AWS S3 / GCP Cloud Storage) with CDN caching and presigned upload URLs for dealer KYC documents. | Implement S3 upload service for dealer GSTIN and franchise documents. |
| **10** | **Telemetry & Auditing** | Store array mutated in memory (`src/store/index.ts:365`). Discarded when user clears local storage. | Immutable, append-only `audit_events` database table capturing client IP, User-Agent, timestamp, and payload diffs. | Implement Spring Application Event listeners for asynchronous audit logging. |

---

## 3. Field-by-Field Entity Migration Catalog

### 3.1 `BuyerGroup` Entity Transformation
| Frontend Field (`src/types/index.ts`) | Frontend Type | Backend Column (`buyer_groups`) | Backend SQL Type | Backend Validation & Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `VARCHAR(36)` | UUIDv4 Primary Key. |
| `carId` | `string` | `car_id` | `VARCHAR(36)` | FK -> `cars(id)`, NOT NULL. |
| `variantId` | `string` | `variant_id` | `VARCHAR(36)` | FK -> `car_variants(id)`, NOT NULL. |
| `city` | `string` | `city` | `VARCHAR(100)` | Standardized Indian Tier-1/Tier-2 city name. |
| `targetMembers` | `number` | `target_members` | `INT` | `@Min(3) @Max(50)` validation. |
| `currentMembers` | `number` | `current_members` | `INT` | Server-derived count of active memberships. |
| `stage` | `GroupStage` | `stage` | `VARCHAR(30)` | Managed by backend state machine. |
| `expiresAt` | `string` | `expires_at` | `TIMESTAMP(6)` | Must be at least 7 days from creation. |
| `createdBy` | `string` | `created_by` | `VARCHAR(36)` | Extracted from authenticated JWT `sub`. |
| *(New)* | — | `version` | `INT` | Optimistic locking counter. |

### 3.2 `QuotationVersion` Entity Transformation
| Frontend Field (`src/types/index.ts`) | Frontend Type | Backend Column (`quotation_versions`) | Backend SQL Type | Backend Validation & Notes |
| :--- | :--- | :--- | :--- | :--- |
| `id` | `string` | `id` | `VARCHAR(36)` | UUIDv4 Primary Key. |
| `quotationId` | `string` | `quotation_id` | `VARCHAR(36)` | FK -> `quotations(id)`, NOT NULL. |
| `versionNumber` | `number` | `version_number` | `INT` | Monotonically incremented, strictly immutable. |
| `exShowroomPrice` | `number` | `ex_showroom_price` | `DECIMAL(12, 2)` | Matches benchmark catalogue price. |
| `registrationCharges`| `number` | `registration_charges` | `DECIMAL(12, 2)` | Validated against state RTO formula. |
| `insuranceCharges` | `number` | `insurance_charges` | `DECIMAL(12, 2)` | Non-negative decimal. |
| `accessoriesCharges`| `number` | `accessories_charges` | `DECIMAL(12, 2)` | Optional, defaults to 0.00. |
| `otherCharges` | `number` | `other_charges` | `DECIMAL(12, 2)` | Must itemize TCS if vehicle > ₹10L. |
| `groupDiscount` | `number` | `group_discount` | `DECIMAL(12, 2)` | `@DecimalMin("1.00")` mandatory concession. |
| `totalOnRoadPrice` | `number` | `total_on_road_price` | `DECIMAL(12, 2)` | Server-derived authoritative sum. |

---

## 4. Frontend Client Adapter Strategy

To connect the existing React frontend to the new Spring Boot backend with minimal disruption to UI components, an API adapter service layer must be introduced:

```
[ UI Components (e.g. GroupsPage.tsx) ]
                     │
                     ▼
[ React Query Hooks (useGroupsQuery, useJoinGroupMutation) ]
                     │
                     ▼
[ Axios API Client (src/api/client.ts) ]  <── Injects Bearer Token & Intercepts 401
                     │
                     ▼ HTTPS REST
[ Spring Boot 3.3 REST Controllers ]
```

This decoupled pattern preserves the user interface components while replacing the simulated Zustand mock store with live, resilient network synchronization.
