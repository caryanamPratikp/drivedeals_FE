# 06 — Business Rules & Algorithmic Specifications

## 1. Automotive Pricing & Quotation Calculation Engine

### 1.1 Line-Item Pricing Breakdown
In India, the final on-road price paid by a retail customer comprises statutory taxes, dealer accessories, mandatory insurance, and promotional concessions. In the frontend (`src/domain/pricing.ts`), prices are computed using client-side helper functions. In the backend, all computations must be authoritative, server-enforced, and strictly auditable.

The canonical quotation pricing formula is:

$$\text{Gross Total} = \text{ExShowroom} + \text{Registration} + \text{Insurance} + \text{Accessories} + \text{Other}$$

$$\text{Total Deductions} = \text{GroupDiscount} + \text{CorporateDiscount} + \text{ExchangeBonus}$$

$$\text{Total On-Road Price} = \text{Gross Total} - \text{Total Deductions}$$

### 1.2 Statutory Tax & Fee Invariants
1. **Ex-Showroom Base Benchmark**:
   - Must match the OEM published ex-showroom price for the variant within $\pm 0.5\%$ to prevent artificial inflation before discount application.
2. **Tax Collected at Source (TCS)**:
   - Under Section 206C(1F) of the Indian Income Tax Act, TCS @ 1% is statutorily mandatory for vehicle purchases where the gross ex-showroom exceeds ₹10,00,000 (unless PAN is absent, where it rises to 5%).
   - The backend calculation engine must automatically verify that `otherCharges` or dedicated `tcsCharges` reflects this statutory requirement.
3. **Registration (RTO) Slabs**:
   - State RTO charges vary significantly by fuel type (EV vs Petrol vs Diesel) and state/city (e.g., Karnataka charges ~18-20% on cars > ₹20L, Delhi charges ~10-12%, EVs often receive 0% RTO subsidies).
   - Backend validation ensures registration charges submitted by dealerships fall within realistic state tariff boundaries.
4. **Group Discount Invariant**:
   - `groupDiscount` must be strictly greater than zero (`> 0.00`).
   - `totalOnRoadPrice` must never be less than `exShowroomPrice * 0.70` (preventing unrealistic typographical errors or bait pricing).

---

## 2. Demand Group Dynamics & Lifecycle Engine

### 2.1 State Progression Rules
The demand group progression is governed by strict deterministic rules:

```
+---------------+         currentMembers >= targetMembers         +------------------+
|   FORMATION   | ───────────────────────────────────────────────> | OPEN_FOR_QUOTES  |
+---------------+                                                 +------------------+
        │                                                                   │
        │ expiresAt reached AND                                             │ biddingDuration ends
        │ currentMembers < targetMembers                                    │ (e.g. 7 days)
        ▼                                                                   ▼
+---------------+                                                 +------------------+
|   CANCELLED   |                                                 |   UNDER_REVIEW   |
+---------------+                                                 +------------------+
                                                                            │
                                                                            │ evaluation complete
                                                                            ▼
                                                                  +------------------+
                                                                  |      CLOSED      |
                                                                  +------------------+
```

1. **Formation to Open for Quotes**:
   - Triggered automatically when `currentMembers >= targetMembers` (`src/store/index.ts:349`).
   - Group notifications are broadcast to all franchise dealers registered in that city.
2. **Quota Capping**:
   - Groups permit a maximum overflow cap of $150\%$ of `targetMembers` (e.g. target 10, cap 15) to preserve group cohesion and prevent unmanageable quote volumes.
3. **Scheduled Expiration Sweep**:
   - A Spring Scheduled background task (`@Scheduled(cron = "0 */10 * * * *")`) evaluates groups where `now() > expiresAt`.
   - If `FORMATION` and unmet threshold $\rightarrow$ transition to `CANCELLED`.
   - If `OPEN_FOR_QUOTES` and bidding window expired $\rightarrow$ transition to `UNDER_REVIEW`.

---

## 3. Buyer Signals & Aggregated Demand Telemetry

To protect buyer privacy, dealerships never see individual signal rows. Instead, the backend aggregates signals into a statistical cohort summary (`src/domain/explanations.ts`):

```json
{
  "totalMembers": 8,
  "timelineBreakdown": {
    "IMMEDIATE_15_DAYS": 3,
    "WITHIN_30_DAYS": 4,
    "30_TO_60_DAYS": 1,
    "EXPLORING": 0
  },
  "purchaseModeRatio": {
    "FINANCE": 0.75,
    "CASH": 0.25,
    "LEASE": 0.0
  },
  "exchangeCarCount": 3,
  "popularColors": ["White", "Titan Grey"]
}
```

### Automated Signal Content Moderation
Before a buyer's custom note is accepted, the backend executes automated regex filtering (`src/domain/moderation.ts`):
- **Phone Number Detection**: Regex scans for 10-digit Indian numbers (`/(\+91[\-\s]?)?[6789]\d{9}/`). If matched, the note is flagged and redacted.
- **Email Detection**: RFC 5322 regex.
- **External Links**: Detection of URLs (`http://`, `https://`, `.com`, `.in`).
- If flagged, `ModerationItem` is created with status `PENDING`, and buyer note is suppressed until admin approval.

---

## 4. Consent Handshake & Lead Generation Guarantees

### 4.1 ACID Transaction Boundary
The creation of a `Consent` and the unlocking of a `Lead` (`src/store/index.ts:639-688`) must be strictly atomic in the backend:

```java
@Transactional(isolation = Isolation.REPEATABLE_READ, rollbackFor = Exception.class)
public LeadHandshakeResult grantConsent(String userId, String quoteId, String versionId, String notes) {
    // 1. Verify User is active member of group
    // 2. Verify Quotation is ACTIVE and Version is valid
    // 3. Ensure no prior active consent exists for this user in this group
    // 4. Create Consent entity (status = GRANTED)
    // 5. Create Lead entity (status = DEMO_DELIVERED) with snapshot of buyer PII
    // 6. Create LeadEvent (eventType = LEAD_CREATED)
    // 7. Update Dealer lead counter
    // 8. Publish LeadDeliveredEvent (asynchronously sends SMS/email to dealer)
}
```

### 4.2 Consent Revocation Invariant
If a buyer revokes consent (`src/store/index.ts:705-738`):
- `Consent.status` becomes `REVOKED`.
- `Lead.status` transitions immediately to `CONSENT_REVOKED`.
- The dealer’s lead view in the UI immediately hides the phone number and email, displaying: *"Buyer has revoked contact consent. Do not contact."*
- Any ongoing automated dealer follow-up messages are terminated.

---

## 5. Lead Dispute & Arbitration Rules

Dealerships pay for or consume quotas for delivered leads. A structured dispute arbitration mechanism protects dealers against bad-faith or erroneous signals (`src/store/index.ts:810-880`).

### 5.1 Dispute Eligibility Window
- A dealer may file a dispute within **72 hours** of lead delivery.
- Disputes filed after 72 hours are automatically rejected by the system.

### 5.2 Valid Grounds for Dispute
1. `INVALID_CONTACT_INFO`: Phone number does not ring, is out of service, or belongs to an unrelated third party (evidence required: call logs).
2. `OUT_OF_TERRITORY`: Buyer resides outside dealer’s authorized RTO licensing jurisdiction.
3. `BUYER_UNRESPONSIVE`: Buyer fails to answer minimum 3 logged call attempts over 48 hours.
4. `ALREADY_PURCHASED`: Buyer purchased another vehicle prior to lead delivery.

### 5.3 Administrative Arbitration Outcomes
- **`REFUND_GRANTED`**: Lead fee is credited back to the dealer's account; lead is marked `REFUNDED`.
- **`DISPUTE_REJECTED`**: Admin determines the lead was legitimate (e.g. buyer confirms they were available); lead remains active.
- **`PENALTY_APPLIED`**: If dealer filed a fraudulent dispute or harassed the buyer, a penalty flag is added to the dealer profile.
