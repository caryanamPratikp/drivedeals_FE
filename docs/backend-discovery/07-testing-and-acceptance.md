# 07 — Testing Strategy & Acceptance Criteria

## 1. Testing Pyramid & Verification Framework
To guarantee enterprise reliability, the MOTORCIRCLE backend implementation must adopt an exhaustive testing pyramid leveraging Java 21 and Spring Boot 3.3 test harnesses.

```
                   ▲
                  / \
                 / E2E \       <-- Cypress / Playwright (Full Flow)
                /───────\
               / Contract\     <-- Spring Cloud Contract / OpenAPI Validation
              /───────────\
             / Integration \   <-- @SpringBootTest + Testcontainers (MySQL & Redis)
            /───────────────\
           /      Unit       \ <-- JUnit 5, Mockito, AssertJ (Domain & Calculations)
          /───────────────────\
```

### 1.1 Testing Tooling Stack
- **Unit Testing**: JUnit 5 (Jupiter), AssertJ 3.25+, Mockito 5.x.
- **Persistence Testing**: `@DataJpaTest` with Testcontainers MySQL 8.0 (No in-memory H2, ensuring 100% MySQL dialect and JSON column compatibility).
- **Web Layer Testing**: `@WebMvcTest` with Spring Security test helpers (`@WithMockUser`).
- **Integration Testing**: `@SpringBootTest(webEnvironment = RANDOM_PORT)` with Testcontainers (MySQL + Redis).
- **API Contract Verification**: OpenAPI schema validation against Swagger UI endpoints.

---

## 2. Parity Test Specifications: Mapping Vitest to JUnit 5

The frontend currently verifies critical logic via 13 Vitest tests (`src/tests/store.test.ts`). The Spring Boot backend must provide direct 1:1 JUnit 5 test equivalents:

| # | Vitest Spec (`src/tests/store.test.ts`) | Spring Boot JUnit 5 Test Class & Method | Test Scenario & Assertion |
| :- | :--- | :--- | :--- |
| 1 | `initializes with default mock data` (line 12) | `DatabaseSeedIntegrationTest.testInitialCatalogueSeeded()` | Verifies catalogue contains 6 cars, 14 variants, and verified dealer accounts on bootstrap. |
| 2 | `switches current user correctly` (line 22) | `AuthenticationServiceTest.testUserAuthenticationAndContext()` | Validates user context extraction and SecurityContext claims for Buyer, Dealer, and Admin roles. |
| 3 | `allows a user to join an active group` (line 33) | `BuyerGroupServiceTest.testJoinGroup_Success()` | Validates membership creation, member count increment, and notification dispatch. |
| 4 | `prevents duplicate joins by same user` (line 46) | `BuyerGroupServiceTest.testJoinGroup_DuplicateThrowsException()` | Asserts `DuplicateMembershipException` thrown when active membership already exists. |
| 5 | `allows a user to leave a group` (line 58) | `BuyerGroupServiceTest.testLeaveGroup_Success()` | Validates status transitions to `LEFT`, member count decrements, audit entry created. |
| 6 | `submits buyer signal and records preferences` (line 72) | `BuyerSignalServiceTest.testSubmitSignal_ValidPreferences()` | Verifies timeline, purchase mode, and exchange car flags stored correctly. |
| 7 | `creates new group with initiator membership` (line 89) | `BuyerGroupServiceTest.testCreateGroup_WithInitiator()` | Validates group created in `FORMATION` state with creator automatically enrolled as member 1. |
| 8 | `submits quotation and increments version` (line 110) | `QuotationServiceTest.testCreateQuotationVersion_SequentialIncrement()` | Validates that revising a quote creates `v2` with updated pricing without altering `v1`. |
| 9 | `grants consent and generates dealer lead atomically` (line 145) | `ConsentTransactionIntegrationTest.testGrantConsent_AtomicExecution()` | Validates atomic creation of `Consent` (status `GRANTED`) and `Lead` (status `DEMO_DELIVERED`). |
| 10 | `prevents duplicate consent for same quotation` (line 172) | `ConsentServiceTest.testGrantConsent_DuplicateThrowsException()` | Asserts `DuplicateConsentException` when user attempts secondary consent on same quote. |
| 11 | `revokes consent and updates lead status` (line 188) | `ConsentServiceTest.testRevokeConsent_UpdatesLeadState()` | Asserts `Consent` status is `REVOKED`, `Lead` is `CONSENT_REVOKED`, dealer contact access revoked. |
| 12 | `updates lead status through dealer pipeline` (line 212) | `LeadServiceTest.testUpdateLeadStatus_ValidTransitions()` | Asserts sequential transitions: `DEMO_DELIVERED` $\rightarrow$ `CONTACTED` $\rightarrow$ `TEST_DRIVE_SCHEDULED`. |
| 13 | `submits lead dispute and updates status` (line 235) | `LeadDisputeServiceTest.testSubmitDispute_Success()` | Asserts dispute created with `OPEN` status, `Lead` marked as `DISPUTED`, admin alert triggered. |

---

## 3. High-Priority Integration Test Scenarios

### 3.1 Multi-Tenant Dealer Lead Isolation Test (`DealerSecurityIntegrationTest`)
```java
@Test
@WithMockUser(username = "dealer_concorde_tata", roles = {"DEALER"})
void dealerCannotQueryLeadsBelongingToAnotherDealership() {
    String tridentsLeadId = "lead_trident_hyundai_1";
    
    mockMvc.perform(get("/api/v1/dealer/leads/{id}", tridentsLeadId))
           .andExpect(status().isForbidden());
}
```

### 3.2 Pricing Calculation Verification Test (`PricingCalculationEngineTest`)
```java
@Test
void pricingCalculationMatchesStatutoryLineItems() {
    QuotationVersionRequest request = QuotationVersionRequest.builder()
        .exShowroomPrice(new BigDecimal("2015000.00"))
        .registrationCharges(new BigDecimal("372775.00"))
        .insuranceCharges(new BigDecimal("65000.00"))
        .accessoriesCharges(new BigDecimal("25000.00"))
        .otherCharges(new BigDecimal("3500.00"))
        .groupDiscount(new BigDecimal("45000.00"))
        .corporateDiscount(new BigDecimal("10000.00"))
        .exchangeBonus(new BigDecimal("15000.00"))
        .build();

    BigDecimal expectedOnRoad = new BigDecimal("2411275.00");
    BigDecimal actualOnRoad = pricingEngine.calculateOnRoadPrice(request);

    assertThat(actualOnRoad).isEqualByComparingTo(expectedOnRoad);
}
```

---

## 4. Acceptance Criteria Checklist

### 4.1 Authentication & Security
- [ ] Phone OTP login successfully generates JWT access token and secure HttpOnly refresh cookie.
- [ ] Expired access tokens return 401 with `TOKEN_EXPIRED` error code.
- [ ] Dealers cannot access `/api/v1/admin/*` endpoints (returns 403 Forbidden).
- [ ] Buyers cannot access `/api/v1/dealer/*` endpoints (returns 403 Forbidden).

### 4.2 Group Lifecycle & Quota
- [ ] When member count reaches `targetMembers`, group stage automatically transitions to `OPEN_FOR_QUOTES`.
- [ ] Groups exceeding expiration date without meeting threshold transition to `CANCELLED`.
- [ ] No more than 150% of target members can join a group.

### 4.3 Quotations & Consent
- [ ] Quotation versions are strictly immutable. Any modification generates an incremented version number.
- [ ] Dealership cannot view buyer phone or email until the buyer explicitly grants consent to a quotation version.
- [ ] If consent is revoked by the buyer, the dealer lead endpoint masks phone and email immediately.

### 4.4 Lead Disputes & Administration
- [ ] Disputes cannot be filed after 72 hours from lead generation.
- [ ] Resolving a dispute as `REFUND_GRANTED` updates dealer balance and logs audit event.
- [ ] Catalogue modifications by Admin reflect instantly in public catalogue queries.
