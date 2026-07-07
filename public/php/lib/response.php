<?php
function jsonOk(mixed $data, int $status = 200): never {
    http_response_code($status);
    echo json_encode([
        'ok'        => true,
        'data'      => $data,
        'timestamp' => gmdate('c'),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function jsonCreated(mixed $data): never {
    jsonOk($data, 201);
}

function jsonError(string $message, int $status = 400): never {
    http_response_code($status);
    echo json_encode([
        'ok'        => false,
        'error'     => $message,
        'timestamp' => gmdate('c'),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody(): array {
    $raw  = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function requireMethod(string ...$methods): void {
    if (!in_array($_SERVER['REQUEST_METHOD'], $methods, true)) {
        jsonError('Method not allowed', 405);
    }
}
