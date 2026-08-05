-- =============================================================================
-- VowLMS — Schema Patch 017
-- integration_health_log: every diagnostic/integration-test run (public/php/api/qa/*)
-- logs here — endpoint, latency, success, and error detail. `service_name` is
-- VARCHAR(50) rather than a fixed ENUM as originally specified, so a new
-- integration can be added later without another ALTER TABLE migration; current
-- values in use: vowrewards, plugconnect, vr, payfast, smtp, db, seed, diagnostics.
-- Ids corrected to VARCHAR(36) UUIDs matching 001_schema.sql conventions.
-- `triggered_by` records which authenticated identity ran the check (JWT `sub`),
-- satisfying the "log who triggered every diagnostic run" security requirement.
-- =============================================================================

CREATE TABLE IF NOT EXISTS `integration_health_log` (
  `id`                VARCHAR(36)  NOT NULL,
  `service_name`      VARCHAR(50)  NOT NULL,
  `endpoint`           VARCHAR(255) NOT NULL,
  `status_code`        INT          NULL,
  `response_time_ms`   INT          NULL,
  `success`            TINYINT(1)   NOT NULL,
  `error_message`      TEXT         NULL,
  `triggered_by`       VARCHAR(36)  NULL,
  `checked_at`         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_service_time` (`service_name`, `checked_at`),
  CONSTRAINT `fk_healthlog_user` FOREIGN KEY (`triggered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
