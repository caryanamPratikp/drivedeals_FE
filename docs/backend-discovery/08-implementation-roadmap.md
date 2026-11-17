# 08 — Implementation Roadmap & Execution Plan

## 1. Execution Overview & Architecture Strategy
The backend implementation for MOTORCIRCLE will be executed in **6 structured engineering phases** over an estimated 10-week development cycle. Each phase delivers a verifiable, deployable milestone with associated unit and integration tests.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Phase 0: Setup  │ ──► │ Phase 1: Auth   │ ──► │ Phase 2: Groups │
│ Infra & Flyway  │     │ & Security      │     │ & Catalogue     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Phase 5: Admin  │ ◄── │ Phase 4: Consent│ ◄── │ Phase 3: Quotes │
│ & Disputes      │     │ & Leads (ACID)  │     │ & Pricing       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │
        ▼
┌─────────────────┐
│ Phase 6: Web    │
│ Integration     │
└─────────────────┘
```

---

## 2. Phased Milestone Breakdown

### Phase 0: Foundation & Infrastructure (Sprint 1 — Week 1)
- **Objectives**: Initialize project repository, establish containerized dev environment, configure database migrations.
- **Tasks**:
  1. Initialize Spring Boot 3.3.x application with Java 21 LTS (`pom.xml` / `build.gradle`).
  2. Setup `docker-compose.yml` for local development (MySQL 8.0 with utf8mb4, Redis 7.0).
  3. Author `V1__init_schema.sql` Flyway migration script based on `04-database-design.md`.
  4. Author `V2__seed_catalogue_and_dealers.sql` baseline reference data.
  5. Setup Base entity classes (`BaseEntity` with `@CreatedDate`, `@LastModifiedDate`).
  6. Configure Global Exception Handler (`@RestControllerAdvice`) using RFC 7807 Problem Details.
- **Deliverables**: Working Spring Boot application bootstrapping cleanly with Flyway on MySQL 8.0.

---

### Phase 1: Identity, Authentication & Security (Sprint 2 — Weeks 2-3)
- **Objectives**: Deliver passwordless phone OTP authentication, JWT token issuance, and Spring Security RBAC.
- **Tasks**:
  1. Implement `User` and `Dealer` JPA entities and repositories.
  2. Integrate SMS Gateway interface with Redis-backed OTP storage and rate limiting.
  3. Implement JWT utility (RS256 asymmetric signing, claims generation, token parsing).
  4. Implement `JwtAuthenticationFilter` and `SecurityFilterChain` in Spring Security.
  5. Implement Refresh Token rotation via HttpOnly secure cookies.
  6. Add unit and integration tests for auth workflows (`AuthenticationServiceTest`).
- **Deliverables**: Endpoints `/api/v1/auth/otp/send`, `/api/v1/auth/otp/verify`, `/api/v1/auth/me` operational with test suite.

---

### Phase 2: Vehicle Catalogue & Demand Groups (Sprint 3 — Weeks 4-5)
- **Objectives**: Vehicle catalogue browsing, group formation, membership management, and buyer signals.
- **Tasks**:
  1. Implement `Car` and `CarVariant` domain entities, DTOs, and REST controllers.
  2. Implement `BuyerGroup`, `GroupMembership`, and `BuyerSignal` entities.
  3. Implement group lifecycle state machine (Formation $\rightarrow$ Open for Quotes).
  4. Implement signal aggregation engine (anonymized demand telemetry for dealerships).
  5. Setup `@Scheduled` cron job to transition expired groups.
  6. Author unit and integration tests for group creation and membership limits.
- **Deliverables**: Endpoints `/api/v1/catalogue/*` and `/api/v1/groups/*` fully operational.

---

### Phase 3: Quotation Engine & Dealer Bidding (Sprint 4 — Weeks 6-7)
- **Objectives**: Dealer quotation submission, versioning immutability, and pricing verification engine.
- **Tasks**:
  1. Implement `Quotation` and `QuotationVersion` JPA entities with composite indexing.
  2. Implement `PricingCalculationEngine` validating statutory line items (Ex-Showroom, RTO, TCS, Discounts).
  3. Implement quotation version revision workflow (v1 $\rightarrow$ v2 sequential appending).
  4. Implement dealer franchise and territory authorization checks via Spring Security.
  5. Dispatch notification events to active group members when a new quote is published.
- **Deliverables**: Endpoints `/api/v1/groups/{id}/quotations` and `/api/v1/quotations/{id}/versions` operational.

---

### Phase 4: Consent Handshake & Lead Delivery (Sprint 5 — Week 8)
- **Objectives**: Atomic lead unlocking, DPDP Act compliance, and consent revocation engine.
- **Tasks**:
  1. Implement `Consent`, `Lead`, and `LeadEvent` JPA entities.
  2. Implement `@Transactional(isolation = Isolation.REPEATABLE_READ)` consent granting service.
  3. Implement buyer PII snapshotting and dealer notification dispatch.
  4. Implement consent revocation service (`/api/v1/consents/{id}/revoke`) with instant lead locking.
  5. Implement dealer lead management endpoints with strict tenancy isolation.
- **Deliverables**: Endpoints `/api/v1/quotations/{id}/versions/{versionId}/consent` and `/api/v1/dealer/leads/*`.

---

### Phase 5: Governance, Disputes, Moderation, & Admin (Sprint 6 — Week 9)
- **Objectives**: Dealer onboarding verification, lead dispute arbitration, automated content moderation, and audit logs.
- **Tasks**:
  1. Implement `LeadDispute` workflow (72-hour dispute window, evidence submission).
  2. Implement `AdminDisputeService` (arbitration resolution, dealer fee credits/refunds).
  3. Implement automated regex moderation scanner for buyer signals and dealer notes.
  4. Implement `AuditEvent` asynchronous persistence via Spring Application Events.
  5. Implement admin catalogue management and dealer KYC approval endpoints.
- **Deliverables**: Endpoints `/api/v1/admin/*` and complete audit ledger operational.

---

### Phase 6: Frontend Integration & End-to-End Verification (Sprint 7 — Week 10)
- **Objectives**: Replace mock Zustand layer in React frontend with production REST API client.
- **Tasks**:
  1. Implement Axios API client (`src/api/client.ts`) with automatic JWT injection and 401 refresh interceptors.
  2. Refactor Zustand store actions to delegate asynchronous API mutations to backend.
  3. Verify responsive UI against live backend with test personas.
  4. Execute full Playwright E2E suite covering buyer group join to dealer lead handoff.
  5. Deploy staging environment (AWS ECS Fargate / RDS MySQL / ElastiCache Redis).
- **Deliverables**: Production-ready, fully integrated MOTORCIRCLE full-stack platform.

---

## 3. Resource Allocation & Critical Path Dependencies

| Resource Role | Primary Responsibilities | Time Commitment |
| :--- | :--- | :--- |
| **Backend Lead / Architect** | Architecture, security, DPDP compliance, transactional boundaries, API design. | 10 Weeks (Full-Time) |
| **Spring Boot Engineer** | JPA entity modeling, Flyway migrations, REST controllers, service logic, JUnit tests. | 10 Weeks (Full-Time) |
| **Frontend Engineer** | Axios API client integration, store refactoring, loading/error state wiring. | 4 Weeks (Phases 5-6) |
| **QA / Security Engineer** | Penetration testing, OWASP validation, load testing, Playwright E2E scenarios. | 3 Weeks (Phases 5-6) |

### Critical Path Risks & Mitigations
- **SMS OTP Gateway Delays**: Mitigate by implementing a mock SMS provider profile for local/dev environments (`@Profile("dev")`).
- **Regulatory Scrutiny on PII**: Mitigate through automated contract tests verifying that no dealer endpoint serializes buyer contact fields without an active consent foreign key.
