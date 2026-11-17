# 05 — Security, Identity, & Privacy Architecture

## 1. Regulatory Context: DPDP Act 2023 Compliance
MOTORCIRCLE operates in India as a Data Fiduciary under the **Digital Personal Data Protection Act, 2023 (DPDP Act)**. Automotive marketplace platforms traditionally suffer from severe privacy non-compliance by broadcasting unconsented customer phone numbers to multiple rival dealerships.

MOTORCIRCLE’s core architecture strictly enforces DPDP compliance via code:
1. **Notice & Explicit Purpose-Bound Consent (Section 6)**:
   - A buyer’s phone number, email, and full legal name are encrypted and strictly shielded from all dealerships during the discovery and bidding phases.
   - PII is only unlocked when the buyer affirmatively selects a specific quotation version and clicks "Connect with Dealer" (`src/store/index.ts:639-688`).
2. **Right to Withdraw Consent (Section 6(4))**:
   - Buyers can revoke consent at any time (`src/store/index.ts:705-738`).
   - Revocation instantly transitions the lead to `CONSENT_REVOKED`, strips dealer access from the UI, and logs an event prohibiting further unsolicited outreach.
3. **Data Minimization (Section 4)**:
   - Prior to consent, dealers view only anonymized demand signals: vehicle variant, city, purchase mode (Cash/Loan), and timeline.
4. **Audit Trail & Grievance Redressal (Section 8 & 13)**:
   - Every lead creation, status modification, dispute filing, and consent revocation generates an immutable record in `audit_events`.

---

## 2. Authentication & Identity Architecture

### 2.1 Passwordless Phone OTP Authentication
Traditional passwords are prone to credential stuffing. Retail car buyers in India expect instant OTP login via SMS or WhatsApp.
1. **Initiation**: `POST /api/v1/auth/otp/send` with an E.164 phone number (`+91XXXXXXXXXX`).
2. **OTP Generation**: Server generates a cryptographically secure 6-digit numeric token (`SecureRandom`), hashed using HMAC-SHA256 and stored in Redis with a 5-minute TTL.
3. **Delivery**: Gateway integration via Tier-1 SMS providers (e.g. MSG91, Twilio India) with DLT registration compliance.
4. **Verification**: `POST /api/v1/auth/otp/verify`.
   - Max 3 invalid attempts before phone number lockout (15 minutes).
   - Redis atomic counter prevents brute force.

### 2.2 JWT Token Lifecycle & Cryptographic Signing
- **Access Token**: Short-lived (15 minutes).
  - Encoded with RS256 (asymmetric RSA 4096-bit key pair) or Ed25519.
  - Contains claims: `sub` (User ID), `role` (`ROLE_BUYER`, `ROLE_DEALER`, `ROLE_ADMIN`), `dealerId` (if dealer persona), `name`, `iss`, `exp`.
- **Refresh Token**: Long-lived (7 days).
  - Stored exclusively in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
  - Stored in Redis with automatic rotation on each refresh to prevent token replay attacks.

---

## 3. Authorization & Row-Level Access Control (RLAC)

### 3.1 Role Hierarchy & Permissions Matrix
The platform defines three primary security roles enforced via Spring Security `@PreAuthorize`:

| Role | Permitted Actions | Prohibited Actions |
| :--- | :--- | :--- |
| `ROLE_BUYER` | View catalogue, join/leave groups, submit buyer signals, view quotes for joined groups, grant/revoke consent, view own leads. | Submit dealer quotations, view other buyers' PII, access admin moderation/disputes. |
| `ROLE_DEALER` | View demand aggregations, submit/revise quotations for authorized brand/city, view unlocked leads granted to dealership, update lead pipeline, submit disputes. | Access buyer leads without consent, submit quotes outside franchise brand/territory, view rival dealer quote drafts. |
| `ROLE_ADMIN` | Verify dealerships, arbitrate lead disputes, moderate user-submitted text, manage vehicle catalogue, inspect immutable audit logs. | Arbitrarily alter quotation pricing on behalf of a dealer, bypass audit logging. |

### 3.2 Object-Level Access Control (OLAC) Implementation
Spring Security Method Security expressions must validate resource tenancy.
Examples:

```java
// Dealer Lead Isolation
@PreAuthorize("hasRole('DEALER') and @securityService.isDealerLeadOwner(authentication, #leadId)")
public LeadDto getDealerLeadById(String leadId) { ... }

// Buyer Consent Revocation
@PreAuthorize("hasRole('BUYER') and @securityService.isConsentOwner(authentication, #consentId)")
public void revokeConsent(String consentId, RevocationRequest request) { ... }

// Quotation Revision
@PreAuthorize("hasRole('DEALER') and @securityService.isQuoteOwner(authentication, #quotationId)")
public QuotationVersionDto createQuotationRevision(String quotationId, QuotationVersionRequest request) { ... }
```

In `SecurityService.java`:
```java
public boolean isDealerLeadOwner(Authentication auth, String leadId) {
    String currentDealerId = getDealerIdFromAuth(auth);
    return leadRepository.existsByIdAndDealerId(leadId, currentDealerId);
}
```

---

## 4. Attack Surface Hardening & OWASP Defenses

1. **SQL Injection**:
   - 100% parameterized queries via Spring Data JPA and Hibernate ORM. Native queries must never concatenate user input.
2. **Cross-Site Scripting (XSS)**:
   - Buyer signals, dealer notes, and accessory packages are sanitized upon entry using the OWASP Java HTML Sanitizer.
   - Frontend React escapes output by default.
3. **Cross-Site Request Forgery (CSRF)**:
   - Stateless JWT architecture using the `Authorization: Bearer` header immune to classic cross-origin cookie CSRF.
   - The `/auth/refresh` endpoint (which uses an HttpOnly cookie) requires a double-submit CSRF cookie or `SameSite=Strict`.
4. **Rate Limiting & Anti-Scraping**:
   - Bucket4j token-bucket filter backed by Redis.
   - Public catalogue browsing: 100 req/min.
   - OTP generation: 3 req/15 min per phone number / IP.
   - Quotation submissions: 30 req/min per verified dealer.
5. **Data at Rest & Transit**:
   - All network traffic enforced over TLS 1.3 with HSTS enabled.
   - MySQL database volume encrypted with AES-256 (AWS KMS / LUKS).
   - Sensitive user fields (email, phone) encrypted at application tier using Hibernate `@ColumnTransformer` or JPA attribute converters using AES-GCM-256.
