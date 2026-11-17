-- ============================================================================
-- DRIVEDEALS: Standalone SQL Script to Wipe All Dummy Data
-- Run this directly in MySQL Workbench or via command line:
-- mysql -u root -p drivedeals < clean_dummy_data.sql
-- ============================================================================

USE drivedeals;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Wipe all test transactional, dispute, and moderation records
TRUNCATE TABLE lead_disputes;
TRUNCATE TABLE lead_events;
TRUNCATE TABLE leads;
TRUNCATE TABLE consents;
TRUNCATE TABLE quotation_versions;
TRUNCATE TABLE quotations;
TRUNCATE TABLE buyer_signals;
TRUNCATE TABLE group_memberships;
TRUNCATE TABLE buyer_groups;
TRUNCATE TABLE moderation_items;
TRUNCATE TABLE notifications;
TRUNCATE TABLE audit_events;

-- 2. Wipe dummy vehicles and variants
TRUNCATE TABLE car_variants;
TRUNCATE TABLE cars;

-- 3. Wipe dummy dealerships
TRUNCATE TABLE dealers;

-- 4. Clean out any dummy/test users, strictly preserving the Platform Administrator
DELETE FROM users WHERE id != 'admin_user_primary' AND email != 'admin@drivedeals.in';

-- Ensure Platform Administrator is in ACTIVE state with full ADMIN role
INSERT INTO users (id, name, email, phone, role, city, pincode, status, created_at) VALUES
('admin_user_primary', 'Platform Administrator', 'admin@drivedeals.in', '+919876543210', 'ADMIN', 'Pune', '411001', 'ACTIVE', '2026-01-01 00:00:00')
ON DUPLICATE KEY UPDATE role='ADMIN', status='ACTIVE';

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'All dummy data wiped successfully! Only Platform Administrator remains.' AS Status;
