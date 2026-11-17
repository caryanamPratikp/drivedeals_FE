# 02 — Architectural Decisions and Assumptions Log

## 1. Architectural Decisions (ADR Summary)

### ADR-01: Modular Monolith with Domain-Driven Design (DDD)
- **Context**: MOTORCIRCLE is an emerging automotive group car-buying marketplace. Microservices at this phase would introduce unnecessary distributed complexity, operational overhead, and network latency across transactional boundaries (e.g., atomic consent and lead delivery).
- **Decision**: Adopt a modular monolith in Spring Boot 3.3.x organized by domain boundaries (`catalog`, `group`, `signal`, `quotation`, `consent`, `lead`, `dealer`, `identity`, `admin`).
- **Consequences**: Enables strict ACID transactions across modules while maintaining clean internal API contracts and isolation, with the flexibility to split into microservices later if scaling demands dictate.

### ADR-02: Monetary Precision & Server Calculation Authority
- **Context**: The frontend represents prices as JavaScript floating-point `number` (`src/types/index.ts:133-146`), which is vulnerable to binary precision drift.
- **Decision**: All financial fields in Java must use `java.math.BigDecimal` with explicit rounding modes (`RoundingMode.HALF_UP`). Database columns must strictly use `DECIMAL(12, 2)`. Quotation sums supplied by the client are treated purely as previews; the backend calculation engine authoritatively computes on-road totals and validates statutory TCS charges.
- **Consequences**: Guarantees rupee-accurate commercial transparency and eliminates client-side tampering.

### ADR-03: DPDP Act 2023 Explicit Consent Handshake
- **Context**: Indian automotive marketplaces commonly leak customer contact details to multiple competing dealers without prior consent. The Digital Personal Data Protection Act, 2023 mandates purpose-bound, verifiable consent and the right to withdraw consent.
- **Decision**:
  1. A buyer’s phone number, email, and name are NEVER exposed to dealerships during the discovery, group formation, or quote bidding phases.
  2. Dealer endpoints serialize only anonymized, aggregated demand telemetry.
  3. A `Lead` containing contact details is created ONLY when the buyer executes an explicit, authenticated `POST` to the consent endpoint with a specific `quotationVersionId`.
  4. Withdrawing consent transitions the lead to `CONSENT_REVOKED`, instantly masks the contact information in dealer views, and halts further outreach.
- **Consequences**: Full regulatory compliance and high customer trust.

### ADR-04: Immutable Quotation Versioning
- **Context**: Dealerships adjust pricing, warranty, or accessory bundles in response to group growth or competitive quotes. If an existing quote record is mutated, historical transparency is destroyed, and buyers lose proof of previously accepted terms.
- **Decision**: Quotation records point to an immutable list of `QuotationVersion` entities. Publishing a revised quote creates a monotonically incremented `version_number` (v1 -> v2) without modifying historical versions.
- **Consequences**: Immutable auditability, transparent price-drop tracking, and tamper-proof consent binding.

### ADR-05: Authentication Strategy: Phone OTP + Asymmetric RS256 JWT
- **Context**: Indian retail car buyers prefer frictionless phone-based OTP login over passwords.
- **Decision**:
  - Primary credential is an E.164 phone number (`+91XXXXXXXXXX`).
  - OTPs are cryptographically generated, hashed using HMAC-SHA256, and stored in Redis with a 5-minute TTL and rate limiting (max 3 verification attempts).
  - In development profile (`@Profile("dev")`), a `MockSmsProvider` logs OTPs to local console and permits a development bypass code (`123456`) to maintain smooth testing with existing frontend personas.
  - Access tokens are short-lived (15 minutes), signed with an asymmetric RS256 RSA 4096-bit private key.
  - Refresh tokens (7 days) are stored in secure, `HttpOnly`, `SameSite=Strict` cookies.

---

## 2. Product Rule Reconciliations

### 2.1 Group Lifecycle State Machine
Reconciliation between prototype states and production domain rules:
- **`FORMATION`**: Group is created; buyers join and submit telemetry signals. Small groups (minimum 2 or 3 buyers) are fully supported.
- **`OPEN_FOR_QUOTES`**: Automatically triggered when `currentMembers >= targetMembers`. Verified franchise dealers in the group's city receive bidding notifications.
- **`UNDER_REVIEW`**: Bidding window closes. Group members review, compare structured quotes, and select preferred dealerships. New joins are locked.
- **`CLOSED`**: Deal finalization window ends; active leads proceed through dealer showroom pipelines.
- **`CANCELLED`**: Group expired without reaching minimum viable threshold or cancelled by initiator.

### 2.2 Statutory Indian Automotive Tax Invariants
- **TCS under Section 206C(1F)**: The Indian Income Tax Act mandates 1% Tax Collected at Source on motor vehicles where the ex-showroom value exceeds ₹10,00,000. The backend `PricingCalculationEngine` verifies that quotations for vehicles with base price > ₹10 Lakhs include the statutory 1% TCS line item.
- **RTO / Registration**: Validated within permissible state percentage bounds based on fuel type (e.g. Karnataka ~18%, Delhi ~10%, EV incentives).

### 2.3 Lead Dispute SLA
- Dealerships may file a dispute against a delivered lead within **72 hours** of consent generation for reasons: `INVALID_CONTACT_INFO`, `OUT_OF_TERRITORY`, `BUYER_UNRESPONSIVE`, or `ALREADY_PURCHASED`.
- Disputes filed beyond 72 hours are rejected by system invariants.
- Admins arbitrate disputes, granting refunds/credits to dealer balances where valid.

---

## 3. Assumptions and Dependencies

1. **Development Environment**: Host OS is Windows with OpenJDK 25 (Temurin) installed and Docker available for MySQL and Redis containerization.
2. **Build Automation**: A Maven Wrapper (`mvnw` / `mvnw.cmd`) targeting Java 21 LTS language and bytecode compatibility will be included in the backend root to avoid reliance on system PATH variables.
3. **Frontend Non-Destructive Integration**: The frontend directory structure and UI components will remain intact. Integration will occur via environment variable `VITE_API_BASE_URL` pointing to the Spring Boot REST backend (`http://localhost:8080/api/v1`).
