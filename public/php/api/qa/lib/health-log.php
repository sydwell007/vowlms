<?php
/**
 * Shared logger for public/php/api/qa/* diagnostics — every check writes one row to
 * integration_health_log (public/sql/017_integration_health_log.sql), satisfying the
 * "log every diagnostic run with timestamp and who triggered it" requirement.
 * Never throws — a logging failure must not break the diagnostic it's logging.
 */
function logIntegrationHealth(?PDO $db, array $entry): void {
    if (!$db) return;

    try {
        $db->prepare(
            'INSERT INTO integration_health_log
                (id, service_name, endpoint, status_code, response_time_ms, success, error_message, triggered_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        )->execute([
            generateId(),
            $entry['service_name'],
            $entry['endpoint'],
            $entry['status_code'] ?? null,
            $entry['response_time_ms'] ?? null,
            !empty($entry['success']) ? 1 : 0,
            $entry['error_message'] ?? null,
            $entry['triggered_by'] ?? null,
        ]);
    } catch (Throwable $e) {
        error_log('integration_health_log write failed: ' . $e->getMessage());
    }
}
