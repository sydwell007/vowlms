-- =============================================================================
-- VowLMS — Schema Patch 035
-- Switches every Paystack-routed country (CI, EG, GH, KE, NG, RW) from USD
-- to ZAR — confirmed directly against Paystack's own API that this merchant
-- account only supports ZAR ("Currency not supported by merchant" for USD/
-- NGN/GHS/KES), per explicit user decision 2026-09-16.
--
-- No PHP or frontend code change needed: gateway_routing.php's
-- resolveGatewayForCountry() already reads currency straight from this
-- table, and exchange_rates.php's getCachedExchangeRate() already
-- short-circuits to rate = 1.0 when quote and base currency are identical
-- (i.e. ZAR→ZAR), so this doesn't depend on the exchange-rate cache at all
-- for these countries.
--
-- Idempotent: setting currency to 'ZAR' twice is a no-op.
-- =============================================================================

UPDATE `gateway_config` SET `currency` = 'ZAR' WHERE `gateway` = 'paystack';

-- =============================================================================
-- Patch 035 complete. Re-run is safe.
-- =============================================================================
