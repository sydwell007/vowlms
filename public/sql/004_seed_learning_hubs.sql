-- =============================================================================
-- VowLMS — Seed: Learning Hubs + Announcements + Calendar Events
-- File: 004_seed_learning_hubs.sql
-- Run AFTER 001_schema.sql
-- =============================================================================

SET NAMES utf8mb4;

-- ── Learning Hubs ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO `learning_hubs` (`id`, `name`, `location`, `status`, `capacity`, `description`, `contact_email`) VALUES
(
  'hub-00000000000000000001',
  'Blue Downs Community Hub',
  'Blue Downs, Cape Town, Western Cape',
  'active',
  40,
  'Our flagship community hub offering broadband access, VR practice stations, live facilitator sessions, and offline sync for GoalVow learners. Open Monday to Saturday, 8am–6pm.',
  'bluedowns@goalvow.com'
),
(
  'hub-00000000000000000002',
  'Khayelitsha Digital Learning Centre',
  'Khayelitsha, Cape Town, Western Cape',
  'active',
  30,
  'A partnership hub co-located with the Khayelitsha Community Library. Provides free WiFi, device lending, and GoalVow facilitator drop-in sessions twice a week.',
  'khayelitsha@goalvow.com'
),
(
  'hub-00000000000000000003',
  'Mitchells Plain Skills Hub',
  'Mitchells Plain, Cape Town, Western Cape',
  'partner-ready',
  35,
  'Purpose-built skills hub equipped with VR stations for Chef Academy and solar installation practice. Partner organisations can co-host cohorts here.',
  'mitchellsplain@goalvow.com'
),
(
  'hub-00000000000000000004',
  'Johannesburg CBD Hub',
  'Johannesburg CBD, Gauteng',
  'planned',
  50,
  'Planned flagship hub in the Johannesburg CBD serving GoalVow learners across Gauteng. Will offer all academy streams, VR labs, and employer partnership sessions.',
  'jhb@goalvow.com'
),
(
  'hub-00000000000000000005',
  'Durban North Hub',
  'Durban North, KwaZulu-Natal',
  'planned',
  30,
  'Planned KZN hub co-located with a community centre. Will focus on GoalVow Upskilling, Chef Academy, and Business School streams.',
  'durban@goalvow.com'
);

-- ── Sample Announcements ──────────────────────────────────────────────────────
INSERT IGNORE INTO `announcements` (`id`, `title`, `body`, `category`, `target_role`, `is_pinned`, `published_at`) VALUES
(
  'ann-0000000000000000000001',
  'Welcome to VowLMS — Your Learning Journey Starts Now',
  'GoalVow Holdings welcomes you to VowLMS, our premier learning management system. Explore 614 courses across 6 academies, earn VowRewards points, generate certificates, and connect to real opportunities through PlugConnect. Your first lesson is waiting.',
  'general',
  'all',
  1,
  NOW()
),
(
  'ann-0000000000000000000002',
  'New Courses Added: Business School Semester 2 2026',
  '18 new Business School courses have been added for Semester 2 2026, including Advanced Financial Modelling, Pan-African Market Entry, and Impact Investing Fundamentals. Enrol now.',
  'course',
  'learner',
  0,
  NOW()
),
(
  'ann-0000000000000000000003',
  'VR Practice Stations Now Live at Blue Downs Hub',
  'The VR practice stations at our Blue Downs Community Hub are now operational. Chef Academy and Solar Installation learners can book 30-minute VR sessions from the Calendar page.',
  'event',
  'learner',
  0,
  NOW()
),
(
  'ann-0000000000000000000004',
  'PayFast Payments Now Active — Purchase Paid Courses',
  'Secure payments via PayFast are now live on VowLMS. You can purchase paid Academy Course and Learning Hub Cohort access using Visa, Mastercard, EFT, Mobicred, and MoreTyme.',
  'system',
  'all',
  0,
  NOW()
);

-- ── Sample Calendar Events ────────────────────────────────────────────────────
INSERT IGNORE INTO `calendar_events` (`id`, `title`, `description`, `type`, `start_at`, `end_at`, `join_url`) VALUES
(
  'cal-0000000000000000000001',
  'Live Session: Career Readiness Accelerator — Module 3',
  'Join our facilitator for a live Q&A and group coaching session on Module 3 of the Career Readiness Accelerator course. Zoom link provided after registration.',
  'live',
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  DATE_ADD(NOW(), INTERVAL 3 DAY),
  'https://zoom.us/j/goalvow-career-readiness'
),
(
  'cal-0000000000000000000002',
  'VR Kitchen Practice Session — Chef Academy',
  'Hands-on VR kitchen simulation for Chef Academy learners. Available at the Blue Downs and Mitchells Plain hubs. Limited to 10 learners per session.',
  'vr',
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  DATE_ADD(NOW(), INTERVAL 5 DAY),
  NULL
),
(
  'cal-0000000000000000000003',
  'Business School Webinar: Starting a Business in Africa',
  'Free webinar featuring GoalVow Business School faculty and two successful African entrepreneurs. Register on the GoalVow website to receive the link.',
  'webinar',
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  DATE_ADD(NOW(), INTERVAL 7 DAY),
  'https://vowlms.vercel.app/calendar'
),
(
  'cal-0000000000000000000004',
  'PlugConnect Employer Meet — Cape Town',
  'GoalVow learners can meet Cape Town employers at the Blue Downs Hub. Bring your certificate portfolio and updated PlugConnect profile. Free entry.',
  'workshop',
  DATE_ADD(NOW(), INTERVAL 14 DAY),
  DATE_ADD(NOW(), INTERVAL 14 DAY),
  NULL
);

SELECT COUNT(*) AS hub_count FROM learning_hubs;
-- Expected: 5
SELECT COUNT(*) AS announcement_count FROM announcements;
-- Expected: 4
