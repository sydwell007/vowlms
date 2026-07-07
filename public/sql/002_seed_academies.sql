-- =============================================================================
-- VowLMS — Seed: 6 GoalVow Academies
-- File: 002_seed_academies.sql
-- Run AFTER 001_schema.sql
-- =============================================================================

SET NAMES utf8mb4;

INSERT IGNORE INTO `academies` (`id`, `slug`, `name`, `description`, `audience`, `category`, `hero_message`) VALUES
(
  'aca-upskilling-000000000001',
  'upskilling-academy',
  'Upskilling Academy',
  'Short, practical pathways for employability, digital readiness, and everyday productivity.',
  'Job seekers, workers, youth, and community learners',
  'upskilling',
  'Turn everyday ambition into visible progress and opportunity readiness.'
),
(
  'aca-skills-training-0000002',
  'skills-training-academy',
  'Skills Training Academy',
  'Hands-on trade and service skills connected to local work, enterprise, and supplier pathways.',
  'Practical skills learners and micro-enterprise builders',
  'skills-training',
  'Practice real skills, prove competency, and move toward income.'
),
(
  'aca-chef-academy-000000003',
  'chef-academy',
  'Chef Academy',
  'Culinary foundations, kitchen operations, food safety, and ChefOrder-linked growth routes.',
  'Aspiring chefs, food entrepreneurs, and hospitality teams',
  'chef-academy',
  'Build kitchen confidence from safety basics to menu-ready execution.'
),
(
  'aca-private-school-0000004',
  'private-school',
  'GoalVow Schools',
  'Daycare, preschool, primary, and high school support built for accessible digital learning.',
  'Families, school operators, tutors, and young learners',
  'private-school',
  'A modern school pathway for every stage of learner growth.'
),
(
  'aca-business-school-000005',
  'business-school',
  'GoalVow Business School',
  'Business and entrepreneurship programmes for Africa''s next generation of leaders.',
  'Entrepreneurs, managers, and professionals',
  'business-school',
  'Build the business skills that open doors across Africa.'
),
(
  'aca-university-online-0006',
  'university-online',
  'GoalVow University Online',
  'Degree and diploma programmes in technology, business, and education delivered fully online.',
  'Degree seekers, professionals, and career changers',
  'university-online',
  'Your degree. Your schedule. Your future.'
);

-- Verify
SELECT COUNT(*) AS academy_count FROM academies;
-- Expected: 6
