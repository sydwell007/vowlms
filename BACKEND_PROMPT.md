# VowLMS — Afrihost Backend Generation Prompt

**Paste this entire document into ChatGPT or Claude to generate all backend files.**

After pasting, request:
1. "Generate all PHP files listed under FILE LIST as a downloadable ZIP"
2. "Generate the SQL schema file (vowlms_schema.sql) as a downloadable file"

---

## CONTEXT

**Project:** VowLMS — GoalVow Holdings Learning Management System  
**Frontend:** Next.js 16 on Vercel (vowlms.vercel.app)  
**Backend:** PHP 8.1 + MySQL 8 on Afrihost shared hosting  
**Architecture:** Next.js API routes → PHP REST API on Afrihost → MySQL  
**Domain:** goalvow.com (Afrihost) | vowlms.vercel.app (Vercel)

The PHP API lives at: `https://goalvow.com/vowlms-api/`  
It is called by the Next.js frontend using a shared secret header `X-Bridge-Key`.

All PHP responses must follow this envelope:
```json
{ "ok": true, "data": {}, "timestamp": "2026-06-28T00:00:00Z" }
{ "ok": false, "error": "message", "timestamp": "2026-06-28T00:00:00Z" }
```

---

## SECURITY REQUIREMENTS

- Every endpoint (except `/health`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/payments/payfast-notify`) must validate the `X-Bridge-Key` header against `BRIDGE_API_KEY` env var
- Authenticated endpoints must validate the `Authorization: Bearer <JWT>` header
- JWT uses HS256 with secret `JWT_SECRET` env var
- Passwords hashed with `password_hash($password, PASSWORD_BCRYPT)`
- All SQL uses PDO prepared statements — no string interpolation in queries
- PayFast ITN must verify the MD5 signature before updating any record
- CORS must only allow origin `https://vowlms.vercel.app`

---

## ENVIRONMENT VARIABLES (in Afrihost cPanel → PHP Config or `.env` file)

```
DB_HOST=localhost
DB_NAME=goalvow_lms
DB_USER=goalvow_lms_user
DB_PASS=your_mysql_password
BRIDGE_API_KEY=your_random_hex_secret_matching_vercel
JWT_SECRET=your_jwt_secret_matching_vercel
PAYFAST_MERCHANT_ID=your_payfast_merchant_id
PAYFAST_MERCHANT_KEY=your_payfast_merchant_key
PAYFAST_PASSPHRASE=your_payfast_passphrase
SMTP_HOST=mail.goalvow.com
SMTP_PORT=587
SMTP_USER=support@goalvow.com
SMTP_PASS=your_email_password
SMTP_FROM=noreply@goalvow.com
VOWLMS_APP_URL=https://vowlms.vercel.app
```

---

## FILE LIST — Generate every file below

### Folder structure:
```
vowlms-api/
├── .htaccess
├── config/
│   ├── db.php
│   ├── cors.php
│   └── env.php
├── lib/
│   ├── jwt.php
│   ├── auth.php
│   ├── response.php
│   └── mail.php
├── api/
│   ├── health.php
│   ├── auth/
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── logout.php
│   │   ├── me.php
│   │   ├── forgot-password.php
│   │   └── reset-password.php
│   ├── courses/
│   │   └── index.php
│   ├── academies/
│   │   └── index.php
│   ├── enrollments/
│   │   └── index.php
│   ├── progress/
│   │   └── index.php
│   ├── certificates/
│   │   ├── index.php
│   │   └── generate.php
│   ├── assessments/
│   │   └── submit.php
│   ├── vr/
│   │   └── submit.php
│   ├── rewards/
│   │   └── award.php
│   ├── opportunities/
│   │   └── index.php
│   ├── learning-hubs/
│   │   └── index.php
│   ├── dashboard/
│   │   ├── learner.php
│   │   ├── admin.php
│   │   ├── facilitator.php
│   │   └── employer.php
│   └── payments/
│       ├── payfast-create.php
│       └── payfast-notify.php
└── sql/
    ├── vowlms_schema.sql
    └── vowlms_seed.sql  (academies only — courses come from export script)
```

---

## DETAILED SPECIFICATIONS PER FILE

---

### `.htaccess`
```apache
Options -Indexes
RewriteEngine On

# Block direct access to config and lib folders
RewriteRule ^config/ - [F,L]
RewriteRule ^lib/ - [F,L]
RewriteRule ^sql/ - [F,L]

# Route API paths to PHP files
RewriteRule ^health/?$ api/health.php [L,QSA]

RewriteRule ^auth/login/?$ api/auth/login.php [L,QSA]
RewriteRule ^auth/register/?$ api/auth/register.php [L,QSA]
RewriteRule ^auth/logout/?$ api/auth/logout.php [L,QSA]
RewriteRule ^auth/me/?$ api/auth/me.php [L,QSA]
RewriteRule ^auth/forgot-password/?$ api/auth/forgot-password.php [L,QSA]
RewriteRule ^auth/reset-password/?$ api/auth/reset-password.php [L,QSA]

RewriteRule ^courses/?$ api/courses/index.php [L,QSA]
RewriteRule ^courses/([^/]+)/?$ api/courses/index.php?slug=$1 [L,QSA]

RewriteRule ^academies/?$ api/academies/index.php [L,QSA]
RewriteRule ^academies/([^/]+)/?$ api/academies/index.php?slug=$1 [L,QSA]

RewriteRule ^enrollments/?$ api/enrollments/index.php [L,QSA]
RewriteRule ^progress/?$ api/progress/index.php [L,QSA]
RewriteRule ^certificates/?$ api/certificates/index.php [L,QSA]
RewriteRule ^certificates/generate/?$ api/certificates/generate.php [L,QSA]
RewriteRule ^assessments/submit/?$ api/assessments/submit.php [L,QSA]
RewriteRule ^vr/submit/?$ api/vr/submit.php [L,QSA]
RewriteRule ^rewards/award/?$ api/rewards/award.php [L,QSA]
RewriteRule ^opportunities/?$ api/opportunities/index.php [L,QSA]
RewriteRule ^learning-hubs/?$ api/learning-hubs/index.php [L,QSA]

RewriteRule ^dashboard/learner/?$ api/dashboard/learner.php [L,QSA]
RewriteRule ^dashboard/admin/?$ api/dashboard/admin.php [L,QSA]
RewriteRule ^dashboard/facilitator/?$ api/dashboard/facilitator.php [L,QSA]
RewriteRule ^dashboard/employer/?$ api/dashboard/employer.php [L,QSA]

RewriteRule ^payments/payfast-create/?$ api/payments/payfast-create.php [L,QSA]
RewriteRule ^payments/payfast-notify/?$ api/payments/payfast-notify.php [L,QSA]
```

---

### `config/env.php`
Load environment variables from Afrihost PHP Config or a local `.env` file.

```php
<?php
// Reads env vars set via Afrihost cPanel PHP Config
// Falls back to reading a local .env file (for dev)
function env(string $key, string $default = ''): string {
    $val = getenv($key);
    if ($val !== false) return $val;
    return $_ENV[$key] ?? $default;
}
```

---

### `config/db.php`
PDO MySQL connection singleton.

```php
<?php
require_once __DIR__ . '/env.php';

function getDb(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    $dsn = 'mysql:host=' . env('DB_HOST', 'localhost') . ';dbname=' . env('DB_NAME') . ';charset=utf8mb4';
    $pdo = new PDO($dsn, env('DB_USER'), env('DB_PASS'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}
```

---

### `config/cors.php`
Set CORS headers and handle preflight OPTIONS.

```php
<?php
require_once __DIR__ . '/env.php';

function setCors(): void {
    $allowed = env('VOWLMS_APP_URL', 'https://vowlms.vercel.app');
    header('Access-Control-Allow-Origin: ' . $allowed);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Bridge-Key');
    header('Access-Control-Allow-Credentials: true');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
```

---

### `lib/jwt.php`
Pure PHP HS256 JWT implementation (no Composer needed).

```php
<?php
require_once __DIR__ . '/../config/env.php';

class JWT {
    public static function encode(array $payload, int $ttlSeconds = 2592000): string {
        $secret = env('JWT_SECRET');
        $header = self::b64(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['iat'] = time();
        $payload['exp'] = time() + $ttlSeconds;
        $body = self::b64($payload);
        $sig = self::sign("$header.$body", $secret);
        return "$header.$body.$sig";
    }

    public static function decode(string $token): ?array {
        $secret = env('JWT_SECRET');
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        [$header, $body, $sig] = $parts;
        if (!hash_equals(self::sign("$header.$body", $secret), $sig)) return null;
        $payload = json_decode(self::b64d($body), true);
        if (!$payload || (isset($payload['exp']) && $payload['exp'] < time())) return null;
        return $payload;
    }

    private static function b64(array $data): string {
        return rtrim(strtr(base64_encode(json_encode($data)), '+/', '-_'), '=');
    }

    private static function b64d(string $data): string {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', (4 - strlen($data) % 4) % 4));
    }

    private static function sign(string $data, string $secret): string {
        return rtrim(strtr(base64_encode(hash_hmac('sha256', $data, $secret, true)), '+/', '-_'), '=');
    }
}
```

---

### `lib/auth.php`
Middleware helpers — validate bridge key and extract user from JWT.

```php
<?php
require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/jwt.php';
require_once __DIR__ . '/response.php';

function requireBridgeKey(): void {
    $key = $_SERVER['HTTP_X_BRIDGE_KEY'] ?? '';
    if (!hash_equals(env('BRIDGE_API_KEY'), $key)) {
        jsonError('Forbidden', 403);
        exit;
    }
}

function requireAuth(): array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $token = str_starts_with($auth, 'Bearer ') ? substr($auth, 7) : null;
    if (!$token) { jsonError('Unauthorized', 401); exit; }
    $payload = JWT::decode($token);
    if (!$payload) { jsonError('Unauthorized — invalid or expired token', 401); exit; }
    return $payload; // returns ['sub' => userId, 'role' => role, ...]
}

function requireRole(array $payload, string ...$roles): void {
    if (!in_array($payload['role'] ?? '', $roles)) {
        jsonError('Forbidden', 403);
        exit;
    }
}
```

---

### `lib/response.php`
JSON response helpers.

```php
<?php
function jsonOk(mixed $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => true, 'data' => $data, 'timestamp' => gmdate('c')], JSON_UNESCAPED_UNICODE);
    exit;
}

function jsonError(string $message, int $status = 400): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => $message, 'timestamp' => gmdate('c')], JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
```

---

### `lib/mail.php`
SMTP email sender using PHP's mail() or PHPMailer fallback.

```php
<?php
require_once __DIR__ . '/../config/env.php';

function sendMail(string $to, string $subject, string $body): bool {
    // For Afrihost shared hosting: use the built-in mail() with proper headers
    // Or install PHPMailer via cPanel and require it here
    $from = env('SMTP_FROM', 'noreply@goalvow.com');
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=utf-8\r\n";
    $headers .= "From: GoalVow LMS <{$from}>\r\n";
    $headers .= "Reply-To: {$from}\r\n";
    return mail($to, $subject, $body, $headers);
}
```

---

### `api/health.php`
```php
<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../config/db.php';

setCors();

$dbStatus = 'unknown';
try {
    getDb()->query('SELECT 1');
    $dbStatus = 'healthy';
} catch (Exception $e) {
    $dbStatus = 'error: ' . $e->getMessage();
}

jsonOk([
    'service' => 'VowLMS Bridge',
    'status'  => 'healthy',
    'version' => '1.0.0',
    'checks'  => ['db' => $dbStatus, 'php' => PHP_VERSION],
]);
```

---

### `api/auth/login.php`
- Method: POST
- Body: `{ email, password }`
- No auth required (but validate bridge key)
- Hash compare with `password_verify()`
- Return: `{ token, user: { id, name, email, role } }`

```php
<?php
require_once __DIR__ . '/../../../config/cors.php';
require_once __DIR__ . '/../../../lib/auth.php';
require_once __DIR__ . '/../../../lib/jwt.php';
require_once __DIR__ . '/../../../lib/response.php';
require_once __DIR__ . '/../../../config/db.php';

setCors();
requireBridgeKey();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') { jsonError('Method not allowed', 405); }

$body = getJsonBody();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) { jsonError('email and password are required'); }

$stmt = getDb()->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonError('Invalid email or password', 401);
}

$token = JWT::encode(['sub' => $user['id'], 'role' => $user['role'], 'email' => $user['email']]);

jsonOk([
    'token' => $token,
    'user'  => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']],
]);
```

---

### `api/auth/register.php`
- Method: POST
- Body: `{ name, email, password, phone? }`
- Validate email uniqueness
- Hash password with bcrypt
- Return: `{ token, user }`

---

### `api/auth/logout.php`
- Method: POST
- Stateless JWT — just return `{ loggedOut: true }`
- No DB action needed (token expiry is enforced by exp claim)

---

### `api/auth/me.php`
- Method: GET
- Requires auth JWT
- Query users table by JWT `sub` (user id)
- Return: `{ id, name, email, role, phone?, city? }`

---

### `api/auth/forgot-password.php`
- Method: POST
- Body: `{ email }`
- Generate secure random token, store in `password_resets` table
- Email the reset link: `https://vowlms.vercel.app/auth/reset-password?token=TOKEN`
- Always return success (don't reveal if email exists)

---

### `api/auth/reset-password.php`
- Method: POST
- Body: `{ token, password }`
- Validate token from `password_resets` table (check expires_at)
- Update user password hash
- Delete used token

---

### `api/courses/index.php`
- GET (no auth, no bridge key check for public data):
  - If `?slug=` param: return single course with modules + lessons
  - Else: return all courses with `id, slug, academy_id, title, description, level, duration, price, is_free, status`
- Pagination: `?page=1&limit=24` (default limit 100 for full list)

---

### `api/academies/index.php`
- GET (public):
  - If `?slug=`: return single academy + course count
  - Else: return all 6 academies

---

### `api/enrollments/index.php`
- GET (auth required): return current user's enrollments with course info + progress %
- POST (auth required):
  - Body: `{ courseSlug }`
  - Check if already enrolled — return existing if so
  - Check if course is free (is_free=1) or payment exists (status=PAID)
  - Insert enrollment record
  - Call rewards award for enrollment event (+50 pts)
  - Return enrollment record

---

### `api/progress/index.php`
- POST (auth required):
  - Body: `{ lessonSlug, completed: true/false }`
  - Upsert into `progress` table
  - Recalculate enrollment progress % (completed lessons / total lessons * 100)
  - If progress = 100%: mark enrollment complete + trigger certificate generation
  - Return: `{ progressId, lessonSlug, completed, enrollmentProgress }`

---

### `api/certificates/index.php`
- GET (auth required):
  - `?courseSlug=` → return single certificate for user+course
  - Else: return all user certificates

### `api/certificates/generate.php`
- POST (auth required):
  - Body: `{ courseSlug }`
  - Verify enrollment is 100% complete
  - Generate certificateId: `VOWLMS-{COURSESLUG_UPPER_10}-{YEAR}`
  - Insert into certificates table (idempotent — return existing if already issued)
  - Award +200 VowRewards points
  - Return: `{ learnerName, courseName, completionDate, certificateId }`

---

### `api/assessments/submit.php`
- POST (auth required):
  - Body: `{ assessmentSlug, answers: { questionId: answerId } }`
  - Look up assessment from DB
  - Score the answers against correct_answer in assessment_questions
  - Calculate score %
  - Insert into assessment_attempts
  - If passed: award +100 VowRewards points
  - Return: `{ attemptId, score, passed, passMark }`

---

### `api/vr/submit.php`
- POST (auth required):
  - Body: `{ practiceSlug, score, feedback? }`
  - Insert into vr_attempts
  - Award +75 VowRewards points if score ≥ 70
  - Return: `{ vrAttemptId, practiceSlug, score }`

---

### `api/rewards/award.php`
- POST (auth required + ADMIN or SYSTEM only):
  - Body: `{ event, points, metadata? }`
  - Insert into reward_events
  - Return: `{ rewardEventId, event, points, totalBalance }`

---

### `api/opportunities/index.php`
- GET (public):
  - Return all opportunities with `id, title, type, company, location, description, apply_url, course_slug`
  - Support `?type=` filter

---

### `api/learning-hubs/index.php`
- GET (public):
  - Return all learning hubs with `id, name, location, status, capacity, description`

---

### `api/dashboard/learner.php`
- GET (auth required):
  - Active enrollments (last 5) with progress
  - Recent certificates
  - Total reward points balance
  - Upcoming opportunities
  - Return structured dashboard object

---

### `api/dashboard/admin.php`
- GET (auth required, role=admin):
  - Total users, courses, enrollments, revenue
  - Recent signups (last 10)
  - Revenue by month (last 6 months)
  - Top 5 courses by enrollment count
  - Academy breakdown

---

### `api/dashboard/facilitator.php`
- GET (auth required, role=facilitator):
  - Assigned cohorts
  - Learner progress per cohort
  - Average assessment scores

---

### `api/dashboard/employer.php`
- GET (auth required, role=employer):
  - Posted opportunities
  - Applications received
  - Candidate skill match summary

---

### `api/payments/payfast-create.php`
- POST (auth required):
  - Body: `{ courseSlug, returnUrl, cancelUrl, notifyUrl }`
  - Look up course price
  - Build PayFast payment data array
  - Generate signature: MD5 hash of `key=value&...&passphrase=PASS` (sorted, URL-encoded)
  - Insert PENDING payment record
  - Return: `{ paymentId, payfastData, payfastUrl }`

PayFast hosted URL (sandbox): `https://sandbox.payfast.co.za/eng/process`
PayFast hosted URL (live): `https://www.payfast.co.za/eng/process`

PayFast fields to include:
```
merchant_id, merchant_key, return_url, cancel_url, notify_url,
name_first, name_last, email_address,
m_payment_id (our payment DB id),
amount (formatted as "150.00"),
item_name ("VowLMS: {course title}"),
subscription_type (leave blank for once-off)
```

---

### `api/payments/payfast-notify.php`
PayFast ITN webhook — called server-to-server by PayFast after payment.

- No bridge key check (PayFast doesn't know our key)
- Verify ITN:
  1. Build param string from POST data (exclude `signature`, alphabetical order)
  2. If PAYFAST_PASSPHRASE set: append `passphrase=URL_ENCODED_PASS`
  3. MD5 hash must match POSTed `signature`
  4. Verify `payment_status === 'COMPLETE'`
  5. Verify amount matches our DB record
- Update payment record: `status = 'PAID'`
- Update enrollment: activate if payment confirmed
- Award +25 VowRewards points for purchase
- Respond with HTTP 200 (PayFast requires this)

---

## SQL SCHEMA — `vowlms_schema.sql`

Generate a complete MySQL 8 schema with these tables:

```sql
-- charset: utf8mb4, collation: utf8mb4_unicode_ci
-- All tables have: created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,          -- CUID or UUID
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('learner','facilitator','employer','admin') DEFAULT 'learner',
  phone VARCHAR(50),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'ZA',
  bio TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE academies (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  audience TEXT,
  category VARCHAR(100) NOT NULL,
  hero_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  academy_id VARCHAR(36) NOT NULL,
  moodle_id INT,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  level ENUM('Foundation','Beginner','Intermediate','Advanced','Expert') DEFAULT 'Foundation',
  duration VARCHAR(100),
  price DECIMAL(10,2) DEFAULT 0.00,
  is_free TINYINT(1) DEFAULT 1,
  status ENUM('draft','published','archived') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (academy_id) REFERENCES academies(id) ON DELETE CASCADE,
  INDEX idx_academy (academy_id),
  INDEX idx_status (status),
  FULLTEXT INDEX idx_search (title, description)
);

CREATE TABLE modules (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  position SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  INDEX idx_course (course_id)
);

CREATE TABLE lessons (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  module_id VARCHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  type ENUM('text','video','assessment','vr_practice') DEFAULT 'text',
  duration_minutes SMALLINT DEFAULT 5,
  content MEDIUMTEXT,
  video_url VARCHAR(500),
  position SMALLINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
  INDEX idx_module (module_id)
);

CREATE TABLE enrollments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  status ENUM('active','completed','dropped') DEFAULT 'active',
  progress TINYINT DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, course_id),
  INDEX idx_user (user_id)
);

CREATE TABLE progress (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  lesson_id VARCHAR(36) NOT NULL,
  completed TINYINT(1) DEFAULT 0,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (user_id, lesson_id)
);

CREATE TABLE assessments (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  pass_mark TINYINT DEFAULT 60,
  questions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE assessment_attempts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  assessment_id VARCHAR(36) NOT NULL,
  score TINYINT NOT NULL,
  passed TINYINT(1) DEFAULT 0,
  answers JSON,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  INDEX idx_user_assessment (user_id, assessment_id)
);

CREATE TABLE vr_practices (
  id VARCHAR(36) PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  course_id VARCHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  scenario TEXT,
  score_placeholder INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE vr_attempts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  vr_practice_id VARCHAR(36) NOT NULL,
  score INT,
  feedback TEXT,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vr_practice_id) REFERENCES vr_practices(id) ON DELETE CASCADE
);

CREATE TABLE certificates (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  certificate_id VARCHAR(100) NOT NULL UNIQUE,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cert (user_id, course_id)
);

CREATE TABLE reward_events (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  event VARCHAR(100) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  course_id VARCHAR(36) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
  payfast_payment_id VARCHAR(100),
  payfast_ref VARCHAR(100),
  itn_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE opportunities (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type ENUM('employment','entrepreneurship','training','funding','mentorship') NOT NULL,
  company VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  course_slug VARCHAR(255),
  apply_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE learning_hubs (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('active','partner-ready','planned') DEFAULT 'planned',
  capacity INT DEFAULT 30,
  description TEXT,
  contact_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_token (token)
);
```

---

## SEED DATA FOR `vowlms_seed.sql` — Academies Only

```sql
SET NAMES utf8mb4;

INSERT IGNORE INTO academies (id, slug, name, description, audience, category, hero_message) VALUES
('aca-upskilling-academy-0000', 'upskilling-academy', 'Upskilling Academy', 'Short, practical pathways for employability, digital readiness, and everyday productivity.', 'Job seekers, workers, youth, and community learners', 'upskilling', 'Turn everyday ambition into visible progress and opportunity readiness.'),
('aca-skills-training-acad00', 'skills-training-academy', 'Skills Training Academy', 'Hands-on trade and service skills connected to local work, enterprise, and supplier pathways.', 'Practical skills learners and micro-enterprise builders', 'skills-training', 'Practice real skills, prove competency, and move toward income.'),
('aca-chef-academy-000000000', 'chef-academy', 'Chef Academy', 'Culinary foundations, kitchen operations, food safety, and ChefOrder-linked growth routes.', 'Aspiring chefs, food entrepreneurs, and hospitality teams', 'chef-academy', 'Build kitchen confidence from safety basics to menu-ready execution.'),
('aca-private-school-0000000', 'private-school', 'GoalVow Schools', 'Daycare, preschool, primary, and high school support built for accessible digital learning.', 'Families, school operators, tutors, and young learners', 'private-school', 'A modern school pathway for every stage of learner growth.'),
('aca-business-school-000000', 'business-school', 'GoalVow Business School', 'Business and entrepreneurship programmes for Africa''s next generation of leaders.', 'Entrepreneurs, managers, and professionals', 'business-school', 'Build the business skills that open doors across Africa.'),
('aca-university-online-0000', 'university-online', 'GoalVow University Online', 'Degree and diploma programmes in technology, business, and education delivered fully online.', 'Degree seekers, professionals, and career changers', 'university-online', 'Your degree. Your schedule. Your future.');
```

**For the full 614-course SQL:**  
Run this script from the VowLMS project root:
```bash
npx tsx scripts/export-to-sql.mjs
```
Output: `scripts/output/vowlms_seed.sql` — upload this to phpMyAdmin AFTER the schema.

---

## STEP-BY-STEP DEPLOYMENT GUIDE

### Step 1 — Create Afrihost MySQL Database
1. Login to Afrihost cPanel → **MySQL Databases**
2. Create database: `goalvow_lms`
3. Create user: `goalvow_lms_user` with a strong password
4. Add user to database with **ALL PRIVILEGES**
5. Note: host=`localhost`, port=`3306`

### Step 2 — Upload PHP Files to Afrihost
1. In cPanel → **File Manager**, navigate to `public_html/`
2. Create folder: `vowlms-api`
3. Upload the ZIP of all PHP files from the generated package
4. Extract into `vowlms-api/`
5. The final path should be: `public_html/vowlms-api/.htaccess`

### Step 3 — Set PHP Environment Variables
1. cPanel → **PHP Config** (or edit `.user.ini` in `vowlms-api/`)
2. Add each `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`, `BRIDGE_API_KEY`, `JWT_SECRET`, etc.

### Step 4 — Import SQL Schema
1. cPanel → **phpMyAdmin** → select `goalvow_lms`
2. Import tab → upload `vowlms_schema.sql` → Execute
3. Verify all tables created (18 tables expected)

### Step 5 — Import Seed Data (Courses)
1. Generate seed SQL: `npx tsx scripts/export-to-sql.mjs` (in VowLMS project)
2. phpMyAdmin → Import → upload `scripts/output/vowlms_seed.sql` → Execute
3. Verify: `SELECT COUNT(*) FROM courses;` should return `614`

### Step 6 — Create First Admin User
Run this in phpMyAdmin SQL tab (replace values):
```sql
INSERT INTO users (id, name, email, password_hash, role)
VALUES (
  UUID(),
  'Sydwell',
  'sydwell@goalvow.com',
  '$2y$10$REPLACE_WITH_BCRYPT_HASH',  -- generate at: bcrypt-generator.com
  'admin'
);
```
Or use the `/auth/register` endpoint then manually update role to `admin`.

### Step 7 — Set Vercel Environment Variables
In Vercel → Project → Settings → Environment Variables:
```
BRIDGE_BASE_URL       = https://goalvow.com/vowlms-api
BRIDGE_API_KEY        = (same as PHP BRIDGE_API_KEY)
JWT_SECRET            = (same as PHP JWT_SECRET)
NEXT_PUBLIC_APP_URL   = https://vowlms.vercel.app
PAYFAST_MERCHANT_ID   = (from PayFast dashboard)
PAYFAST_MERCHANT_KEY  = (from PayFast dashboard)
PAYFAST_PASSPHRASE    = (from PayFast dashboard)
PAYFAST_SANDBOX       = false
```

### Step 8 — Test the Bridge
```bash
curl https://goalvow.com/vowlms-api/health
# Expected: {"ok":true,"data":{"service":"VowLMS Bridge","status":"healthy",...}}

curl https://vowlms.vercel.app/api/health
# Expected: {"ok":true,"data":{"checks":{"bridge":"healthy"},...}}
```

### Step 9 — Configure PayFast
1. Login to PayFast merchant account
2. Settings → Integration:
   - ITN URL: `https://vowlms.vercel.app/api/payments/payfast/notify`
   - Return URL: `https://vowlms.vercel.app/dashboard/learner`
   - Cancel URL: `https://vowlms.vercel.app/pricing`
3. Enable production mode when ready

### Step 10 — Set Up Email Mailboxes
In Afrihost cPanel → Email Accounts, create:
- `support@goalvow.com`
- `noreply@goalvow.com`
- `privacy@goalvow.com`
- `careers@goalvow.com`
- `partnerships@goalvow.com`
- `labs@goalvow.com`

---

## VowRewards Points Reference

| Event | Points |
|-------|--------|
| Register account | +100 |
| First login | +10 |
| Enroll in course | +50 |
| Complete lesson | +5 |
| Pass assessment | +100 |
| Complete course | +200 |
| VR practice (score ≥70%) | +75 |
| Purchase paid course | +25 |

---

**End of prompt. Ask the AI to generate each PHP file in full and package them as a ZIP.**
