<?php
/**
 * Local Afrihost configuration template.
 *
 * Copy this file to config/env.local.php on the Afrihost host, fill in real
 * values there, and never commit or include that file in a Vercel deployment.
 */

$_ENV['DB_HOST'] = 'localhost';
$_ENV['DB_NAME'] = 'replace_with_database_name';
$_ENV['DB_USER'] = 'replace_with_database_user';
$_ENV['DB_PASS'] = 'replace_with_database_password';

$_ENV['BRIDGE_API_KEY'] = 'replace_with_a_long_random_bridge_key';
$_ENV['JWT_SECRET'] = 'replace_with_a_different_long_random_jwt_secret';
$_ENV['RESOURCE_SIGNING_SECRET'] = 'replace_with_a_third_long_random_secret';
$_ENV['UPSKILLING_MOODLE_TOKEN'] = 'replace_with_upskilling_token';
$_ENV['SKILLS_TRAINING_MOODLE_TOKEN'] = 'replace_with_skills_training_token';
$_ENV['CHEF_ACADEMY_MOODLE_TOKEN'] = 'replace_with_chef_academy_token';
$_ENV['GOALVOW_SCHOOLS_MOODLE_TOKEN'] = 'replace_with_schools_token';
$_ENV['BUSINESS_SCHOOL_MOODLE_TOKEN'] = 'replace_with_business_school_token';
$_ENV['GOALVOW_UNIVERSITY_MOODLE_TOKEN'] = 'replace_with_university_token';
$_ENV['MOODLE_TOKEN'] = '';

$_ENV['APP_URL'] = 'https://vowlms.vercel.app';
$_ENV['FRONTEND_ORIGIN'] = 'https://vowlms.vercel.app';
$_ENV['API_BASE_URL'] = 'https://api.goalvow.com';
$_ENV['APP_TIMEZONE'] = 'Africa/Johannesburg';

$_ENV['PAYFAST_MERCHANT_ID'] = '';
$_ENV['PAYFAST_MERCHANT_KEY'] = '';
$_ENV['PAYFAST_PASSPHRASE'] = '';
$_ENV['PAYFAST_SANDBOX'] = 'true';

$_ENV['SMTP_HOST'] = '';
$_ENV['SMTP_PORT'] = '587';
$_ENV['SMTP_USER'] = '';
$_ENV['SMTP_PASS'] = '';
$_ENV['SMTP_FROM'] = 'support@goalvow.com';
