-- =============================================================================
-- VowLMS — Seed: Opportunities
-- File: 003_seed_opportunities.sql
-- Run AFTER 001_schema.sql
-- =============================================================================

SET NAMES utf8mb4;

INSERT IGNORE INTO `opportunities` (`id`, `title`, `type`, `company`, `location`, `description`, `course_slug`, `apply_url`, `is_active`) VALUES
(
  'opp-0000000000000000000001',
  'Junior Solar Installer — Entry Level',
  'employment',
  'SunPower Solutions',
  'Cape Town, Western Cape',
  'We are hiring entry-level solar panel installers. Candidates with a GoalVow Solar Installation certificate will receive priority consideration. Full training provided for suitable candidates.',
  'solar-panel-installation-basics',
  'https://plugconnect.goalvow.com/jobs/solar-installer',
  1
),
(
  'opp-0000000000000000000002',
  'Food Entrepreneur Grant — Cape Flats',
  'funding',
  'GoalVow Foundation',
  'Cape Flats, Western Cape',
  'R15,000 grant available for graduates of the Chef Academy who want to start a small food business. Submit a simple business plan to apply.',
  'chef-academy',
  'https://plugconnect.goalvow.com/grants/food-entrepreneur',
  1
),
(
  'opp-0000000000000000000003',
  'Customer Service Representative',
  'employment',
  'CallCentreZA',
  'Remote (SA)',
  'Looking for candidates who have completed the GoalVow Customer Service Fundamentals course. Strong communication skills in English required. Immediate start.',
  'customer-service-fundamentals',
  'https://plugconnect.goalvow.com/jobs/customer-service-rep',
  1
),
(
  'opp-0000000000000000000004',
  'SMME Business Mentorship Programme',
  'mentorship',
  'GoalVow Business School',
  'Online (SA)',
  '12-week mentorship programme pairing Business School graduates with experienced entrepreneurs. Includes access to VowTools accounting software and SkillsShop services.',
  'business-school',
  'https://plugconnect.goalvow.com/mentorship/smme',
  1
),
(
  'opp-0000000000000000000005',
  'Digital Marketing Internship',
  'training',
  'Digital Cape',
  'Cape Town, Western Cape',
  'Paid 3-month internship for learners who have completed the GoalVow Digital Workplace Essentials course. R4,500/month stipend.',
  'digital-workplace-essentials',
  'https://plugconnect.goalvow.com/internships/digital-marketing',
  1
),
(
  'opp-0000000000000000000006',
  'Community Learning Hub Facilitator',
  'employment',
  'GoalVow Holdings',
  'Blue Downs, Western Cape',
  'Full-time position to run learner cohorts at the Blue Downs Learning Hub. Requires facilitator certification and GoalVow platform experience.',
  NULL,
  'https://vowlms.vercel.app/careers',
  1
),
(
  'opp-0000000000000000000007',
  'Plumbing Apprenticeship — City of Cape Town',
  'training',
  'City of Cape Town',
  'Cape Town',
  'City-sponsored apprenticeship open to Skills Training Academy graduates. 18-month programme leading to a nationally recognised trade qualification.',
  'skills-training-academy',
  'https://plugconnect.goalvow.com/apprenticeships/plumbing',
  1
),
(
  'opp-0000000000000000000008',
  'Youth Entrepreneurship Incubator',
  'entrepreneurship',
  'SEDA',
  'National (SA)',
  'Six-month incubator programme for youth entrepreneurs aged 18-35. Business School graduates receive automatic pre-qualification. Monthly stipend + office space.',
  'lean-startup-fundamentals',
  'https://plugconnect.goalvow.com/incubators/youth',
  1
),
(
  'opp-0000000000000000000009',
  'Primary School Teaching Assistant',
  'employment',
  'GoalVow Schools Network',
  'Blue Downs, Western Cape',
  'Part-time teaching assistant role at GoalVow partner schools. Suitable for Private School curriculum graduates seeking classroom experience.',
  'private-school',
  'https://plugconnect.goalvow.com/jobs/teaching-assistant',
  1
),
(
  'opp-0000000000000000000010',
  'Business Analysis Learnnership — NQF 5',
  'training',
  'CapaCiTi Digital Hub',
  'Cape Town',
  '12-month NQF Level 5 learnership in Business Analysis. University Online learners with data or technology credits receive preference.',
  'bsc-in-artificial-intelligence-amp-data-science',
  'https://plugconnect.goalvow.com/learnerships/business-analysis',
  1
);

SELECT COUNT(*) AS opportunity_count FROM opportunities;
-- Expected: 10
