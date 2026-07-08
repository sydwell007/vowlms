<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../lib/auth.php';
require_once __DIR__ . '/../../lib/response.php';

setCors();
requireBridgeKey();
requireMethod('POST');

// JWT is stateless — client deletes the cookie; nothing to invalidate server-side
jsonOk(['loggedOut' => true]);
