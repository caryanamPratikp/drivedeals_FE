# 02 — Domain Model & Entity Specifications

## 1. Core Domain Model Overview
The MOTORCIRCLE domain is designed around a multi-stage, privacy-first automotive group buying lifecycle. The domain entities are modeled in TypeScript at `src/types/index.ts` and encapsulated in state mutations at `src/store/index.ts`.

```
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │ 1
                             │
            ┌────────────────┼────────────────┐
            │ 1..*           │ 1..*           │ 1 (Dealer User)
            ▼                ▼                ▼
  ┌──────────────────┐ ┌───────────┐ ┌──────────────────┐
  │ GroupMembership  │ │  Consent  │ │      Dealer      │
  └─────────┬────────┘ └─────┬─────┘ └────────┬─────────┘
            │ *              │ 1              │ 1
            ▼                ▼                ▼
     ┌─────────────┐   ┌───────────┐    ┌───────────┐
     │ BuyerGroup  │   │   Lead    │◄───┤ Quotation │
     └──────┬──────┘   └─────┬─────┘    └─────┬─────┘
            │ 1              │ 1              │ 1
            ▼                ▼                ▼
     ┌─────────────┐   ┌───────────┐   ┌──────────────────┐
     │ CarVariant  │   │ LeadEvent │   │ QuotationVersion │
     └──────┬──────┘   └───────────┘   └──────────────────┘
            │ *
            ▼
     ┌─────────────┐
     │     Car     │
     └─────────────┘
```

---

## 2. Comprehensive Entity Catalog & Attribute Specifications

### 2.1 `User` (`src/types/index.ts:1-12`)
Represents an authenticated principal on the platform (Buyer, Dealer Representative, or Platform Administrator).
- `id` (`VARCHAR(36)`, PK): UUIDv4 identifier.
- `name` (`VARCHAR(120)`, NOT NULL): Full legal name.
- `email` (`VARCHAR(191)`, UNIQUE, NOT NULL): Normalized RFC 5322 email.
- `phone` (`VARCHAR(15)`, UNIQUE, NOT NULL): E.164 formatted telephone number (`+91XXXXXXXXXX`).
- `role` (`ENUM('BUYER', 'DEALER', 'ADMIN')`, NOT NULL): Global authorization role.
- `city` (`VARCHAR(100)`, NOT NULL): Primary operational or residential city.
- `pincode` (`VARCHAR(10)`, NOT NULL): 6-digit Indian Postal Identification Number.
- `createdAt` (`DATETIME(6)`, NOT NULL): Timestamp of account registration.
- `status` (`ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION')`, NOT NULL): Account lifecycle state.

### 2.2 `Car` & `CarVariant` (`src/types/index.ts:14-41`)
Represents the standardized automotive vehicle catalogue.
- **`Car`**:
  - `id` (`VARCHAR(36)`, PK): e.g., `car_hyundai_creta`.
  - `brand` (`VARCHAR(100)`, NOT NULL): e.g., Hyundai, Tata, Mahindra.
  - `model` (`VARCHAR(100)`, NOT NULL): e.g., Creta, Nexon, XUV700.
  - `bodyType` (`ENUM('SUV', 'SEDAN', 'HATCHBACK', 'MPV', 'EV')`, NOT NULL).
  - `imageUrl` (`VARCHAR(512)`, NOT NULL): CDN hosted asset URL.
  - `minPrice` (`DECIMAL(12,2)`, NOT NULL): Starting ex-showroom price across variants.
  - `maxPrice` (`DECIMAL(12,2)`, NOT NULL): Top-trim ex-showroom price across variants.
  - `isActive` (`BOOLEAN`, NOT NULL, DEFAULT TRUE): Soft-toggle for catalogue availability.
- **`CarVariant`**:
  - `id` (`VARCHAR(36)`, PK): e.g., `var_creta_sx_o_turbo`.
  - `carId` (`VARCHAR(36)`, FK -> `Car.id`, NOT NULL): Parent model reference.
  - `name` (`VARCHAR(120)`, NOT NULL): Trim name (e.g., `SX (O) 1.5 Turbo DCT`).
  - `fuelType` (`ENUM('PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID')`, NOT NULL).
  - `transmission` (`ENUM('MANUAL', 'AUTOMATIC', 'IMT', 'EV')`, NOT NULL).
  - `exShowroomPrice` (`DECIMAL(12,2)`, NOT NULL): Base OEM published invoice benchmark.
  - `keyFeatures` (`JSON` array of strings): Standard equipment list.
  - `isActive` (`BOOLEAN`, NOT NULL, DEFAULT TRUE).

### 2.3 `BuyerGroup` (`src/types/index.ts:43-70`)
Represents an aggregated demand cohort bounded by variant, region, and time.
- `id` (`VARCHAR(36)`, PK): UUIDv4 / domain code (e.g., `grp_creta_blr`).
- `carId` (`VARCHAR(36)`, FK -> `Car.id`, NOT NULL): Associated car model.
- `variantId` (`VARCHAR(36)`, FK -> `CarVariant.id`, NOT NULL): Strict variant anchor.
- `city` (`VARCHAR(100)`, NOT NULL): Regional delivery territory (e.g., Bengaluru).
- `targetMembers` (`INT`, NOT NULL): Minimum quota required to open quotation bidding (typically 5 to 15).
- `currentMembers` (`INT`, NOT NULL, DEFAULT 0): Count of active members.
- `stage` (`ENUM`, NOT NULL): Lifecycle state (`FORMATION`, `OPEN_FOR_QUOTES`, `UNDER_REVIEW`, `CLOSED`, `CANCELLED`).
- `expiresAt` (`DATETIME(6)`, NOT NULL): Window closing deadline.
- `createdAt` (`DATETIME(6)`, NOT NULL).
- `createdBy` (`VARCHAR(36)`, FK -> `User.id`, NOT NULL): Initiator member ID.

### 2.4 `GroupMembership` (`src/types/index.ts:72-84`)
Represents the participation of a buyer in a specific demand group.
- `id` (`VARCHAR(36)`, PK): UUIDv4.
- `groupId` (`VARCHAR(36)`, FK -> `BuyerGroup.id`, NOT NULL).
- `userId` (`VARCHAR(36)`, FK -> `User.id`, NOT NULL).
- `status` (`ENUM('ACTIVE', 'LEFT', 'COMPLETED')`, NOT NULL, DEFAULT 'ACTIVE').
- `joinedAt` (`DATETIME(6)`, NOT NULL).
- `leftAt` (`DATETIME(6)`, NULLABLE).
- *Constraint*: `UNIQUE(groupId, userId)` where status = `'ACTIVE'`.

### 2.5 `BuyerSignal` (`src/types/index.ts:86-102`)
Telemetry captured from a buyer indicating concrete purchase readiness and commercial profile.
- `id` (`VARCHAR(36)`, PK): UUIDv4.
- `groupId` (`VARCHAR(36)`, FK -> `BuyerGroup.id`, NOT NULL).
- `userId` (`VARCHAR(36)`, FK -> `User.id`, NOT NULL).
- `timelineMonths` (`ENUM('IMMEDIATE_15_DAYS', 'WITHIN_30_DAYS', '30_TO_60_DAYS', 'EXPLORING')`, NOT NULL).
- `purchaseMode` (`ENUM('CASH', 'FINANCE', 'LEASE')`, NOT NULL).
- `exchangeCar` (`BOOLEAN`, NOT NULL, DEFAULT FALSE).
- `exchangeCarDetails` (`VARCHAR(255)`, NULLABLE): e.g., "2018 Swift VXi 45k km".
- `notes` (`TEXT`, NULLABLE): Buyer remarks (subject to automated moderation).
- `createdAt` (`DATETIME(6)`, NOT NULL).

### 2.6 `Dealer` (`src/types/index.ts:104-125`)
Represents an OEM-authorized automotive dealership entity.
- `id` (`VARCHAR(36)`, PK): UUIDv4.
- `userId` (`VARCHAR(36)`, FK -> `User.id`, UNIQUE, NOT NULL): Principal dealer contact account.
- `dealershipName` (`VARCHAR(191)`, NOT NULL): Legal registered name (e.g., "Trident Hyundai Ltd").
- `brand` (`VARCHAR(100)`, NOT NULL): Franchise OEM brand.
- `city` (`VARCHAR(100)`, NOT NULL): City of physical showroom.
- `address` (`TEXT`, NOT NULL): Physical showroom premises address.
- `gstin` (`VARCHAR(15)`, UNIQUE, NOT NULL): 15-character statutory GST identification number.
- `status` (`ENUM('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'SUSPENDED')`, NOT NULL).
- `rating` (`DECIMAL(3,2)`, NOT NULL, DEFAULT 5.00): Aggregated platform rating.
- `totalQuotes` (`INT`, NOT NULL, DEFAULT 0).
- `totalLeadsDelivered` (`INT`, NOT NULL, DEFAULT 0).
- `verifiedAt` (`DATETIME(6)`, NULLABLE).

### 2.7 `Quotation` & `QuotationVersion` (`src/types/index.ts:127-165`)
Structured quotation submitted by a dealership in response to an active group's demand.
- **`Quotation`**:
  - `id` (`VARCHAR(36)`, PK): UUIDv4.
  - `groupId` (`VARCHAR(36)`, FK -> `BuyerGroup.id`, NOT NULL).
  - `dealerId` (`VARCHAR(36)`, FK -> `Dealer.id`, NOT NULL).
  - `currentVersionId` (`VARCHAR(36)`, NULLABLE): Points to latest active revision.
  - `status` (`ENUM('DRAFT', 'SUBMITTED', 'REVISED', 'EXPIRED', 'WITHDRAWN')`, NOT NULL).
  - `createdAt` (`DATETIME(6)`, NOT NULL).
  - `updatedAt` (`DATETIME(6)`, NOT NULL).
- **`QuotationVersion`** (Immutable snapshot):
  - `id` (`VARCHAR(36)`, PK): UUIDv4.
  - `quotationId` (`VARCHAR(36)`, FK -> `Quotation.id`, NOT NULL).
  - `versionNumber` (`INT`, NOT NULL): Sequential version (1, 2, ...).
  - `exShowroomPrice` (`DECIMAL(12,2)`, NOT NULL).
  - `registrationCharges` (`DECIMAL(12,2)`, NOT NULL): State RTO tax.
  - `insuranceCharges` (`DECIMAL(12,2)`, NOT NULL): Comprehensive motor insurance.
  - `accessoriesCharges` (`DECIMAL(12,2)`, NOT NULL, DEFAULT 0.00).
  - `otherCharges` (`DECIMAL(12,2)`, NOT NULL, DEFAULT 0.00): Fastag, handling (must be itemized).
  - `groupDiscount` (`DECIMAL(12,2)`, NOT NULL, DEFAULT 0.00): Platform group concession.
  - `corporateDiscount` (`DECIMAL(12,2)`, NOT NULL, DEFAULT 0.00).
  - `exchangeBonus` (`DECIMAL(12,2)`, NOT NULL, DEFAULT 0.00).
  - `totalOnRoadPrice` (`DECIMAL(12,2)`, NOT NULL): Server-derived formula total.
  - `accessoryPackage` (`TEXT`, NULLABLE): Itemized inclusions.
  - `warrantyYears` (`INT`, NOT NULL, DEFAULT 3): OEM + Extended warranty duration.
  - `validUntil` (`DATETIME(6)`, NOT NULL): Quotation expiration timestamp.
  - `deliveryTimelineWeeks` (`INT`, NOT NULL): Promised vehicle delivery window.
  - `createdAt` (`DATETIME(6)`, NOT NULL).

### 2.8 `Consent` (`src/types/index.ts:167-180`)
Legal consent record authorizing the transfer of a buyer's PII to a specific dealership.
- `id` (`VARCHAR(36)`, PK): UUIDv4.
- `userId` (`VARCHAR(36)`, FK -> `User.id`, NOT NULL): Consenting buyer.
- `dealerId` (`VARCHAR(36)`, FK -> `Dealer.id`, NOT NULL): Authorized dealership.
- `quotationId` (`VARCHAR(36)`, FK -> `Quotation.id`, NOT NULL).
- `quotationVersionId` (`VARCHAR(36)`, FK -> `QuotationVersion.id`, NOT NULL): Exact pricing snapshot accepted.
- `status` (`ENUM('GRANTED', 'REVOKED', 'EXPIRED')`, NOT NULL, DEFAULT 'GRANTED').
- `grantedAt` (`DATETIME(6)`, NOT NULL).
- `revokedAt` (`DATETIME(6)`, NULLABLE).
- `revocationReason` (`VARCHAR(255)`, NULLABLE).

### 2.9 `Lead`, `LeadEvent`, & `LeadDispute` (`src/types/index.ts:182-225`)
Commercial handoff generated upon explicit consent.
- **`Lead`**:
  - `id` (`VARCHAR(36)`, PK): UUIDv4.
  - `consentId` (`VARCHAR(36)`, FK -> `Consent.id`, UNIQUE, NOT NULL).
  - `dealerId` (`VARCHAR(36)`, FK -> `Dealer.id`, NOT NULL).
  - `buyerId` (`VARCHAR(36)`, FK -> `User.id`, NOT NULL).
  - `quotationId` (`VARCHAR(36)`, FK -> `Quotation.id`, NOT NULL).
  - `quotationVersionId` (`VARCHAR(36)`, FK -> `QuotationVersion.id`, NOT NULL).
  - `status` (`ENUM('DEMO_DELIVERED', 'CONTACTED', 'TEST_DRIVE_SCHEDULED', 'BOOKING_IN_PROGRESS', 'CLOSED_WON', 'CLOSED_LOST', 'DISPUTED', 'CONSENT_REVOKED')`, NOT NULL).
  - `buyerName` (`VARCHAR(120)`, NOT NULL): Unlocked PII snapshot.
  - `buyerPhone` (`VARCHAR(15)`, NOT NULL): Unlocked PII snapshot.
  - `buyerEmail` (`VARCHAR(191)`, NOT NULL): Unlocked PII snapshot.
  - `buyerCity` (`VARCHAR(100)`, NOT NULL).
  - `createdAt` (`DATETIME(6)`, NOT NULL).
  - `updatedAt` (`DATETIME(6)`, NOT NULL).
- **`LeadEvent`**:
  - `id` (`VARCHAR(36)`, PK): UUIDv4.
  - `leadId` (`VARCHAR(36)`, FK -> `Lead.id`, NOT NULL).
  - `eventType` (`ENUM('LEAD_CREATED', 'DEALER_CONTACTED', 'NOTE_ADDED', 'TEST_DRIVE_SET', 'STATUS_CHANGE', 'DISPUTE_FILED', 'CONSENT_REVOKED')`, NOT NULL).
  - `actorId` (`VARCHAR(36)`, FK -> `User.id`, NOT NULL): Who executed the action.
  - `description` (`TEXT`, NOT NULL).
  - `createdAt` (`DATETIME(6)`, NOT NULL).
- **`LeadDispute`**:
  - `id` (`VARCHAR(36)`, PK): UUIDv4.
  - `leadId` (`VARCHAR(36)`, FK -> `Lead.id`, NOT NULL).
  - `dealerId` (`VARCHAR(36)`, FK -> `Dealer.id`, NOT NULL).
  - `reason` (`ENUM('INVALID_CONTACT_INFO', 'OUT_OF_TERRITORY', 'BUYER_UNRESPONSIVE', 'ALREADY_PURCHASED', 'PRICE_MISMATCH')`, NOT NULL).
  - `evidenceText` (`TEXT`, NOT NULL).
  - `status` (`ENUM('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED')`, NOT NULL).
  - `resolution` (`ENUM('REFUND_GRANTED', 'DISPUTE_REJECTED', 'PENALTY_APPLIED')`, NULLABLE).
  - `adminNotes` (`TEXT`, NULLABLE).
  - `resolvedBy` (`VARCHAR(36)`, FK -> `User.id`, NULLABLE).
  - `createdAt` (`DATETIME(6)`, NOT NULL).
  - `resolvedAt` (`DATETIME(6)`, NULLABLE).

### 2.10 Supporting Entities (`AuditEvent`, `Notification`, `ModerationItem`)
- **`AuditEvent`** (`src/types/index.ts:245-257`): Append-only tamper-evident ledger tracking security and business events (`eventType`, `userId`, `resourceType`, `resourceId`, `ipAddress`, `userAgent`, `metadata`).
- **`Notification`** (`src/types/index.ts:227-243`): User inbox alert records (`userId`, `title`, `message`, `type`, `link`, `read`, `createdAt`).
- **`ModerationItem`** (`src/types/index.ts:259-275`): Asynchronous human-in-the-loop content review queue for flags on buyer signals or notes.

---

## 3. Lifecycle State Machines & Domain Invariants

### 3.1 BuyerGroup State Machine
```
[ FORMATION ] ──(Members >= Target)──► [ OPEN_FOR_QUOTES ]
      │                                       │
      │ (Expiry Reached & < Target)           │ (Bidding Window Closes)
      ▼                                       ▼
 [ CANCELLED ]                          [ UNDER_REVIEW ]
                                              │
                                              │ (Offer Evaluation Complete)
                                              ▼
                                          [ CLOSED ]
```
- **Invariants**:
  - A group cannot transition to `OPEN_FOR_QUOTES` unless `currentMembers >= targetMembers`.
  - Once in `UNDER_REVIEW`, new buyer joins are locked to preserve the quotation pricing pool.
  - If `expiresAt` is reached while still in `FORMATION`, state transitions to `CANCELLED`.

### 3.2 QuotationVersion Lifecycle
- **Invariants**:
  - `QuotationVersion` records are **strictly immutable**. Edits create `versionNumber + 1`.
  - Line-item equation:
    `totalOnRoadPrice = (exShowroomPrice + registrationCharges + insuranceCharges + accessoriesCharges + otherCharges) - (groupDiscount + corporateDiscount + exchangeBonus)`
  - `groupDiscount` must be strictly positive (`> 0`).
  - Dealership cannot submit a quote for a group located in a city outside their authorized operational territory.

### 3.3 Consent & Lead Handoff Lifecycle
```
[ NO CONSENT ] ──(Buyer Selects Quote Version)──► [ CONSENT GRANTED / DEMO_DELIVERED ]
                                                            │
                     ┌──────────────────────────────────────┼────────────────────────┐
                     ▼                                      ▼                        ▼
           [ DEALER ENGAGEMENT ]                    [ LEAD DISPUTED ]        [ CONSENT REVOKED ]
        (Contacted -> Test Drive -> Booking)      (Invalid phone/region)   (Buyer exercises right)
```
- **Invariants**:
  - A dealer CANNOT view buyer PII (`phone`, `email`, `name`) without a corresponding active `Consent` record.
  - One consent per buyer per group. Granting consent to Dealership A locks out conflicting leads until resolved or revoked.
  - If a buyer revokes consent, `Lead.status` automatically updates to `CONSENT_REVOKED`, and the dealer loses rights to further outreach.
