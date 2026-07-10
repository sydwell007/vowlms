<?php
require_once __DIR__ . '/response.php';

/**
 * Small fixed-window limiter suitable for a single Afrihost PHP host.
 * Keys are hashed and stored in the system temp directory; no email or IP is
 * written in plain text. Replace with a shared store if the API is scaled out.
 */
function requireRateLimit(string $scope, string $subject, int $maximum, int $windowSeconds): void {
    $address = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $key = hash('sha256', $scope . '|' . $address . '|' . strtolower(trim($subject)));
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'vowlms-rate-limits';

    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) {
        error_log('VowLMS rate-limit directory could not be created');
        return;
    }

    $path = $directory . DIRECTORY_SEPARATOR . $key . '.json';
    $handle = fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        error_log('VowLMS rate-limit state could not be locked');
        return;
    }

    $raw = stream_get_contents($handle);
    $state = $raw ? json_decode($raw, true) : null;
    $now = time();
    if (!is_array($state) || ($state['started_at'] ?? 0) + $windowSeconds <= $now) {
        $state = ['started_at' => $now, 'count' => 0];
    }

    $state['count']++;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, json_encode($state));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    if ($state['count'] > $maximum) {
        $retryAfter = max(1, ($state['started_at'] + $windowSeconds) - $now);
        header('Retry-After: ' . $retryAfter);
        jsonError('Too many attempts. Please try again later.', 429);
    }
}
