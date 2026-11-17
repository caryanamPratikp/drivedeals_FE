# 03 — Implementation Progress Log

## Project Summary
- **Project**: MOTORCIRCLE Backend ("Buy smarter, together")
- **Stack**: Java 21 LTS, Spring Boot 3.3.x, Spring Data JPA, Hibernate, MySQL 8.0, Flyway, Redis 7.x, Spring Security (JWT RS256), Testcontainers, JUnit 5.
- **Repository Location**: `C:\Users\Admin\OneDrive\Desktop\DriveDeals`

---

## Milestone Tracking Dashboard

| Milestone | Description | Status | Target Completion | Verified By |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | Repository Assessment & API Mapping | ✅ COMPLETED | Phase Zero | Architectural Review |
| **Milestone 1** | Backend Foundation, Maven Wrapper, Flyway & Error Handling | ✅ COMPLETED | Milestone 1 | Build & JUnit 5 (3 passed) |
| **Milestone 2** | Identity, Phone OTP Authentication & Spring Security JWT | ✅ COMPLETED | Milestone 2 | MockMvc & JUnit 5 (15 passed)|
| **Milestone 3** | Vehicle Catalogue & Demand Groups Module | ✅ COMPLETED | Milestone 3 | MockMvc & JUnit 5 (30 passed)|
| **Milestone 4** | Quotation Engine, Versioning & Server Pricing Calculation | ✅ COMPLETED | Milestone 4 | MockMvc & JUnit 5 (41 passed) |
| **Milestone 5** | Explicit Consent Handshake & Atomic Lead Delivery | ✅ COMPLETED | Milestone 5 | Integration Tests & MockMvc (61 passed) |
| **Milestone 6** | Administration, Lead Disputes & Audit Ledger | ⏳ In Progress | Milestone 6 | Security Audit Tests |
| **Milestone 7** | Frontend Client Adapter & End-to-End Verification | ⏳ Planned | Milestone 7 | Playwright / Vitest |

---

## Milestone 5 Details (Completed)

### 1. Scope
- Implemented `Consent`, `Lead`, `LeadEvent`, and `Notification` domain entities as standard JPA POJOs with clean encapsulation, audit timestamps, and relational integrity.
- Built explicit Digital Personal Data Protection (DPDP) Act compliance:
  - Buyer contact details remain strictly masked and private while comparing offers.
  - Contact information is unlocked only after an explicit consent action (`grantConsentAndCreateLead`).
  - Implemented buyer's statutory right to withdraw consent (`revokeConsent`): marks consent as `REVOKED`, cascades `LeadStatus.REVOKED` to lead, logs audit event, and notifies dealership.
- Built atomic lead delivery inside a repeatable read transaction (`@Transactional(isolation = Isolation.REPEATABLE_READ)`):
  - Validates quotation is active (`SUBMITTED` or `REVISED`).
  - Validates dealer is verified (`DealerStatus.VERIFIED`).
  - Validates buyer is an active group member (`GroupMembership.status == ACTIVE`).
  - Prevents duplicate active leads for the same buyer, dealer, and group.
  - Automatically snapshots the active quotation version.
  - Dispatches immediate alert notification to dealership user.
- Enforced strict row-level multitenancy in `DealerLeadController`:
  - Dealerships can ONLY view and manage leads where `lead.dealer_id == authenticatedUser.dealer_id`.
  - Pipeline progression (`DEMO_DELIVERED` -> `CONTACTED` -> `TEST_DRIVE_SCHEDULED` -> `BOOKED`).
  - Attempting to update a revoked lead throws a RFC 7807 `BusinessRuleException`.
- Implemented real-time user `NotificationController`:
  - `GET /notifications` (filter by `unreadOnly`).
  - `PATCH /notifications/{id}/read` (owner authorization verified).
- Added 20 automated unit and MockMvc integration tests (Total test suite: 61 tests, all passing).

### 2. Files Created / Modified
- `backend/src/main/java/in/motorcircle/backend/lead/domain/ConsentStatus.java`
- `backend/src/main/java/in/motorcircle/backend/lead/domain/LeadStatus.java`
- `backend/src/main/java/in/motorcircle/backend/lead/domain/Consent.java`
- `backend/src/main/java/in/motorcircle/backend/lead/domain/Lead.java`
- `backend/src/main/java/in/motorcircle/backend/lead/domain/LeadEvent.java`
- `backend/src/main/java/in/motorcircle/backend/notification/domain/Notification.java`
- `backend/src/main/java/in/motorcircle/backend/lead/infrastructure/ConsentRepository.java`
- `backend/src/main/java/in/motorcircle/backend/lead/infrastructure/LeadRepository.java`
- `backend/src/main/java/in/motorcircle/backend/lead/infrastructure/LeadEventRepository.java`
- `backend/src/main/java/in/motorcircle/backend/notification/infrastructure/NotificationRepository.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/GrantConsentRequest.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/RevokeConsentRequest.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/ConsentResponseDto.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/LeadEventDto.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/DealerLeadDto.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/UpdateLeadStatusRequest.java`
- `backend/src/main/java/in/motorcircle/backend/notification/api/NotificationDto.java`
- `backend/src/main/java/in/motorcircle/backend/notification/application/NotificationService.java`
- `backend/src/main/java/in/motorcircle/backend/lead/application/ConsentAndLeadService.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/ConsentController.java`
- `backend/src/main/java/in/motorcircle/backend/lead/api/DealerLeadController.java`
- `backend/src/main/java/in/motorcircle/backend/notification/api/NotificationController.java`
- `backend/src/test/java/in/motorcircle/backend/lead/ConsentAndLeadServiceTest.java` (9 tests)
- `backend/src/test/java/in/motorcircle/backend/lead/ConsentControllerTest.java` (5 tests)
- `backend/src/test/java/in/motorcircle/backend/lead/DealerLeadControllerTest.java` (4 tests)
- `backend/src/test/java/in/motorcircle/backend/notification/NotificationControllerTest.java` (2 tests)

### 3. Tests Executed & Results
- `ConsentAndLeadServiceTest` (9 tests): All PASSED
  - `testGrantConsentAndCreateLeadSuccess`: PASSED (Atomic creation of consent, lead, event, and notification)
  - `testGrantConsentDuplicateLeadFails`: PASSED (Throws DuplicateResourceException)
  - `testGrantConsentNonMemberFails`: PASSED (Throws BusinessRuleException)
  - `testGrantConsentUnverifiedDealerFails`: PASSED (Throws BusinessRuleException)
  - `testRevokeConsentSuccess`: PASSED (Cascades REVOKED status and logs audit event)
  - `testRevokeConsentUnauthorizedBuyerFails`: PASSED (Throws UnauthorizedException)
  - `testDealerLeadRowLevelTenancy`: PASSED (Throws ResourceNotFoundException for cross-tenant access)
  - `testDealerUpdateLeadStatusSuccess`: PASSED (Updates status and logs event)
  - `testUpdateRevokedLeadFails`: PASSED (Rejects updates on revoked lead)
- `ConsentControllerTest` (5 tests): All PASSED
  - `testGrantConsentAuthenticatedBuyer`: PASSED (201 Created)
  - `testGrantConsentUnauthenticatedFails`: PASSED (403 Forbidden)
  - `testDealerCannotGrantConsent`: PASSED (403 Forbidden - role boundary)
  - `testGetMyConsents`: PASSED (200 OK)
  - `testRevokeConsent`: PASSED (200 OK)
- `DealerLeadControllerTest` (4 tests): All PASSED
  - `testDealerCanGetLeads`: PASSED (200 OK with isolated leads)
  - `testBuyerCannotAccessDealerLeads`: PASSED (403 Forbidden)
  - `testDealerCanGetLeadDetails`: PASSED (200 OK)
  - `testDealerUpdateLeadStatus`: PASSED (200 OK)
- `NotificationControllerTest` (2 tests): All PASSED
  - `testGetNotifications`: PASSED (200 OK)
  - `testMarkNotificationRead`: PASSED (200 OK)
- Previous test suites (41 tests across M1-M4): All PASSED
- **Total**: 61 tests run, 0 failures, 0 errors, 0 skipped. Build time: 44s.

### 4. Next Recommended Step
- Proceed to **Milestone 6: Administration, Lead Disputes & Audit Ledger**.

---

## Milestone 4 Details (Completed)

### 1. Scope
- Implemented `Quotation` and immutable `QuotationVersion` JPA entities with `@Enumerated` `QuotationStatus` (`DRAFT`, `SUBMITTED`, `ACCEPTED`, `SUPERSEDED`, `REJECTED`, `EXPIRED`).
- Built strictly deterministic `PricingCalculationEngine`:
  - `BigDecimal` precision with `RoundingMode.HALF_UP` for all monetary line items.
  - Section 206C(1F) statutory TCS @ 1.00% applied automatically when calculated on-road vehicle price exceeds ₹10,00,000.
  - Line items: Ex-showroom base, RTO registration, comprehensive insurance, optional dealer accessories, fastag/logistics, less dealer group discount.
  - Price sanity validation: Dealer ex-showroom quotation cannot deviate >2% from manufacturer catalogue baseline, and cannot fall below 70% floor.
- Implemented `QuotationRepository` and `QuotationVersionRepository`:
  - Optimized queries for active group quotes (`findByBuyerGroupIdAndStatusOrderByTotalDiscountDesc`), dealer specific quotes, and version history audit snapshots.
- Built `QuotationService`:
  - Multi-tier franchise validation: Verifies dealer is verified (`DealerStatus.VERIFIED`), authorized for the vehicle brand, and operates in the group's territory.
  - Submitting v1 quotation: Validates group is `OPEN_FOR_QUOTES`, persists v1 snapshot.
  - Revising quotation (v2, v3...): Immutably snapshots version history, increments revision number, guarantees historical audit preservation.
  - Exposing public/buyer quotation ranking sorted by total consumer savings.
- Built `QuotationController` exposing:
  - `GET /api/v1/groups/{groupId}/quotations` (Public/Buyer view: all active offers for the group)
  - `GET /api/v1/quotations/{id}/versions` (Public/Buyer view: full version history audit log)
  - `POST /api/v1/dealer/groups/{groupId}/quotations` (Dealer view: submit new structured quotation)
  - `POST /api/v1/dealer/quotations/{id}/revisions` (Dealer view: submit revised quotation with version bump)
- Added 11 automated unit and MockMvc tests (Total test suite: 41 tests, all passing).

### 2. Files Created / Modified
- `backend/src/main/java/in/motorcircle/backend/quotation/domain/QuotationStatus.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/domain/Quotation.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/domain/QuotationVersion.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/application/PricingCalculationEngine.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/infrastructure/QuotationRepository.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/infrastructure/QuotationVersionRepository.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/api/PriceBreakdownDto.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/api/QuotationSubmissionRequest.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/api/QuotationResponseDto.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/api/QuotationVersionResponseDto.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/application/QuotationService.java`
- `backend/src/main/java/in/motorcircle/backend/quotation/api/QuotationController.java`
- `backend/src/main/java/in/motorcircle/backend/config/SecurityConfig.java` (Updated `/groups/**` and `/quotations/**` GET permissions)
- `backend/src/test/java/in/motorcircle/backend/quotation/PricingCalculationEngineTest.java`
- `backend/src/test/java/in/motorcircle/backend/quotation/QuotationServiceTest.java`
- `backend/src/test/java/in/motorcircle/backend/quotation/QuotationControllerTest.java`

### 3. Tests Executed & Results
- `PricingCalculationEngineTest.testCalculatePricingBreakdown_Below10Lakhs()`: PASSED (TCS = 0)
- `PricingCalculationEngineTest.testCalculatePricingBreakdown_Above10Lakhs()`: PASSED (Section 206C(1F) 1% TCS applied)
- `PricingCalculationEngineTest.testPriceSanityFloorViolation()`: PASSED (Throws `BusinessRuleException` on >30% abnormal discount)
- `QuotationServiceTest.testSubmitQuotationSuccess()`: PASSED
- `QuotationServiceTest.testSubmitQuotationUnverifiedDealerFails()`: PASSED
- `QuotationServiceTest.testSubmitQuotationBrandMismatchFails()`: PASSED
- `QuotationServiceTest.testReviseQuotationCreatesNewVersionSnapshot()`: PASSED (v1 archived, v2 created)
- `QuotationServiceTest.testGetActiveQuotationsForGroup()`: PASSED
- `QuotationControllerTest.testGetGroupQuotationsPublic()`: PASSED (Public GET 200 OK)
- `QuotationControllerTest.testDealerSubmitQuotation()`: PASSED (Authenticated DEALER 201 Created)
- `QuotationControllerTest.testBuyerCannotSubmitQuotation()`: PASSED (403 Forbidden for ROLE_BUYER)
- Previous test suites (30 tests across Auth, Identity, Catalogue, Groups, Exceptions): All PASSED
- **Total**: 41 tests run, 0 failures, 0 errors, 0 skipped.

### 4. Next Recommended Step
- Proceed to **Milestone 5: Explicit Consent Handshake & Atomic Lead Delivery Module**.

---

## Milestone 3 Details (Completed)

### 1. Scope
- Implemented `Car` and `CarVariant` JPA entities with `BodyType`, `FuelType`, and `Transmission` domain enums.
- Implemented `CarRepository` with multi-criteria dynamic search query (`brand`, `bodyType`, `minPrice`, `maxPrice`) and `CarVariantRepository`.
- Built `CatalogService` and `CatalogController` exposing:
  - `GET /api/v1/catalogue/cars` (Filtered catalogue browsing)
  - `GET /api/v1/catalogue/cars/{id}` (Trims, specifications, and baseline ex-showroom pricing)
- Implemented `BuyerGroup`, `GroupMembership`, and `BuyerSignal` JPA entities:
  - Optimistic locking with `@Version` on `BuyerGroup` to prevent race conditions during concurrent joins.
  - Automatic lifecycle state transition: When `currentMembers >= targetMembers`, the group state automatically transitions from `FORMATION` to `OPEN_FOR_QUOTES`.
  - Max member capacity cap enforcement (`targetMembers * 1.5`).
  - Strict duplicate join prevention (`DuplicateResourceException`).
- Built `DemandTelemetryService`:
  - Anonymizes buyer signals into statistical cohort distributions (purchase timeline percentages, finance vs cash ratios, exchange vehicle counts).
  - Protects buyer privacy: dealerships only view aggregated signals, zero individual PII.
- Built `BuyerGroupService` and `GroupController` exposing:
  - `GET /api/v1/groups` (Public, paginated search by city, brand, and lifecycle stage)
  - `GET /api/v1/groups/{id}` (Public, group details with telemetry summary and current user membership flag)
  - `POST /api/v1/groups` (Authenticated `ROLE_BUYER`: initiate group)
  - `POST /api/v1/groups/{id}/memberships` (Authenticated `ROLE_BUYER`: join group)
  - `DELETE /api/v1/groups/{id}/memberships/me` (Authenticated `ROLE_BUYER`: leave group)
  - `POST /api/v1/groups/{id}/signals` (Authenticated `ROLE_BUYER`: submit/update demand preferences)
- Added 15 new automated unit and MockMvc tests (Total test suite: 30 tests, all passing).

### 2. Files Created
- `backend/src/main/java/in/motorcircle/backend/catalog/domain/BodyType.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/domain/FuelType.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/domain/Transmission.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/domain/Car.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/domain/CarVariant.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/infrastructure/CarRepository.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/infrastructure/CarVariantRepository.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/api/CarVariantSummaryDto.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/api/CarSummaryDto.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/api/CarDetailDto.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/application/CatalogService.java`
- `backend/src/main/java/in/motorcircle/backend/catalog/api/CatalogController.java`
- `backend/src/main/java/in/motorcircle/backend/group/domain/GroupStage.java`
- `backend/src/main/java/in/motorcircle/backend/group/domain/MembershipStatus.java`
- `backend/src/main/java/in/motorcircle/backend/signal/domain/TimelineMonths.java`
- `backend/src/main/java/in/motorcircle/backend/signal/domain/PurchaseMode.java`
- `backend/src/main/java/in/motorcircle/backend/group/domain/BuyerGroup.java`
- `backend/src/main/java/in/motorcircle/backend/group/domain/GroupMembership.java`
- `backend/src/main/java/in/motorcircle/backend/signal/domain/BuyerSignal.java`
- `backend/src/main/java/in/motorcircle/backend/group/infrastructure/BuyerGroupRepository.java`
- `backend/src/main/java/in/motorcircle/backend/group/infrastructure/GroupMembershipRepository.java`
- `backend/src/main/java/in/motorcircle/backend/signal/infrastructure/BuyerSignalRepository.java`
- `backend/src/main/java/in/motorcircle/backend/signal/api/TelemetrySummaryDto.java`
- `backend/src/main/java/in/motorcircle/backend/signal/application/DemandTelemetryService.java`
- `backend/src/main/java/in/motorcircle/backend/group/api/CreateSignalPayload.java`
- `backend/src/main/java/in/motorcircle/backend/group/api/CreateGroupRequest.java`
- `backend/src/main/java/in/motorcircle/backend/group/api/JoinGroupRequest.java`
- `backend/src/main/java/in/motorcircle/backend/group/api/BuyerGroupSummaryDto.java`
- `backend/src/main/java/in/motorcircle/backend/group/api/BuyerGroupDetailDto.java`
- `backend/src/main/java/in/motorcircle/backend/group/application/BuyerGroupService.java`
- `backend/src/main/java/in/motorcircle/backend/group/api/GroupController.java`
- `backend/src/test/java/in/motorcircle/backend/catalog/CatalogControllerTest.java`
- `backend/src/test/java/in/motorcircle/backend/group/BuyerGroupServiceTest.java`
- `backend/src/test/java/in/motorcircle/backend/group/GroupControllerTest.java`

### 3. Tests Executed & Results
- `CatalogControllerTest` (4 tests): All PASSED (Browsing, brand filtering, trim details, 404 ProblemDetail)
- `BuyerGroupServiceTest` (5 tests): All PASSED (Group initiation with member 1, threshold trigger `FORMATION` -> `OPEN_FOR_QUOTES`, duplicate join prevention, leaving group, anonymized telemetry aggregation)
- `GroupControllerTest` (6 tests): All PASSED (Public group queries, unauthenticated 403 checks, authenticated group creation, join, and leave)
- Previous test suites (15 tests): All PASSED
- **Total**: 30 tests run, 0 failures, 0 errors, 0 skipped. Build time: 40s.

### 4. Next Recommended Step
- Proceed to **Milestone 4: Quotation Engine, Versioning & Server Pricing Calculation**.

---

### 1. Scope
- Implemented `User` and `Dealer` JPA entities with lifecycle hooks and enums (`UserRole`, `UserStatus`, `DealerStatus`).
- Implemented `UserRepository` and `DealerRepository` with query helpers (`findByPhone`, `findByUserId`, `findByBrandAndCityAndStatus`).
- Built `OtpService` and `DefaultOtpService`:
  - Cryptographically secure 6-digit random token generation.
  - Expiration with 5-minute TTL.
  - Attempt rate limiting (max 3 invalid attempts before 15-minute phone lockout).
  - Dev mode demo bypass code (`123456`) allowing seamless testing with existing frontend personas.
- Built JWT infrastructure using JJWT 0.12.6:
  - `JwtTokenProvider`: generates 15-minute access tokens with claims (`sub`, `phone`, `name`, `role`, `dealerId`) and verifies signatures.
  - `UserPrincipal`: implements Spring Security `UserDetails`.
  - `JwtAuthenticationFilter`: intercepts HTTP requests, parses `Authorization: Bearer <token>`, and populates `SecurityContextHolder`.
- Wired Spring Security 6 in `SecurityConfig`:
  - Open: `/auth/otp/**`, `/catalogue/**`, `/groups` (GET), `/swagger-ui/**`.
  - Authenticated: `/auth/me`.
  - Role-protected: `/dealer/**` (`hasRole('DEALER')`), `/admin/**` (`hasRole('ADMIN')`).
- Built `AuthController` exposing:
  - `POST /api/v1/auth/otp/send`
  - `POST /api/v1/auth/otp/verify`
  - `GET /api/v1/auth/me`
- Added comprehensive automated test suite (15 total tests).

### 2. Files Created / Modified
- `backend/pom.xml` (Added `jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- `backend/src/main/java/in/motorcircle/backend/identity/domain/UserRole.java`
- `backend/src/main/java/in/motorcircle/backend/identity/domain/UserStatus.java`
- `backend/src/main/java/in/motorcircle/backend/identity/domain/User.java`
- `backend/src/main/java/in/motorcircle/backend/identity/infrastructure/UserRepository.java`
- `backend/src/main/java/in/motorcircle/backend/dealer/domain/DealerStatus.java`
- `backend/src/main/java/in/motorcircle/backend/dealer/domain/Dealer.java`
- `backend/src/main/java/in/motorcircle/backend/dealer/infrastructure/DealerRepository.java`
- `backend/src/main/java/in/motorcircle/backend/identity/application/OtpService.java`
- `backend/src/main/java/in/motorcircle/backend/identity/application/DefaultOtpService.java`
- `backend/src/main/java/in/motorcircle/backend/identity/application/AuthService.java`
- `backend/src/main/java/in/motorcircle/backend/shared/security/UserPrincipal.java`
- `backend/src/main/java/in/motorcircle/backend/shared/security/JwtTokenProvider.java`
- `backend/src/main/java/in/motorcircle/backend/shared/security/JwtAuthenticationFilter.java`
- `backend/src/main/java/in/motorcircle/backend/config/SecurityConfig.java` (Updated)
- `backend/src/main/java/in/motorcircle/backend/identity/api/SendOtpRequest.java`
- `backend/src/main/java/in/motorcircle/backend/identity/api/SendOtpResponse.java`
- `backend/src/main/java/in/motorcircle/backend/identity/api/VerifyOtpRequest.java`
- `backend/src/main/java/in/motorcircle/backend/identity/api/UserProfileDto.java`
- `backend/src/main/java/in/motorcircle/backend/identity/api/AuthSuccessResponse.java`
- `backend/src/main/java/in/motorcircle/backend/identity/api/AuthController.java`
- `backend/src/test/java/in/motorcircle/backend/identity/OtpServiceTest.java`
- `backend/src/test/java/in/motorcircle/backend/shared/security/JwtTokenProviderTest.java`
- `backend/src/test/java/in/motorcircle/backend/identity/AuthControllerTest.java`

### 3. Tests Executed & Results
- `AuthControllerTest.testSendOtpValidPhone()`: PASSED
- `AuthControllerTest.testSendOtpMalformedPhone()`: PASSED (RFC 7807 400 error)
- `AuthControllerTest.testVerifyOtpAndAuthenticate()`: PASSED (Returns Bearer token)
- `AuthControllerTest.testGetMeUnauthenticated()`: PASSED (403 Forbidden)
- `AuthControllerTest.testGetMeAuthenticated()`: PASSED (200 OK with UserProfileDto)
- `OtpServiceTest.testSendOtpSuccess()`: PASSED
- `OtpServiceTest.testVerifyMockOtp()`: PASSED
- `OtpServiceTest.testInvalidOtpThrowsException()`: PASSED
- `OtpServiceTest.testLockoutAfterMaxAttempts()`: PASSED
- `JwtTokenProviderTest.testGenerateAccessTokenAndValidate()`: PASSED
- `JwtTokenProviderTest.testDealerAccessTokenClaims()`: PASSED
- `JwtTokenProviderTest.testTamperedTokenFails()`: PASSED
- `GlobalExceptionHandlerTest` (2 tests): PASSED
- `MotorcircleBackendApplicationTests` (1 test): PASSED
- **Total**: 15 tests run, 0 failures, 0 errors, 0 skipped. Build time: 40s.

### 4. Next Recommended Step
- Proceed to **Milestone 3: Vehicle Catalogue & Demand Groups Module**.

---

### 1. Scope
- Set up dedicated `backend/` Spring Boot 3.3.4 project with Java 21 LTS release target.
- Generated Maven Wrapper (`mvnw`, `mvnw.cmd`, `.mvn/wrapper/`).
- Added `docker-compose.yml` for local containerized MySQL 8.0 and Redis 7.0 services.
- Created multi-environment configuration: `application.yml`, `application-dev.yml` (MySQL + Redis), `application-test.yml` (H2 in-memory).
- Authored initial Flyway migrations:
  - `V1__init_schema.sql` (16 relational tables with InnoDB, `utf8mb4_0900_ai_ci`, foreign keys, check constraints, and composite indexes).
  - `V2__seed_catalogue_and_dealers.sql` (Baseline seed data matching `src/data/mockData.ts`).
- Implemented RFC 7807 Problem Details centralized exception handler (`GlobalExceptionHandler`).
- Implemented CORS configuration for Vite dev server (`WebConfig.java`) and foundational Spring Security filter chain (`SecurityConfig.java`).
- Implemented OpenAPI 3.0 documentation bean (`OpenApiConfig.java`).

### 2. Files Created
- `docker-compose.yml`
- `backend/pom.xml`
- `backend/mvnw`, `backend/mvnw.cmd`, `backend/.mvn/wrapper/maven-wrapper.properties`
- `backend/src/main/resources/application.yml`
- `backend/src/main/resources/application-dev.yml`
- `backend/src/main/resources/application-test.yml`
- `backend/src/main/resources/db/migration/V1__init_schema.sql`
- `backend/src/main/resources/db/migration/V2__seed_catalogue_and_dealers.sql`
- `backend/src/main/java/in/motorcircle/backend/MotorcircleBackendApplication.java`
- `backend/src/main/java/in/motorcircle/backend/config/WebConfig.java`
- `backend/src/main/java/in/motorcircle/backend/config/SecurityConfig.java`
- `backend/src/main/java/in/motorcircle/backend/config/OpenApiConfig.java`
- `backend/src/main/java/in/motorcircle/backend/shared/exception/GlobalExceptionHandler.java`
- `backend/src/main/java/in/motorcircle/backend/shared/exception/ResourceNotFoundException.java`
- `backend/src/main/java/in/motorcircle/backend/shared/exception/BusinessRuleException.java`
- `backend/src/main/java/in/motorcircle/backend/shared/exception/DuplicateResourceException.java`
- `backend/src/main/java/in/motorcircle/backend/shared/exception/UnauthorizedException.java`
- `backend/src/main/java/in/motorcircle/backend/shared/response/ApiResponse.java`
- `backend/src/test/java/in/motorcircle/backend/MotorcircleBackendApplicationTests.java`
- `backend/src/test/java/in/motorcircle/backend/shared/exception/GlobalExceptionHandlerTest.java`

### 3. Tests Executed & Results
- `MotorcircleBackendApplicationTests.contextLoads()`: PASSED (Spring context boots cleanly, JPA entity manager factory initialized)
- `GlobalExceptionHandlerTest.handleResourceNotFoundFormatsProblemDetail()`: PASSED (RFC 7807 404 response structure validated)
- `GlobalExceptionHandlerTest.handleBusinessRuleFormatsProblemDetail()`: PASSED (RFC 7807 400 response with custom error code validated)
- **Total**: 3 tests run, 0 failures, 0 errors, 0 skipped. Build time: 60s.

### 4. Next Recommended Step
- Proceed to **Milestone 2: Identity, Phone OTP Authentication & Spring Security JWT**.

---

## Phase Zero Details (Completed)

### 1. Scope
- Thorough inspection of existing React 18 frontend, Zustand store (`src/store/index.ts`), mock dataset (`src/data/mockData.ts`), Vitest test suite (`src/tests/store.test.ts`), and 11 discovery documents in `docs/backend-discovery/`.
- Evaluation of host system environment (Java 25 Temurin LTS installed, Node v24).
- Production of 4 backend implementation documents in `docs/backend-implementation/`.

### 2. Files Created
- `docs/backend-implementation/00-implementation-assessment.md`
- `docs/backend-implementation/01-frontend-api-mapping.md`
- `docs/backend-implementation/02-decisions-and-assumptions.md`
- `docs/backend-implementation/03-implementation-progress.md` (This file)

### 3. Database Migrations Added
- None yet (Planned for Milestone 1: `V1__init_schema.sql` and `V2__seed_catalogue_and_dealers.sql`).

### 4. APIs Implemented
- None yet (Zero backend code written in Phase Zero, adhering strictly to review constraint).

### 5. Tests Added and Executed
- Vitest frontend suite: 13 tests executed and passing (`src/tests/store.test.ts`).
- Backend tests: None yet.

### 6. Frontend Integration Status
- Frontend currently runs in demo mode using Zustand local storage persistence (`motorcircle_demo_state_v1`).

### 7. Known Issues / Roadblocks
- System `mvn` is not present in Windows PATH. Resolved by planning to include Maven Wrapper (`mvnw` / `mvnw.cmd`) in the backend root directory.

### 8. Decisions Still Required
- Stakeholder confirmation on whether the backend project should reside directly in `backend/` subdirectory within the repository or in the root. (Recommended: dedicated `backend/` folder to cleanly separate Spring Boot Maven sources from Vite/React frontend sources).

### 9. Next Recommended Step
- Review and approve **Phase Zero Assessment**, followed by authorization to execute **Milestone 1: Backend Foundation**.
