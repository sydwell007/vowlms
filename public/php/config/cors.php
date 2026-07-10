<?php
require_once __DIR__ . '/env.php';

function setCors(): void {
    $allowed = env('FRONTEND_ORIGIN', 'https://vowlms.vercel.app');

    header('Access-Control-Allow-Origin: ' . $allowed);
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Bridge-Key');
    header('Access-Control-Allow-Credentials: true');
    header('Content-Type: application/json; charset=utf-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
