<?php
/**
 * VowLMS PHP Bridge — Server-Side Environment Config
 *
 * Upload this file to Afrihost at:
 *   api.goalvow.com → config/env.local.php
 *
 * This file is auto-loaded by config/env.php on every PHP request.
 * Keep this file OUTSIDE the public web root if possible.
 * Never commit real credentials to git — replace with actual values before uploading.
 */

// ── Database (Afrihost MySQL) ──────────────────────────────────────────────────
$_ENV['DB_HOST'] = '154.0.165.195';
$_ENV['DB_NAME'] = 'goalvxiw_vowlms';
$_ENV['DB_USER'] = 'goalvxiw_vowlms';
$_ENV['DB_PASS'] = 'Mechatronics@666';

// ── Bridge Security ───────────────────────────────────────────────────────────
// Must match BRIDGE_API_KEY in Vercel / Next.js .env.local exactly
$_ENV['BRIDGE_API_KEY'] = 'qVeXCDPQPLV7xihO62EhIzbw0IowhKxPT4XnvWG3Z9zsdaaY4OxjehjZqgy7jL4X';

// ── JWT (must match Next.js JWT_SECRET) ───────────────────────────────────────
$_ENV['JWT_SECRET'] = 'qVeXCDPQPLV7xihO62EhIzbw0IowhKxPT4XnvWG3Z9zsdaaY4OxjehjZqgy7jL4X';

// ── Moodle Webservice Token ───────────────────────────────────────────────────
// Required for serve.php to proxy lesson videos and files from Moodle.
// Moodle admin: Site administration → Server → Web services → Manage tokens
// Create a token for an admin account, then paste it below.
// The token allows server-to-server fetching of pluginfile.php without a session.
$_ENV['MOODLE_TOKEN'] = 'PASTE_YOUR_MOODLE_TOKEN_HERE';

// ── App URLs ──────────────────────────────────────────────────────────────────
$_ENV['APP_URL']         = 'https://vowlms.vercel.app';
$_ENV['FRONTEND_ORIGIN'] = 'https://vowlms.vercel.app';
$_ENV['API_BASE_URL']    = 'https://api.goalvow.com';
