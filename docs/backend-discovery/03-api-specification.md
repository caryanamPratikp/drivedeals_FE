# 03 — REST API Specification

## 1. Global API Standards & Conventions
- **Base URI**: `https://api.motorcircle.in/api/v1`
- **Protocol & Serialization**: HTTPS only, JSON (`application/json; charset=UTF-8`).
- **Authentication**: Bearer Token in `Authorization: Bearer <JWT_ACCESS_TOKEN>`.
- **Date/Time Standard**: ISO-8601 UTC (`YYYY-MM-DDTHH:mm:ss.SSSZ`).
- **Monetary Representation**: Numeric strings or 2-decimal numbers in JSON (`"1545000.00"` or `1545000.00`) mapping to `BigDecimal` on server.
- **Pagination**: Zero-indexed: `?page=0&size=20&sort=createdAt,desc`.
  ```json
  {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 142,
    "totalPages": 8,
    "first": true,
    "last": false
  }
  ```
- **Error Format (RFC 7807 Problem Details)**:
  ```json
  {
    "type": "https://api.motorcircle.in/errors/INSUFFICIENT_GROUP_SIZE",
    "title": "Group Member Threshold Not Met",
    "status": 400,
    "detail": "Quotation submission requires the group to reach at least 5 verified members.",
    "instance": "/api/v1/quotations",
    "timestamp": "2026-10-26T13:45:00Z",
    "validationErrors": []
  }
  ```

---

## 2. API Endpoint Matrix by Functional Module

### 2.1 Authentication & Profile Module

#### `POST /auth/otp/send`
- **Access**: Public
- **Request Body**:
  ```json
  { "phone": "+919876543210" }
  ```
- **Response (200 OK)**:
  ```json
  { "success": true, "message": "OTP dispatched via SMS", "retryAfterSeconds": 60 }
  ```

#### `POST /auth/otp/verify`
- **Access**: Public
- **Request Body**:
  ```json
  { "phone": "+919876543210", "otp": "123456" }
  ```
- **Response (200 OK)**:
  ```json
  {
    "tokenType": "Bearer",
    "accessToken": "eyJhbGciOi...",
    "expiresIn": 900,
    "user": {
      "id": "user_buyer_1",
      "name": "Rahul Sharma",
      "role": "BUYER",
      "phone": "+919876543210",
      "city": "Bengaluru"
    }
  }
  ```
- **Set-Cookie Header**: `RefreshToken=<uuid>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=604800`

#### `GET /auth/me`
- **Access**: `ROLE_BUYER`, `ROLE_DEALER`, `ROLE_ADMIN`
- **Response (200 OK)**: Returns authenticated `User` profile.

---

### 2.2 Vehicle Catalogue Module

#### `GET /catalogue/cars`
- **Access**: Public
- **Query Params**: `brand`, `bodyType`, `fuelType`, `minPrice`, `maxPrice`
- **Response (200 OK)**: Array of `Car` entities with nested active `CarVariant` items.

#### `GET /catalogue/cars/{id}`
- **Access**: Public
- **Response (200 OK)**: Full details of vehicle including all variants and technical specifications.

---

### 2.3 Demand Groups Module

#### `GET /groups`
- **Access**: Public
- **Query Params**: `city`, `brand`, `stage`, `page`, `size`
- **Response (200 OK)**: Paginated `BuyerGroup` representations with aggregate summary.

#### `GET /groups/{id}`
- **Access**: Public
- **Response (200 OK)**:
  ```json
  {
    "id": "grp_creta_blr",
    "car": { "id": "car_hyundai_creta", "brand": "Hyundai", "model": "Creta" },
    "variant": { "id": "var_creta_sx_o_turbo", "name": "SX (O) 1.5 Turbo DCT", "exShowroomPrice": 2015000.00 },
    "city": "Bengaluru",
    "targetMembers": 5,
    "currentMembers": 4,
    "stage": "FORMATION",
    "expiresAt": "2026-11-15T18:30:00Z",
    "isCurrentUserMember": true
  }
  ```

#### `POST /groups`
- **Access**: `ROLE_BUYER`
- **Request Body**:
  ```json
  {
    "variantId": "var_creta_sx_o_turbo",
    "city": "Bengaluru",
    "targetMembers": 5,
    "signal": {
      "timelineMonths": "WITHIN_30_DAYS",
      "purchaseMode": "FINANCE",
      "exchangeCar": false,
      "notes": "Looking for White or Titan Grey color."
    }
  }
  ```
- **Response (201 Created)**: Returns created `BuyerGroup` with initiator membership.

#### `POST /groups/{id}/memberships`
- **Access**: `ROLE_BUYER`
- **Request Body**:
  ```json
  {
    "signal": {
      "timelineMonths": "IMMEDIATE_15_DAYS",
      "purchaseMode": "CASH",
      "exchangeCar": true,
      "exchangeCarDetails": "2019 Honda City VX"
    }
  }
  ```
- **Response (201 Created)**: Created `GroupMembership` representation.

#### `DELETE /groups/{id}/memberships/me`
- **Access**: `ROLE_BUYER`
- **Response (204 No Content)**.

---

### 2.4 Quotations & Versioning Module

#### `GET /groups/{id}/quotations`
- **Access**: `ROLE_BUYER` (group members only), `ROLE_ADMIN`
- **Response (200 OK)**: Array of `Quotation` entities received for this group. Each quote contains its `currentVersion` and full version history for comparison.

#### `POST /groups/{id}/quotations`
- **Access**: `ROLE_DEALER`
- **Request Body**:
  ```json
  {
    "exShowroomPrice": 2015000.00,
    "registrationCharges": 372775.00,
    "insuranceCharges": 65000.00,
    "accessoriesCharges": 25000.00,
    "otherCharges": 3500.00,
    "groupDiscount": 45000.00,
    "corporateDiscount": 10000.00,
    "exchangeBonus": 15000.00,
    "accessoryPackage": "Basic Kit + 3D Floor Mats + Sunshades",
    "warrantyYears": 5,
    "validUntil": "2026-11-30T23:59:59Z",
    "deliveryTimelineWeeks": 3
  }
  ```
- **Response (201 Created)**: Created `Quotation` with `v1` version object.

#### `POST /quotations/{id}/versions`
- **Access**: `ROLE_DEALER` (owner of quote only)
- **Request Body**: Same quotation version structure with revised discount/charges.
- **Response (201 Created)**: Returns newly created version object (`v2`).

---

### 2.5 Consent & Privacy Handshake Module

#### `POST /quotations/{quoteId}/versions/{versionId}/consent`
- **Access**: `ROLE_BUYER`
- **Request Body**:
  ```json
  {
    "notes": "Interested in booking this Saturday. Please contact via WhatsApp first."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "consentId": "cst_98a72b1",
    "leadId": "lead_44f1c9",
    "status": "GRANTED",
    "grantedAt": "2026-10-26T13:48:00Z",
    "dealerName": "Trident Hyundai",
    "quotationSummary": {
      "onRoadPrice": 2411275.00,
      "savings": 70000.00
    }
  }
  ```

#### `POST /consents/{id}/revoke`
- **Access**: `ROLE_BUYER` (owner of consent)
- **Request Body**:
  ```json
  { "reason": "Dealer did not honor agreed delivery timeline." }
  ```
- **Response (200 OK)**:
  ```json
  { "consentId": "cst_98a72b1", "status": "REVOKED", "revokedAt": "2026-10-26T14:10:00Z" }
  ```

---

### 2.6 Dealer Lead Management Module

#### `GET /dealer/leads`
- **Access**: `ROLE_DEALER`
- **Security Check**: Returns leads where `Lead.dealerId == authenticatedDealer.id`. Zero cross-dealer leakage.
- **Response (200 OK)**: Array of unlocked leads with full buyer contact details.

#### `PATCH /dealer/leads/{id}/status`
- **Access**: `ROLE_DEALER`
- **Request Body**:
  ```json
  { "status": "TEST_DRIVE_SCHEDULED", "note": "Test drive booked for Sunday 11 AM." }
  ```
- **Response (200 OK)**: Updated `Lead` entity.

#### `POST /dealer/leads/{id}/notes`
- **Access**: `ROLE_DEALER`
- **Request Body**:
  ```json
  { "note": "Customer prefers financing through HDFC Bank." }
  ```
- **Response (201 Created)**.

#### `POST /dealer/leads/{id}/disputes`
- **Access**: `ROLE_DEALER`
- **Request Body**:
  ```json
  {
    "reason": "INVALID_CONTACT_INFO",
    "evidenceText": "Phone number is disconnected on 3 separate call attempts across 48 hours."
  }
  ```
- **Response (201 Created)**: Returns created `LeadDispute`.

---

### 2.7 Administration & Governance Module

#### `GET /admin/dealers/pending`
- **Access**: `ROLE_ADMIN`
- **Response (200 OK)**: Array of dealer registration dossiers pending verification.

#### `POST /admin/dealers/{id}/review`
- **Access**: `ROLE_ADMIN`
- **Request Body**:
  ```json
  { "action": "APPROVE", "notes": "GSTIN and OEM franchise certificate verified." }
  ```
- **Response (200 OK)**.

#### `POST /admin/disputes/{id}/resolve`
- **Access**: `ROLE_ADMIN`
- **Request Body**:
  ```json
  {
    "resolution": "REFUND_GRANTED",
    "adminNotes": "Confirmed phone number unreachable. Lead fee credited back to dealership balance."
  }
  ```
- **Response (200 OK)**.

#### `GET /admin/audit`
- **Access**: `ROLE_ADMIN`
- **Query Params**: `userId`, `eventType`, `startDate`, `endDate`, `page`, `size`
- **Response (200 OK)**: Paginated audit event trail.
