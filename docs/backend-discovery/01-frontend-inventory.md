# 01 — Frontend Inventory & Data Flow Catalog

## 1. Complete Route Inventory
The frontend uses `react-router-dom` v6 (`src/router.tsx:1-125`). All 25 routes are categorized below by user persona, access permission, and layout wrapping.

| # | Route Path | Component File | Persona / Role | Layout / Wrapper | Purpose & Key State Accessed |
| :- | :--- | :--- | :--- | :--- | :--- |
| 1 | `/` | `src/pages/HomePage.tsx` | Public / All | `PublicLayout` | Landing page, platform USP, active group highlights (`cars`, `groups`, `dealers`). |
| 2 | `/cars` | `src/pages/CarsPage.tsx` | Public / Buyer | `PublicLayout` | Vehicle catalogue with filter by brand, fuel, transmission, price range (`cars`). |
| 3 | `/cars/:id` | `src/pages/CarDetailPage.tsx` | Public / Buyer | `PublicLayout` | Variant breakdown, pricing specs, active groups for model (`cars`, `groups`). |
| 4 | `/groups` | `src/pages/GroupsPage.tsx` | Public / Buyer | `PublicLayout` | Demand group directory with search, city filter, stage filter (`groups`, `cars`). |
| 5 | `/groups/:id` | `src/pages/GroupDetailPage.tsx` | Public / Buyer | `PublicLayout` | Group progression bar, buyer signals, received quotes, join CTA (`groups`, `memberships`, `quotations`). |
| 6 | `/how-it-works` | `src/pages/HowItWorksPage.tsx` | Public / All | `PublicLayout` | Educational walkthrough explaining 4-step group buying lifecycle. |
| 7 | `/pricing-transparency` | `src/pages/PricingTransparencyPage.tsx` | Public / All | `PublicLayout` | Educational breakdown of Ex-showroom, RTO, Insurance, TCS, GST, handling charges. |
| 8 | `/dealers/info` | `src/pages/DealerLandingPage.tsx` | Public / Dealer | `PublicLayout` | Dealer partnership value proposition, verified lead quality metrics, signup CTA. |
| 9 | `/signin` | `src/pages/SignInPage.tsx` | Public / All | Standalone | Demo persona switcher & OTP simulator (Buyer, Dealer, Admin personas). |
| 10 | `/buyer/dashboard` | `src/pages/buyer/BuyerDashboardPage.tsx` | Buyer | `BuyerLayout` | Overview of joined groups, active signals, quotation alerts, consent leads. |
| 11 | `/buyer/groups` | `src/pages/buyer/BuyerGroupsPage.tsx` | Buyer | `BuyerLayout` | Buyer's enrolled demand groups with status tags (`memberships`, `groups`). |
| 12 | `/buyer/quotes` | `src/pages/buyer/BuyerQuotesPage.tsx` | Buyer | `BuyerLayout` | Side-by-side quotation comparison matrix with line-item breakdowns (`quotations`). |
| 13 | `/buyer/leads` | `src/pages/buyer/BuyerLeadsPage.tsx` | Buyer | `BuyerLayout` | Consented leads tracking dealer contact, status updates, and withdrawal CTA. |
| 14 | `/buyer/profile` | `src/pages/buyer/BuyerProfilePage.tsx` | Buyer | `BuyerLayout` | Personal info (name, phone, email, city, PIN code), notification preferences. |
| 15 | `/dealer/dashboard` | `src/pages/dealer/DealerDashboardPage.tsx` | Dealer | `DealerLayout` | Aggregated demand signals, quote submission status, lead conversion pipeline. |
| 16 | `/dealer/groups` | `src/pages/dealer/DealerGroupsPage.tsx` | Dealer | `DealerLayout` | Browse target groups open for bidding matching dealership brand and territory. |
| 17 | `/dealer/quotes` | `src/pages/dealer/DealerQuotesPage.tsx` | Dealer | `DealerLayout` | Quotation submission & revision interface with on-road pricing builder. |
| 18 | `/dealer/leads` | `src/pages/dealer/DealerLeadsPage.tsx` | Dealer | `DealerLayout` | Unlocked buyer leads with contact cards, status dropdown, notes, dispute CTA. |
| 19 | `/dealer/profile` | `src/pages/dealer/DealerProfilePage.tsx` | Dealer | `DealerLayout` | Dealership legal name, GSTIN, trade license, OEM dealership certificate, addresses. |
| 20 | `/admin/dashboard` | `src/pages/admin/AdminDashboardPage.tsx` | Admin | `AdminLayout` | Platform KPI metrics: GMV, verified members, quote volume, lead dispute queue. |
| 21 | `/admin/dealers` | `src/pages/admin/AdminDealersPage.tsx` | Admin | `AdminLayout` | Dealer KYC verification queue (Approve/Reject/Request Info). |
| 22 | `/admin/disputes` | `src/pages/admin/AdminDisputesPage.tsx` | Admin | `AdminLayout` | Lead dispute arbitration console (Valid Lead, Refund Dealer, Penalize). |
| 23 | `/admin/moderation` | `src/pages/admin/AdminModerationPage.tsx` | Admin | `AdminLayout` | Content moderation console for buyer signals, notes, and quote justifications. |
| 24 | `/admin/catalogue` | `src/pages/admin/AdminCataloguePage.tsx` | Admin | `AdminLayout` | Vehicle catalogue management (Add Model, Add Variant, Toggle Active). |
| 25 | `/admin/audit` | `src/pages/admin/AdminAuditPage.tsx` | Admin | `AdminLayout` | Immutable system audit log viewer (`auditEvents`). |

---

## 2. Zustand Actions & State Mutation Catalog
The entire client-side state is governed by `src/store/index.ts`. All 18 actions, their parameters, business checks, and side effects are detailed below:

### 1. `switchUser(userId: string)` (`src/store/index.ts:311`)
- **Inputs**: `userId: string`
- **Mutations**: Updates `currentUser` object to the matching user from `mockUsers`.
- **Backend Equivalent**: `POST /api/v1/auth/login` or `POST /api/v1/auth/switch-persona` (dev mode only).

### 2. `joinGroup(groupId: string, buyerSignal?: Partial<BuyerSignal>)` (`src/store/index.ts:327`)
- **Inputs**: `groupId: string`, optional `buyerSignal` (`timelineMonths`, `purchaseMode`, `exchangeCar`, `notes`).
- **Validations**:
  - `currentUser` must exist.
  - User cannot already be a member (`groupMemberships.some(m => m.groupId === groupId && m.userId === currentUser.id)`).
  - Target group cannot be `CLOSED` or `CANCELLED`.
  - Max member limit enforcement (`group.currentMembers < group.targetMembers * 1.5`).
- **Mutations**:
  - Creates new `GroupMembership` (`status: 'ACTIVE'`, `joinedAt: now`).
  - Increments `group.currentMembers`.
  - Creates `BuyerSignal` record if payload provided.
  - Emits `Notification` and `AuditEvent`.
- **Backend Equivalent**: `POST /api/v1/groups/{id}/memberships`

### 3. `leaveGroup(groupId: string)` (`src/store/index.ts:384`)
- **Inputs**: `groupId: string`
- **Validations**: User must be an active member. Cannot leave if group is in `LOCKED_NEGOTIATION` without confirmation.
- **Mutations**: Sets `GroupMembership.status = 'LEFT'`, decrements `group.currentMembers`, logs `AuditEvent`.
- **Backend Equivalent**: `DELETE /api/v1/groups/{id}/memberships/me`

### 4. `createGroupWithMembership(groupData, signalData)` (`src/store/index.ts:422`)
- **Inputs**: `CreateGroupPayload`, `CreateSignalPayload`
- **Validations**: Car and variant must exist and be active. Minimum target members >= 3. Expiry date >= 7 days in future.
- **Mutations**: Inserts `BuyerGroup` (stage: `FORMATION`), creates initiator `GroupMembership`, inserts `BuyerSignal`.
- **Backend Equivalent**: `POST /api/v1/groups`

### 5. `submitBuyerSignal(signalData)` (`src/store/index.ts:489`)
- **Inputs**: `groupId`, `timelineMonths`, `purchaseMode`, `exchangeCar`, `notes`
- **Validations**: User must be an active group member. One active signal per member per group.
- **Mutations**: Creates `BuyerSignal`, triggers moderation scan if notes contain URLs or prohibited keywords.
- **Backend Equivalent**: `POST /api/v1/groups/{id}/signals`

### 6. `publishQuotationVersion(quoteId, versionData)` (`src/store/index.ts:542`)
- **Inputs**: `quoteId: string`, `versionData: QuotationVersionPayload`
- **Validations**:
  - Current user must be a verified dealer (`dealer.status === 'VERIFIED'`).
  - Dealership must hold franchise for the car's brand.
  - Price components must satisfy: `onRoadTotal == exShowroom + registration + insurance + accessories + other - discount`.
  - Validity date must be in the future.
- **Mutations**:
  - Finds parent `Quotation` or creates new root quote.
  - Appends new `QuotationVersion` (`versionNumber = prevVersion + 1`).
  - Updates `Quotation.currentVersionId`.
  - Dispatches quote alerts to all active group members.
- **Backend Equivalent**: `POST /api/v1/quotations/{id}/versions`

### 7. `grantConsentAndCreateLead(quotationId, versionId, notes?)` (`src/store/index.ts:639`)
- **Inputs**: `quotationId: string`, `versionId: string`, `notes?: string`
- **Validations**:
  - User must be a member of the group tied to the quotation.
  - Quotation version must still be active and not expired.
  - User has not already granted consent for this quotation.
- **Mutations**:
  - Creates `Consent` record (`status: 'GRANTED'`, `grantedAt: now`).
  - Creates `Lead` record (`status: 'DEMO_DELIVERED'`, `dealerId`, `buyerId`, `buyerName`, `buyerPhone`, `buyerEmail`).
  - Creates initial `LeadEvent` (`eventType: 'LEAD_CREATED'`).
  - Notifies dealer of unlocked buyer contact.
- **Backend Equivalent**: `POST /api/v1/quotations/{id}/versions/{versionId}/consent` (ACID transaction)

### 8. `withdrawConsent(consentId: string, reason: string)` (`src/store/index.ts:705`)
- **Inputs**: `consentId: string`, `reason: string`
- **Validations**: User must own the consent record. Consent must currently be `GRANTED`.
- **Mutations**: Sets `Consent.status = 'REVOKED'`, sets `Lead.status = 'CONSENT_REVOKED'`, appends `LeadEvent`.
- **Backend Equivalent**: `POST /api/v1/consents/{id}/revoke`

### 9. `updateLeadStatus(leadId: string, newStatus: LeadStatus, note?: string)` (`src/store/index.ts:742`)
- **Inputs**: `leadId: string`, `newStatus: LeadStatus`, `note?: string`
- **Validations**: Dealer must own the lead. Valid state machine transition.
- **Mutations**: Updates `Lead.status`, appends `LeadEvent`.
- **Backend Equivalent**: `PATCH /api/v1/dealer/leads/{id}/status`

### 10. `addLeadDealerNote(leadId: string, noteText: string)` (`src/store/index.ts:780`)
- **Inputs**: `leadId: string`, `noteText: string`
- **Validations**: Dealer must own the lead. Note length <= 1,000 chars.
- **Mutations**: Appends to `Lead.dealerNotes` and logs `LeadEvent`.
- **Backend Equivalent**: `POST /api/v1/dealer/leads/{id}/notes`

### 11. `submitLeadDispute(leadId: string, reason: string, evidenceText: string)` (`src/store/index.ts:810`)
- **Inputs**: `leadId: string`, `reason: DisputeReason`, `evidenceText: string`
- **Validations**: Lead must be in valid disputable status. Only one open dispute per lead.
- **Mutations**: Creates `LeadDispute` (`status: 'OPEN'`), sets `Lead.status = 'DISPUTED'`.
- **Backend Equivalent**: `POST /api/v1/dealer/leads/{id}/disputes`

### 12. `resolveLeadDispute(disputeId: string, resolution: DisputeResolution, notes: string)` (`src/store/index.ts:850`)
- **Inputs**: `disputeId: string`, `resolution: DisputeResolution`, `notes: string`
- **Validations**: Current user must have `ADMIN` role.
- **Mutations**: Updates `LeadDispute.status = 'RESOLVED'`, sets `resolution`, updates `Lead.status` accordingly.
- **Backend Equivalent**: `POST /api/v1/admin/disputes/{id}/resolve`

### 13. `reviewDealerApplication(dealerId: string, action: 'APPROVE' | 'REJECT', notes?: string)` (`src/store/index.ts:892`)
- **Inputs**: `dealerId: string`, `action: 'APPROVE' | 'REJECT'`, `notes?: string`
- **Validations**: Admin permission required. Dealer must be `PENDING_VERIFICATION`.
- **Mutations**: Sets `Dealer.status = 'VERIFIED'` or `'REJECTED'`, creates audit entry.
- **Backend Equivalent**: `POST /api/v1/admin/dealers/{id}/review`

### 14. `moderateContentItem(itemId: string, action: 'APPROVE' | 'REJECT')` (`src/store/index.ts:930`)
- **Inputs**: `itemId: string`, `action: 'APPROVE' | 'REJECT'`
- **Mutations**: Updates `ModerationItem.status`, applies text suppression if rejected.
- **Backend Equivalent**: `POST /api/v1/admin/moderation/{id}/action`

### 15. `updateGroupStatus(groupId: string, newStatus: GroupStage)` (`src/store/index.ts:960`)
- **Inputs**: `groupId: string`, `newStatus: GroupStage`
- **Mutations**: Updates `BuyerGroup.stage`, logs status change event.
- **Backend Equivalent**: `PATCH /api/v1/admin/groups/{id}/status`

### 16. `addCatalogueCar(carData: Car)` (`src/store/index.ts:995`)
- **Inputs**: `Car` payload with nested `variants`
- **Mutations**: Appends to `cars` catalogue.
- **Backend Equivalent**: `POST /api/v1/admin/catalogue/cars`

### 17. `toggleCarActive(carId: string)` & `toggleVariantActive(carId, variantId)` (`src/store/index.ts:1030`)
- **Inputs**: IDs
- **Mutations**: Toggles `isActive` boolean flag on Car or Variant.
- **Backend Equivalent**: `PATCH /api/v1/admin/catalogue/cars/{id}/toggle-active`

### 18. `markNotificationRead(notificationId: string)` (`src/store/index.ts:1070`)
- **Inputs**: `notificationId: string`
- **Mutations**: Sets `Notification.read = true`.
- **Backend Equivalent**: `PATCH /api/v1/notifications/{id}/read`

---

## 3. Mock Data Inventory (`src/data/mockData.ts`)
The mock dataset contains production-mimicking seed entities:

| Entity Name | Records Count | Key Samples & Identifiers |
| :--- | :--- | :--- |
| **Users** | 4 | `user_buyer_1` (Rahul Sharma, Buyer), `user_buyer_2` (Priya Patel, Buyer), `user_dealer_1` (Vikram Malhotra, Dealer), `user_admin_1` (Admin User, Superadmin). |
| **Cars** | 6 | Hyundai Creta, Tata Nexon, Mahindra XUV700, Maruti Suzuki Grand Vitara, Kia Seltos, Honda Elevate. |
| **Car Variants** | 14 | Creta SX (O) Turbo DCT, Nexon Fearless+ S, XUV700 AX7 L Diesel AT, Grand Vitara Alpha Hybrid, etc. |
| **Buyer Groups** | 4 | `grp_creta_blr` (Bengaluru, Active), `grp_nexon_del` (Delhi NCR, Quoting), `grp_xuv_mum` (Mumbai, Review), `grp_vitara_hyd` (Hyderabad, Formation). |
| **Memberships** | 12 | Distributed memberships linking buyer personas to groups. |
| **Buyer Signals** | 8 | Intent records capturing timeline (e.g. `WITHIN_30_DAYS`), cash/finance, exchange requirements. |
| **Dealerships** | 3 | Trident Hyundai (Verified), Tata Motors Concorde (Verified), Sireesh Auto Mahindra (Pending). |
| **Quotations** | 5 | Multi-dealer quotes submitted for Creta, Nexon, and XUV700 groups. |
| **Quotation Versions** | 8 | Version histories illustrating discount increments (e.g. v1 with ₹25k off, v2 with ₹38k off). |
| **Consents** | 4 | Consent records granting dealer access to buyer details. |
| **Leads** | 4 | Unlocked leads tracking sales calls, showroom visits, and booking conversions. |
| **Lead Disputes** | 2 | Disputes filed for invalid phone number and out-of-territory buyer. |
| **Audit Events** | 15 | Immutable system trail tracking logins, quote submissions, consent revocations. |

---

## 4. Network Layer Audit
An exhaustive regex search across `src/` for `fetch(`, `axios`, `XMLHttpRequest`, `WebSocket`, and `/api/` yielded **0 network requests**.
All components read exclusively from `useAppStore()` and write via the 18 Zustand actions. The backend must provide a drop-in REST API client layer (`src/api/client.ts`) to substitute this mock layer without altering UI component signatures.
