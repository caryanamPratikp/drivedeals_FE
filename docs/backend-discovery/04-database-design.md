# 04 — Database Design & Relational Schema

## 1. Database Architecture & Conventions
- **Target Engine**: MySQL 8.0+ / Amazon Aurora MySQL-Compatible.
- **Storage Engine**: `InnoDB` (ACID compliance, row-level locking, foreign key enforcement).
- **Default Character Set**: `utf8mb4`
- **Default Collation**: `utf8mb4_0900_ai_ci` (Full Unicode 9.0 multilingual support including Indian regional scripts and emojis).
- **Timezone**: All `DATETIME` or `TIMESTAMP` columns stored strictly in UTC.
- **Monetary Precision**: All currency values use `DECIMAL(12, 2)` (supports values up to ₹99,99,99,999.99 with exact precision). Never use `FLOAT` or `DOUBLE`.
- **Primary Keys**: Surrogate keys using UUIDv4 stored as `VARCHAR(36)` (or binary UUID `BINARY(16)` with ORM translation).

---

## 2. Complete Relational DDL Specification

```sql
-- ============================================================================
-- 1. USERS & IDENTITY
-- ============================================================================
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_phone UNIQUE (phone),
    CONSTRAINT chk_user_role CHECK (role IN ('BUYER', 'DEALER', 'ADMIN')),
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_users_city_role ON users (city, role);

-- ============================================================================
-- 2. DEALERSHIPS
-- ============================================================================
CREATE TABLE dealers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    dealership_name VARCHAR(191) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    gstin VARCHAR(15) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_VERIFICATION',
    rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    total_quotes INT NOT NULL DEFAULT 0,
    total_leads_delivered INT NOT NULL DEFAULT 0,
    verified_at TIMESTAMP(6) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uq_dealers_user_id UNIQUE (user_id),
    CONSTRAINT uq_dealers_gstin UNIQUE (gstin),
    CONSTRAINT fk_dealers_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT chk_dealer_status CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED', 'SUSPENDED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_dealers_brand_city ON dealers (brand, city);

-- ============================================================================
-- 3. VEHICLE CATALOGUE
-- ============================================================================
CREATE TABLE cars (
    id VARCHAR(36) PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    body_type VARCHAR(30) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    min_price DECIMAL(12, 2) NOT NULL,
    max_price DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uq_cars_brand_model UNIQUE (brand, model)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE car_variants (
    id VARCHAR(36) PRIMARY KEY,
    car_id VARCHAR(36) NOT NULL,
    name VARCHAR(120) NOT NULL,
    fuel_type VARCHAR(30) NOT NULL,
    transmission VARCHAR(30) NOT NULL,
    ex_showroom_price DECIMAL(12, 2) NOT NULL,
    key_features JSON NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_variants_car FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE,
    CONSTRAINT chk_fuel_type CHECK (fuel_type IN ('PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID')),
    CONSTRAINT chk_transmission CHECK (transmission IN ('MANUAL', 'AUTOMATIC', 'IMT', 'EV'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_variants_car_price ON car_variants (car_id, ex_showroom_price);

-- ============================================================================
-- 4. DEMAND GROUPS & MEMBERSHIPS
-- ============================================================================
CREATE TABLE buyer_groups (
    id VARCHAR(36) PRIMARY KEY,
    car_id VARCHAR(36) NOT NULL,
    variant_id VARCHAR(36) NOT NULL,
    city VARCHAR(100) NOT NULL,
    target_members INT NOT NULL,
    current_members INT NOT NULL DEFAULT 0,
    stage VARCHAR(30) NOT NULL DEFAULT 'FORMATION',
    expires_at TIMESTAMP(6) NOT NULL,
    created_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_groups_car FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE RESTRICT,
    CONSTRAINT fk_groups_variant FOREIGN KEY (variant_id) REFERENCES car_variants (id) ON DELETE RESTRICT,
    CONSTRAINT fk_groups_creator FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT chk_group_stage CHECK (stage IN ('FORMATION', 'OPEN_FOR_QUOTES', 'UNDER_REVIEW', 'CLOSED', 'CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_groups_city_stage ON buyer_groups (city, stage);
CREATE INDEX idx_groups_variant_stage ON buyer_groups (variant_id, stage);

CREATE TABLE group_memberships (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    joined_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    left_at TIMESTAMP(6) NULL,
    CONSTRAINT fk_memberships_group FOREIGN KEY (group_id) REFERENCES buyer_groups (id) ON DELETE RESTRICT,
    CONSTRAINT fk_memberships_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT uq_group_active_user UNIQUE (group_id, user_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE buyer_signals (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    timeline_months VARCHAR(30) NOT NULL,
    purchase_mode VARCHAR(30) NOT NULL,
    exchange_car BOOLEAN NOT NULL DEFAULT FALSE,
    exchange_car_details VARCHAR(255) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_signals_group FOREIGN KEY (group_id) REFERENCES buyer_groups (id) ON DELETE RESTRICT,
    CONSTRAINT fk_signals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT uq_signals_group_user UNIQUE (group_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================================
-- 5. QUOTATIONS & VERSIONS
-- ============================================================================
CREATE TABLE quotations (
    id VARCHAR(36) PRIMARY KEY,
    group_id VARCHAR(36) NOT NULL,
    dealer_id VARCHAR(36) NOT NULL,
    current_version_id VARCHAR(36) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_quotes_group FOREIGN KEY (group_id) REFERENCES buyer_groups (id) ON DELETE RESTRICT,
    CONSTRAINT fk_quotes_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE RESTRICT,
    CONSTRAINT uq_quotes_group_dealer UNIQUE (group_id, dealer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE quotation_versions (
    id VARCHAR(36) PRIMARY KEY,
    quotation_id VARCHAR(36) NOT NULL,
    version_number INT NOT NULL,
    ex_showroom_price DECIMAL(12, 2) NOT NULL,
    registration_charges DECIMAL(12, 2) NOT NULL,
    insurance_charges DECIMAL(12, 2) NOT NULL,
    accessories_charges DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    other_charges DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    group_discount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    corporate_discount DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    exchange_bonus DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_on_road_price DECIMAL(12, 2) NOT NULL,
    accessory_package TEXT NULL,
    warranty_years INT NOT NULL DEFAULT 3,
    valid_until TIMESTAMP(6) NOT NULL,
    delivery_timeline_weeks INT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_versions_quotation FOREIGN KEY (quotation_id) REFERENCES quotations (id) ON DELETE RESTRICT,
    CONSTRAINT uq_quote_version_num UNIQUE (quotation_id, version_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================================
-- 6. CONSENTS & DELIVERED LEADS
-- ============================================================================
CREATE TABLE consents (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    dealer_id VARCHAR(36) NOT NULL,
    quotation_id VARCHAR(36) NOT NULL,
    quotation_version_id VARCHAR(36) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'GRANTED',
    granted_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    revoked_at TIMESTAMP(6) NULL,
    revocation_reason VARCHAR(255) NULL,
    CONSTRAINT fk_consents_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_consents_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE RESTRICT,
    CONSTRAINT fk_consents_quotation FOREIGN KEY (quotation_id) REFERENCES quotations (id) ON DELETE RESTRICT,
    CONSTRAINT fk_consents_version FOREIGN KEY (quotation_version_id) REFERENCES quotation_versions (id) ON DELETE RESTRICT,
    CONSTRAINT uq_user_quote_consent UNIQUE (user_id, quotation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE leads (
    id VARCHAR(36) PRIMARY KEY,
    consent_id VARCHAR(36) NOT NULL,
    dealer_id VARCHAR(36) NOT NULL,
    buyer_id VARCHAR(36) NOT NULL,
    quotation_id VARCHAR(36) NOT NULL,
    quotation_version_id VARCHAR(36) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DEMO_DELIVERED',
    buyer_name VARCHAR(120) NOT NULL,
    buyer_phone VARCHAR(15) NOT NULL,
    buyer_email VARCHAR(191) NOT NULL,
    buyer_city VARCHAR(100) NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT uq_leads_consent UNIQUE (consent_id),
    CONSTRAINT fk_leads_consent FOREIGN KEY (consent_id) REFERENCES consents (id) ON DELETE RESTRICT,
    CONSTRAINT fk_leads_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE RESTRICT,
    CONSTRAINT fk_leads_buyer FOREIGN KEY (buyer_id) REFERENCES users (id) ON DELETE RESTRICT,
    CONSTRAINT fk_leads_version FOREIGN KEY (quotation_version_id) REFERENCES quotation_versions (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_leads_dealer_status ON leads (dealer_id, status);

CREATE TABLE lead_events (
    id VARCHAR(36) PRIMARY KEY,
    lead_id VARCHAR(36) NOT NULL,
    actor_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(40) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_lead_events_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE CASCADE,
    CONSTRAINT fk_lead_events_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE lead_disputes (
    id VARCHAR(36) PRIMARY KEY,
    lead_id VARCHAR(36) NOT NULL,
    dealer_id VARCHAR(36) NOT NULL,
    reason VARCHAR(50) NOT NULL,
    evidence_text TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',
    resolution VARCHAR(40) NULL,
    admin_notes TEXT NULL,
    resolved_by VARCHAR(36) NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    resolved_at TIMESTAMP(6) NULL,
    CONSTRAINT fk_disputes_lead FOREIGN KEY (lead_id) REFERENCES leads (id) ON DELETE RESTRICT,
    CONSTRAINT fk_disputes_dealer FOREIGN KEY (dealer_id) REFERENCES dealers (id) ON DELETE RESTRICT,
    CONSTRAINT fk_disputes_resolver FOREIGN KEY (resolved_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================================================
-- 7. AUDIT & NOTIFICATIONS
-- ============================================================================
CREATE TABLE audit_events (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(60) NOT NULL,
    user_id VARCHAR(36) NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent VARCHAR(255) NULL,
    metadata JSON NULL,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_audit_resource ON audit_events (resource_type, resource_id);
CREATE INDEX idx_audit_user ON audit_events (user_id, created_at);

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(191) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL,
    link VARCHAR(255) NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_notifications_user_read ON notifications (user_id, is_read, created_at);
```

---

## 3. Database Migration Strategy
- **Tool**: Flyway Community Edition integrated into Spring Boot (`org.flywaydb:flyway-core`, `org.flywaydb:flyway-mysql`).
- **File Structure**:
  - `src/main/resources/db/migration/V1__init_schema.sql` (Tables, constraints, initial indices)
  - `src/main/resources/db/migration/V2__seed_catalogue_and_dealers.sql` (Reference automotive brands and OEM trim benchmarks)
- **Zero-Downtime Rule**: DDL updates in production must follow expand-and-contract patterns (e.g. adding nullable columns first, backfilling, then applying constraints).
