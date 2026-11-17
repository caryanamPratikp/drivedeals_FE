# 00 — Phase Zero: Implementation Assessment

## 1. Executive Assessment Overview
This document evaluates the existing MOTORCIRCLE workspace repository at `C:\Users\Admin\OneDrive\Desktop\DriveDeals` to establish a safe, rigorous foundation prior to backend implementation.

MOTORCIRCLE is an automotive group car-buying platform designed for retail car buyers in India with the product tagline: **“Buy smarter, together.”** The frontend is fully developed as an interactive React application with mock data.

---

## 2. Assessment Findings (10 Core Checkpoints)

### 2.1 Current Frontend Framework and Structure
- **Framework & Libraries**: React 18.3.1, TypeScript 5.5.3, Vite 5.4.21, Tailwind CSS 3.4.17, Lucide React 0.344.0, React Router DOM 6.22.3, Zustand 5.0.3 with `persist` middleware.
- **Directory Structure**:
  - `src/components/` (Layouts, UI primitives, modals, quote matrices, consent drawers)
  - `src/pages/` (Public: 9 routes; Buyer: 5 routes; Dealer: 5 routes; Admin: 6 routes)
  - `src/store/` (`index.ts` - 1,108-line monolithic Zustand store)
  - `src/types/` (`index.ts` - 276 lines, 16 domain interfaces and enum types)
  - `src/domain/` (`pricing.ts`, `quotationVersion.ts`, `permissions.ts`, `moderation.ts`, `explanations.ts`)
  - `src/data/` (`mockData.ts` - 670 lines of seed data across 4 personas)
  - `src/tests/` (`store.test.ts` - 13 Vitest tests validating state mutations)

### 2.2 Status of Existing Backend
- **Finding**: **No backend exists yet.**
- The repository is currently a standalone frontend SPA. There are no Java source directories (`src/main/java`), build scripts (`pom.xml`, `build.gradle`), or configuration files (`application.yml`).

### 2.3 Installed Java & Tooling Environment
- **Java**: OpenJDK 64-Bit Server VM Temurin-25 (build 25.0.4.1+1-LTS) installed on the host system.
- **Node.js**: v24.21.0, npm v11.x installed.
- **Build Tool**: System `mvn` binary is not in global Windows PATH; the recommended Spring Boot project bootstrap will include Maven Wrapper (`mvnw` / `mvnw.cmd`) targeting Java 21 LTS compatibility to ensure self-contained, reproducible builds.
- **Target Spring Boot Version**: Spring Boot 3.3.x (or 3.4.x) with Java 21 bytecode compatibility.

### 2.4 Existing Database and Migration Configuration
- **Finding**: **No database or migrations exist yet.**
- Currently, 100% of state persistence is simulated using browser `localStorage` under the key `motorcircle_demo_state_v1`.
- The target configuration will introduce MySQL 8.0 (InnoDB, `utf8mb4_0900_ai_ci`) with Flyway versioned migrations starting from `V1__init_schema.sql`.

### 2.5 Discovery Documents Inventory
All 11 requested discovery documents are verified and present in `docs/backend-discovery/`:
- `00-executive-summary.md` (Verified)
- `01-frontend-inventory.md` (Verified)
- `02-domain-model.md` (Verified)
- `03-api-specification.md` (Verified)
- `04-database-design.md` (Verified)
- `05-security-and-privacy.md` (Verified)
- `06-business-rules.md` (Verified)
- `07-testing-and-acceptance.md` (Verified)
- `08-implementation-roadmap.md` (Verified)
- `09-open-questions.md` (Verified)
- `10-frontend-backend-gap-analysis.md` (Verified)
- **Missing Documents**: None.

### 2.6 Frontend Mock Data & API Integration Architecture
- The frontend currently has **zero network integration** (`0` calls to `fetch`, `axios`, or `WebSocket`).
- All 25 routes query local Zustand store hooks (`useAppStore()`).
- Data mutates locally via 18 store actions (e.g., `joinGroup`, `publishQuotationVersion`, `grantConsentAndCreateLead`).
- Any page refresh restores data from `localStorage`.
- Resetting demo state is achieved by wiping `localStorage` and reloading `mockData.ts`.

### 2.7 API Endpoints Required by the Actual Frontend
- **Auth**: `POST /auth/otp/send`, `POST /auth/otp/verify`, `POST /auth/refresh`, `GET /auth/me`
- **Catalogue**: `GET /catalogue/cars`, `GET /catalogue/cars/{id}`
- **Groups & Memberships**: `GET /groups`, `GET /groups/{id}`, `POST /groups`, `POST /groups/{id}/memberships`, `DELETE /groups/{id}/memberships/me`, `POST /groups/{id}/signals`
- **Quotations & Bidding**: `GET /groups/{id}/quotations`, `POST /groups/{id}/quotations`, `POST /quotations/{id}/versions`
- **Consent & Leads**: `POST /quotations/{id}/versions/{versionId}/consent`, `POST /consents/{id}/revoke`, `GET /dealer/leads`, `PATCH /dealer/leads/{id}/status`, `POST /dealer/leads/{id}/notes`, `POST /dealer/leads/{id}/disputes`
- **Admin**: `GET /admin/dealers/pending`, `POST /admin/dealers/{id}/review`, `POST /admin/disputes/{id}/resolve`, `POST /admin/moderation/{id}/action`, `GET /admin/audit`
- Full endpoint mapping is cataloged in `01-frontend-api-mapping.md`.

### 2.8 Authentication & Authorization Assumptions
- **Current Prototype**: Persona dropdown (`Rahul Sharma [Buyer]`, `Vikram Malhotra [Dealer]`, `Super Admin [Admin]`) and static OTP `123456`.
- **Target Production Requirement**:
  - Genuine SMS OTP delivery via Redis TTL token store (mock OTP provider in `@Profile("dev")` / `@Profile("test")`).
  - Stateless JWT access tokens (15m) using RS256 asymmetric signing.
  - Refresh tokens (7d) stored in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.
  - Spring Security 6 method authorization (`@PreAuthorize`) and Object-Level Access Control (OLAC) to enforce dealer lead isolation and buyer privacy.

### 2.9 Gaps, Contradictions, and Unresolved Business Decisions
1. **Monetary Precision**: Client uses JavaScript `number` (IEEE 754 float); backend must strictly enforce `java.math.BigDecimal` and MySQL `DECIMAL(12, 2)` to eliminate rounding drift.
2. **Quotation Pricing Authority**: The frontend currently performs on-road total math in the browser (`src/domain/pricing.ts`). In backend, client totals are strictly informative; server-side calculation engine computes authoritative on-road totals and validates statutory TCS @ 1% where applicable (> ₹10L).
3. **Atomic Consent & Lead Generation**: The frontend performs separate client mutations for creating consent and generating leads. In production, this must be an atomic transaction (`@Transactional(isolation = Isolation.REPEATABLE_READ)`) preventing partial or unconsented lead unlocks.
4. **Dealer Lead Tenancy Isolation**: In the mock frontend, all leads are in a global array filtered in memory. Backend must enforce row-level security so dealerships can query ONLY leads specifically granted to their `dealerId`.

### 2.10 Recommended Implementation Sequence
1. **Phase Zero (Current)**: Repository Assessment, API mapping, and decision freeze.
2. **Milestone 1**: Set up Spring Boot 3.3.x backend scaffolding with Maven Wrapper, `docker-compose.yml` (MySQL 8 + Redis 7), Flyway baseline, and RFC 7807 global exception handling.
3. **Milestone 2**: Identity, Authentication & Security (SMS OTP, RS256 JWT, Spring Security RBAC).
4. **Milestone 3**: Vehicle Catalogue & Demand Groups (Cars, Variants, Groups, Memberships, Signals).
5. **Milestone 4**: Quotation Engine & Dealer Bidding (Immutable versioning, server pricing calculation engine).
6. **Milestone 5**: Consent Handshake & Lead Delivery (Atomic consent-to-lead transaction, DPDP compliance, revocation).
7. **Milestone 6**: Governance, Disputes, Moderation & Admin (KYC verification, dispute arbitration, audit log).
8. **Milestone 7**: Frontend Client Integration (Axios API client adapter with JWT interceptors, end-to-end verification).
