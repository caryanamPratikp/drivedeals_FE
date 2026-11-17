# 00 — Executive Summary

## 1. Project Background & Vision
**MOTORCIRCLE** is an automotive group car-buying platform engineered for individual retail car buyers in India, operating under the product philosophy: *"Buy smarter, together."*

The core value proposition addresses long-standing structural inefficiencies in traditional retail automotive buying:
1. **Asymmetric Information & Fragmented Demand**: Individual retail buyers negotiate in isolation with dealerships without pricing leverage or objective transparency.
2. **Dealer Lead Fatigue**: Dealerships purchase low-intent, non-exclusive aggregator leads that rarely convert, leading to aggressive cold-calling, high customer acquisition cost (CAC), and customer dissatisfaction.
3. **Privacy Erosion**: Conventional automotive portals distribute buyer contact information across multiple competing dealerships before the buyer has evaluated pricing or consented to be contacted.

MOTORCIRCLE reverses this paradigm through a structured, multi-stage interaction model:
- **Demand Aggregation**: Verified individual buyers join or initiate demand groups anchored to a specific vehicle variant and delivery region.
- **Controlled Discovery**: Verified dealerships access aggregated demand telemetry (buyer timeline, purchase mode, exchange requirement) without accessing personally identifiable information (PII).
- **Structured Quotation Bidding**: Dealerships submit transparent, standardized on-road price breakdowns, optional accessory bundles, warranty packages, and firm validity deadlines.
- **Explicit Consent-Driven Lead Delivery**: Dealerships only receive a buyer's verified contact details after the buyer explicitly reviews, selects, and consents to that dealership's specific quotation version.

---

## 2. Current Architecture & Implementation State
An exhaustive inspection of the codebase at `C:/Users/Admin/OneDrive/Desktop/DriveDeals` was conducted. The current state is summarized below:

- **Frontend Technology Stack**: React 18.3.1, TypeScript 5.5.3, Vite 5.4.21, Tailwind CSS 3.4.17, Lucide React 0.344.0, React Router DOM 6.22.3.
- **State Management & Persistence**: A monolithic Zustand store (`src/store/index.ts`, 1,108 lines) handles all state transitions, business rules, and UI updates. State is persisted in browser local storage via `motorcircle_demo_state_v1`.
- **Backend API Integration**: Currently **0% implemented**. There are no REST, GraphQL, or WebSocket network calls (`fetch`, `axios`). All data operations are synchronous client-side state mutations.
- **Mock Data Layer**: Rich, realistic mock data is bundled in `src/data/mockData.ts` (670 lines), simulating 4 user personas, 6 car models with 14 variants, 4 demand groups, 3 dealerships, 5 quotations, 4 leads, disputes, and audit events.
- **Automated Verification**: Vitest unit test suite (`src/tests/store.test.ts`, 13 tests) validates core state transitions: user switching, group joining/leaving, quota checks, duplicate signal prevention, quotation versioning, and atomic consent granting.

---

## 3. Scope of Discovery & Transition Objectives
This discovery document establishes the authoritative blueprint to transition MOTORCIRCLE from an interactive prototype to an enterprise-grade, secure, multi-tenant Spring Boot production backend.

### Target Technology Stack
- **Runtime & Framework**: Java 21 LTS, Spring Boot 3.3.x.
- **Persistence & ORM**: Spring Data JPA, Hibernate 6.x, MySQL 8.0 (InnoDB, `utf8mb4`).
- **Database Migrations**: Flyway schema versioning.
- **Security & Identity**: Spring Security 6.x, Stateless JWT Authentication, HttpOnly Secure Cookies, Argon2id password hashing, TOTP/SMS OTP integration.
- **Caching & Rate Limiting**: Redis 7.x, Bucket4j for endpoint throttling.
- **Testing**: JUnit 5, Mockito, AssertJ, Testcontainers (MySQL & Redis).

---

## 4. Key Architectural & Business Risks Identified

| Risk Area | Codebase Evidence | Architectural Impact & Mitigation |
| :--- | :--- | :--- |
| **Monetary Precision** | `src/types/index.ts:133-146`<br>`number` primitive used | JavaScript floating-point arithmetic induces precision drift in rupee calculations. Server must enforce `java.math.BigDecimal` and MySQL `DECIMAL(12, 2)`. |
| **PII Leakage Prior to Consent** | `src/types/index.ts:182-192`<br>`Lead.buyerPhone` / `buyerEmail` | Dealerships must never query buyer contact details prior to an explicit `Consent` record. The backend must enforce Object-Level Access Control (OLAC) and DTO projection masking. |
| **Non-Atomic Lead Handshake** | `src/store/index.ts:639-688`<br>`grantConsentAndCreateLead` | In frontend, consent and lead generation are client-orchestrated. Backend must execute this under `@Transactional(isolation = Isolation.SERIALIZABLE)` or pesimistic locking. |
| **Quotation Versioning Integrity** | `src/types/index.ts:153-162`<br>`QuotationVersion` entity | Revisions must not mutate historical quotation versions already viewed or accepted by buyers. Server must enforce immutable version appending (`v1 -> v2`). |
| **Demo Authentication Bypass** | `src/pages/SignInPage.tsx:48-73`<br>Static OTP `123456` | Client uses mock persona switching with fixed OTP. Production requires genuine SMS gateway integration (e.g., MSG91/Twilio), redis rate-limited attempts, and JWT revocation. |

---

## 5. Deliverable Structure
The full discovery documentation is organized into 11 dedicated specifications within `docs/backend-discovery/`:
1. `00-executive-summary.md` (This document)
2. `01-frontend-inventory.md` — Complete route, component, action, and payload catalog.
3. `02-domain-model.md` — Domain entity schemas, attributes, invariants, and lifecycle state machines.
4. `03-api-specification.md` — Complete OpenAPI-grade REST API contract.
5. `04-database-design.md` — Relational schema, DDL, constraints, indexing, and migration plan.
6. `05-security-and-privacy.md` — RBAC, DPDP Act 2023 compliance, PII masking, and cryptographic standards.
7. `06-business-rules.md` — Algorithmic calculation rules, group dynamics, and lead dispute handling.
8. `07-testing-and-acceptance.md` — Test pyramid, unit/integration test specifications, and acceptance criteria.
9. `08-implementation-roadmap.md` — Phased engineering sprints, dependency graphs, and resource estimates.
10. `09-open-questions.md` — Unresolved design questions, regulatory considerations, and edge cases.
11. `10-frontend-backend-gap-analysis.md` — Field-by-field audit of UI mocks versus enterprise backend requirements.
