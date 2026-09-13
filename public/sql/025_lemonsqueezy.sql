-- =============================================================================
-- VowLMS — Schema Patch 025
-- Adds Lemon Squeezy as a third international gateway, routed for EU + UK
-- buyers specifically: Lemon Squeezy is a merchant-of-record reseller, so it
-- calculates, collects, and remits EU/UK VAT on our behalf — VowLMS never has
-- to register for VAT in any of these jurisdictions. Everyone else keeps
-- their existing PayFast/Paystack/PayPal routing unchanged.
--
-- Run after 024_gateway_config_fix.sql. Re-running is safe (ALTER ... MODIFY
-- and INSERT IGNORE are both idempotent).
-- =============================================================================

ALTER TABLE `gateway_config`
  MODIFY COLUMN `gateway` ENUM('payfast','paystack','paypal','lemonsqueezy') NOT NULL;

ALTER TABLE `international_payments`
  MODIFY COLUMN `gateway` ENUM('paystack','paypal','lemonsqueezy') NOT NULL;

-- EU (27 members) + UK — Lemon Squeezy always settles in USD regardless of
-- buyer country (it shows the buyer their own local-currency equivalent at
-- checkout, but what we send/reconcile is always USD), hence 'USD' here too.
INSERT IGNORE INTO `gateway_config` (`country_code`, `gateway`, `currency`) VALUES
  ('AT', 'lemonsqueezy', 'USD'), ('BE', 'lemonsqueezy', 'USD'), ('BG', 'lemonsqueezy', 'USD'),
  ('HR', 'lemonsqueezy', 'USD'), ('CY', 'lemonsqueezy', 'USD'), ('CZ', 'lemonsqueezy', 'USD'),
  ('DK', 'lemonsqueezy', 'USD'), ('EE', 'lemonsqueezy', 'USD'), ('FI', 'lemonsqueezy', 'USD'),
  ('FR', 'lemonsqueezy', 'USD'), ('DE', 'lemonsqueezy', 'USD'), ('GR', 'lemonsqueezy', 'USD'),
  ('HU', 'lemonsqueezy', 'USD'), ('IE', 'lemonsqueezy', 'USD'), ('IT', 'lemonsqueezy', 'USD'),
  ('LV', 'lemonsqueezy', 'USD'), ('LT', 'lemonsqueezy', 'USD'), ('LU', 'lemonsqueezy', 'USD'),
  ('MT', 'lemonsqueezy', 'USD'), ('NL', 'lemonsqueezy', 'USD'), ('PL', 'lemonsqueezy', 'USD'),
  ('PT', 'lemonsqueezy', 'USD'), ('RO', 'lemonsqueezy', 'USD'), ('SK', 'lemonsqueezy', 'USD'),
  ('SI', 'lemonsqueezy', 'USD'), ('ES', 'lemonsqueezy', 'USD'), ('SE', 'lemonsqueezy', 'USD'),
  ('GB', 'lemonsqueezy', 'USD');

-- =============================================================================
-- Patch 025 complete. Re-run is safe.
-- =============================================================================
