-- =============================================================================
-- VowLMS - Promote an existing account to administrator
-- OPTIONAL: do not run as part of the numbered schema import.
-- =============================================================================
--
-- SAFEST PROCEDURE
-- 1. Deploy the PHP API and VowLMS registration flow.
-- 2. Create your own account through the normal VowLMS sign-up page. This
--    ensures PHP creates a secure password hash; never put a password in SQL.
-- 3. Confirm the account appears in the users table.
-- 4. Replace REPLACE_WITH_YOUR_ADMIN_EMAIL below with that exact email.
-- 5. Run this file once in phpMyAdmin.
-- 6. Confirm promoted_rows = 1 and the final row shows role = admin.
--
-- If promoted_rows = 0, no account matched. Do not insert a placeholder user;
-- register the account normally, confirm its email, and retry this script.
-- =============================================================================

USE `goalvxiw_vowlms`;
SET NAMES utf8mb4;

SET @admin_email = 'REPLACE_WITH_YOUR_ADMIN_EMAIL';

-- Preview the exact account that will be promoted.
SELECT `id`, `name`, `email`, `role`, `is_active`, `email_verified`
FROM `goalvxiw_vowlms`.`users`
WHERE `email` = @admin_email;

START TRANSACTION;

UPDATE `goalvxiw_vowlms`.`users`
SET `role` = 'admin',
    `is_active` = 1
WHERE `email` = @admin_email
  AND @admin_email <> 'REPLACE_WITH_YOUR_ADMIN_EMAIL';

SELECT ROW_COUNT() AS promoted_rows;

COMMIT;

-- Final verification. This must return exactly your intended account.
SELECT `id`, `name`, `email`, `role`, `is_active`, `email_verified`, `created_at`
FROM `goalvxiw_vowlms`.`users`
WHERE `email` = @admin_email
  AND `role` = 'admin';
