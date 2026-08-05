<?php
/**
 * Sends a REAL test email using the project's existing mail sender (public/php/lib/mail.php).
 *
 * Note for the diagnostic report: sendMail() uses PHP's native mail() function against the
 * host's local MTA — it does NOT currently use SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS from
 * .env.example despite those being configured. Only SMTP_FROM is read. If a real SMTP relay
 * (rather than the shared host's sendmail) is required, mail.php's sendMail() needs to change
 * to use those variables — this endpoint tests what actually sends mail today, not what the
 * env vars imply.
 */
ob_start();
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/mail.php';
require_once __DIR__ . '/lib/health-log.php';
ob_end_clean();

setCors();
requireBridgeKey();
requireMethod('POST');

$payload = requireAuth();
requireRole($payload, 'admin', 'facilitator');

$body = getJsonBody();
$toEmail = trim($body['to_email'] ?? '');
$template = $body['template'] ?? '';

if (!filter_var($toEmail, FILTER_VALIDATE_EMAIL)) jsonError('A valid to_email is required');

$allowedTemplates = ['welcome', 'password_reset', 'certificate'];
if (!in_array($template, $allowedTemplates, true)) {
    jsonError('template must be one of: ' . implode(', ', $allowedTemplates));
}

[$subject, $html] = match ($template) {
    'welcome' => ['[QA test] Welcome to VowLMS', welcomeEmail('QA Test Learner')],
    'password_reset' => ['[QA test] Reset your password', resetPasswordEmail('QA Test Learner', 'qa-test-token-' . bin2hex(random_bytes(6)))],
    'certificate' => ['[QA test] Certificate issued', certificateEmail('QA Test Learner', 'Improving your Mental Health', 'QA-TEST-' . strtoupper(bin2hex(random_bytes(4))))],
};

$start = microtime(true);
$sent = false;
$error = null;

try {
    $sent = sendMail($toEmail, $subject, $html);
    if (!$sent) $error = "mail() returned false — check the host's local MTA / sendmail configuration.";
} catch (Throwable $e) {
    $error = $e->getMessage();
}

$db = getDb();
logIntegrationHealth($db, [
    'service_name' => 'smtp',
    'endpoint' => "mail() -> {$toEmail}",
    'response_time_ms' => (int)round((microtime(true) - $start) * 1000),
    'success' => $sent,
    'error_message' => $error,
    'triggered_by' => $payload['sub'] ?? null,
]);

jsonOk([
    'sent' => $sent,
    'smtpResponse' => $sent ? 'Accepted by local MTA (mail() returned true — this does not guarantee inbox delivery)' : null,
    'error' => $error,
]);
