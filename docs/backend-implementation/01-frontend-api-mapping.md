# 01 — Frontend Operation to Backend API Mapping

## 1. Architectural Integration Principles
Every client-side mutation currently executed by Zustand in `src/store/index.ts` will be mapped to a clean, RESTful Spring Boot endpoint. In production, an Axios client layer (`src/api/client.ts`) will replace synchronous local state mutations with asynchronous HTTP calls.

---

## 2. Master Operation Mapping Matrix

| # | Frontend UI Operation / Store Action | Backend REST Endpoint | HTTP Verb | Request DTO | Response DTO | Required Authorization | Implementation Status |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Request Phone OTP (`SignInPage.tsx:48`) | `/api/v1/auth/otp/send` | `POST` | `SendOtpRequest` | `OtpSentResponse` | `Public` | ⏳ Planned (M2) |
| **2** | Verify OTP & Log In (`SignInPage.tsx:55`) | `/api/v1/auth/otp/verify` | `POST` | `VerifyOtpRequest` | `AuthSuccessResponse` | `Public` | ⏳ Planned (M2) |
| **3** | Rotate JWT Access Token (`api/client.ts`) | `/api/v1/auth/refresh` | `POST` | Cookie: `RefreshToken` | `TokenRefreshResponse` | `Public (Cookie)` | ⏳ Planned (M2) |
| **4** | Get Current User Context (`useAppStore:currentUser`) | `/api/v1/auth/me` | `GET` | None | `UserProfileDto` | `Authenticated` | ⏳ Planned (M2) |
| **5** | Browse Vehicle Catalogue (`CarsPage.tsx:24`) | `/api/v1/catalogue/cars` | `GET` | Params: `brand, fuel, minPrice` | `List<CarSummaryDto>` | `Public` | ⏳ Planned (M3) |
| **6** | View Car & Variant Detail (`CarDetailPage.tsx:32`) | `/api/v1/catalogue/cars/{id}` | `GET` | None | `CarDetailDto` | `Public` | ⏳ Planned (M3) |
| **7** | Browse Active Demand Groups (`GroupsPage.tsx:30`) | `/api/v1/groups` | `GET` | Params: `city, brand, stage, page` | `PagedResponse<BuyerGroupDto>`| `Public` | ⏳ Planned (M3) |
| **8** | View Group Details (`GroupDetailPage.tsx:42`) | `/api/v1/groups/{id}` | `GET` | None | `BuyerGroupDetailDto` | `Public` | ⏳ Planned (M3) |
| **9** | Create New Group (`createGroupWithMembership`) | `/api/v1/groups` | `POST` | `CreateGroupRequest` | `BuyerGroupDto` | `ROLE_BUYER` | ⏳ Planned (M3) |
| **10** | Join Demand Group (`joinGroup`) | `/api/v1/groups/{id}/memberships` | `POST` | `JoinGroupRequest` | `GroupMembershipDto` | `ROLE_BUYER` | ⏳ Planned (M3) |
| **11** | Leave Demand Group (`leaveGroup`) | `/api/v1/groups/{id}/memberships/me` | `DELETE`| None | `void` (204 No Content) | `ROLE_BUYER` | ⏳ Planned (M3) |
| **12** | Submit / Update Buyer Signal (`submitBuyerSignal`) | `/api/v1/groups/{id}/signals` | `POST` | `SubmitSignalRequest` | `BuyerSignalDto` | `ROLE_BUYER` | ⏳ Planned (M3) |
| **13** | View Group Quotations (`BuyerQuotesPage.tsx:35`) | `/api/v1/groups/{id}/quotations` | `GET` | None | `List<QuotationDto>` | `ROLE_BUYER (Member)` | ⏳ Planned (M4) |
| **14** | Submit Initial Dealer Quote (`publishQuotationVersion`) | `/api/v1/groups/{id}/quotations` | `POST` | `QuotationSubmissionRequest` | `QuotationDto` | `ROLE_DEALER` | ⏳ Planned (M4) |
| **15** | Publish Revised Quote Version (`publishQuotationVersion`) | `/api/v1/quotations/{id}/versions`| `POST` | `QuotationRevisionRequest` | `QuotationVersionDto` | `ROLE_DEALER (Owner)`| ⏳ Planned (M4) |
| **16** | Grant Consent & Unlock Lead (`grantConsentAndCreateLead`) | `/api/v1/quotations/{id}/versions/{versionId}/consent` | `POST` | `GrantConsentRequest` | `ConsentSuccessResponse` | `ROLE_BUYER` | ⏳ Planned (M5) |
| **17** | Withdraw / Revoke Consent (`withdrawConsent`) | `/api/v1/consents/{id}/revoke` | `POST` | `RevokeConsentRequest` | `ConsentRevokedDto` | `ROLE_BUYER (Owner)` | ⏳ Planned (M5) |
| **18** | Fetch Dealer Unlocked Leads (`DealerLeadsPage.tsx:18`) | `/api/v1/dealer/leads` | `GET` | Params: `status, page, size` | `PagedResponse<DealerLeadDto>`| `ROLE_DEALER` | ⏳ Planned (M5) |
| **19** | Update Lead Pipeline Stage (`updateLeadStatus`) | `/api/v1/dealer/leads/{id}/status` | `PATCH`| `UpdateLeadStatusRequest` | `DealerLeadDto` | `ROLE_DEALER (Owner)`| ⏳ Planned (M5) |
| **20** | Add Dealer Follow-up Note (`addLeadDealerNote`) | `/api/v1/dealer/leads/{id}/notes` | `POST` | `AddDealerNoteRequest` | `LeadNoteDto` | `ROLE_DEALER (Owner)`| ⏳ Planned (M5) |
| **21** | Submit Lead Dispute (`submitLeadDispute`) | `/api/v1/dealer/leads/{id}/disputes` | `POST` | `SubmitDisputeRequest` | `LeadDisputeDto` | `ROLE_DEALER (Owner)`| ⏳ Planned (M6) |
| **22** | List Pending Dealer KYC (`AdminDealersPage.tsx:28`) | `/api/v1/admin/dealers/pending` | `GET` | None | `List<DealerReviewDto>` | `ROLE_ADMIN` | ⏳ Planned (M6) |
| **23** | Review Dealer Application (`reviewDealerApplication`) | `/api/v1/admin/dealers/{id}/review`| `POST` | `ReviewDealerRequest` | `DealerReviewResultDto` | `ROLE_ADMIN` | ⏳ Planned (M6) |
| **24** | Arbitrate Lead Dispute (`resolveLeadDispute`) | `/api/v1/admin/disputes/{id}/resolve` | `POST` | `ResolveDisputeRequest` | `LeadDisputeDto` | `ROLE_ADMIN` | ⏳ Planned (M6) |
| **25** | Moderate User Text Content (`moderateContentItem`) | `/api/v1/admin/moderation/{id}/action` | `POST` | `ModerationActionRequest` | `ModerationResultDto` | `ROLE_ADMIN` | ⏳ Planned (M6) |
| **26** | Add Catalogue Car Model (`addCatalogueCar`) | `/api/v1/admin/catalogue/cars` | `POST` | `CreateCarRequest` | `CarDetailDto` | `ROLE_ADMIN` | ⏳ Planned (M6) |
| **27** | Toggle Car / Variant Active (`toggleCarActive`) | `/api/v1/admin/catalogue/cars/{id}/toggle-active` | `PATCH`| None | `CarSummaryDto` | `ROLE_ADMIN` | ⏳ Planned (M6) |
| **28** | Fetch User Notifications (`Navbar.tsx:75`) | `/api/v1/notifications` | `GET` | Params: `unreadOnly` | `List<NotificationDto>` | `Authenticated` | ⏳ Planned (M5) |
| **29** | Mark Notification Read (`markNotificationRead`) | `/api/v1/notifications/{id}/read` | `PATCH`| None | `void` (204 No Content) | `Authenticated` | ⏳ Planned (M5) |
| **30** | Inspect System Audit Ledger (`AdminAuditPage.tsx:32`) | `/api/v1/admin/audit` | `GET` | Params: `userId, eventType, page` | `PagedResponse<AuditDto>` | `ROLE_ADMIN` | ⏳ Planned (M6) |

---

## 3. DTO Payloads & Contract Structure

### 3.1 Authentication DTOs
```java
public record SendOtpRequest(
    @NotBlank @Pattern(regexp = "^\\+91[6-9]\\d{9}$", message = "Valid Indian mobile number with +91 prefix required")
    String phone
) {}

public record VerifyOtpRequest(
    @NotBlank String phone,
    @NotBlank @Pattern(regexp = "^\\d{6}$", message = "6-digit OTP required")
    String otp
) {}

public record AuthSuccessResponse(
    String tokenType,
    String accessToken,
    long expiresIn,
    UserProfileDto user
) {}
```

### 3.2 Quotation Submission DTO
```java
public record QuotationSubmissionRequest(
    @NotNull @DecimalMin("100000.00") BigDecimal exShowroomPrice,
    @NotNull @DecimalMin("0.00") BigDecimal registrationCharges,
    @NotNull @DecimalMin("0.00") BigDecimal insuranceCharges,
    @DecimalMin("0.00") BigDecimal accessoriesCharges,
    @DecimalMin("0.00") BigDecimal otherCharges,
    @NotNull @DecimalMin("1.00") BigDecimal groupDiscount,
    @DecimalMin("0.00") BigDecimal corporateDiscount,
    @DecimalMin("0.00") BigDecimal exchangeBonus,
    String accessoryPackage,
    @Min(1) @Max(10) int warrantyYears,
    @NotNull @Future Instant validUntil,
    @Min(1) @Max(52) int deliveryTimelineWeeks
) {}
```

### 3.3 Explicit Consent Handshake DTO
```java
public record GrantConsentRequest(
    @Size(max = 500, message = "Buyer notes cannot exceed 500 characters")
    String notes
) {}

public record ConsentSuccessResponse(
    String consentId,
    String leadId,
    String status,
    Instant grantedAt,
    String dealerName,
    BigDecimal agreedOnRoadPrice
) {}
```
