-- VowLMS migration 039: repair SAVVA career-course enrolment pricing.
-- Idempotent. Safe to run after 038 on staging and production.
-- Courses remain in their current draft/published/archive state.

START TRANSACTION;

UPDATE courses
SET price = 999.00,
    is_free = 0
WHERE slug IN (
  'adobe-after-effects',
  'adobe-animate',
  'adobe-illustrator',
  'adobe-indesign',
  'adobe-photoshop',
  'adobe-premiere-pro',
  'space-travel-and-solar-system',
  'agriscience-1',
  'agriscience-2',
  'agriscience-3',
  'architectural-design-1',
  'architectural-design-2',
  'architectural-design-3',
  'augmented-and-virtual-reality',
  'drones-remote-pilot',
  'entrepreneurship-and-small-business',
  'startups-and-innovation',
  'early-childhood-education-1',
  'early-childhood-education-2',
  'education-and-teaching-advanced',
  'fundamentals-of-bitcoin-and-crypto',
  'fundamentals-of-blockchain-and-crypto',
  'introduction-to-ai',
  'robotics',
  'smart-cities',
  'teaching-as-a-profession',
  'transportation-technologies',
  'wearable-technology',
  'swift-app-development',
  'java-se-8-associate',
  'intuit-design-for-delight',
  'career-exploration',
  'digital-information-technology',
  'meta-social-media-marketing',
  'social-media-marketing',
  'building-maintenance-technology-1',
  'building-maintenance-technology-2'
);

COMMIT;

-- Expected: 37 rows, all at 999.00 and is_free=0. Status is intentionally
-- not changed; publishing remains controlled by the admin release gate.
SELECT COUNT(*) AS career_course_count,
       SUM(price = 999.00 AND is_free = 0) AS correctly_priced_count,
       MIN(price) AS minimum_price,
       MAX(price) AS maximum_price
FROM courses
WHERE slug IN (
  'adobe-after-effects','adobe-animate','adobe-illustrator','adobe-indesign','adobe-photoshop','adobe-premiere-pro',
  'space-travel-and-solar-system','agriscience-1','agriscience-2','agriscience-3',
  'architectural-design-1','architectural-design-2','architectural-design-3','augmented-and-virtual-reality',
  'drones-remote-pilot','entrepreneurship-and-small-business','startups-and-innovation',
  'early-childhood-education-1','early-childhood-education-2','education-and-teaching-advanced',
  'fundamentals-of-bitcoin-and-crypto','fundamentals-of-blockchain-and-crypto','introduction-to-ai','robotics','smart-cities',
  'teaching-as-a-profession','transportation-technologies','wearable-technology','swift-app-development','java-se-8-associate',
  'intuit-design-for-delight','career-exploration','digital-information-technology','meta-social-media-marketing',
  'social-media-marketing','building-maintenance-technology-1','building-maintenance-technology-2'
);
