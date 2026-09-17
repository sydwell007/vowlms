-- =============================================================================
-- VowLMS - Schema Patch 037
-- Launch pricing and paid-module mappings for seven Microsoft Office courses.
-- Module 1 remains free; a verified purchase unlocks every later real child
-- course. Run after 036_disable_lemonsqueezy_routing.sql. Re-running is safe.
-- =============================================================================

INSERT INTO `course_unlock_pricing`
  (`parent_slug`, `price_zar`, `founding_price_zar`, `founding_cutoff`)
VALUES
  ('microsoft-word-basics', 299.00, 299.00, 0),
  ('microsoft-word-advance', 299.00, 299.00, 0),
  ('microsoft-excel-basics', 299.00, 299.00, 0),
  ('microsoft-excel-advance', 299.00, 299.00, 0),
  ('microsoft-power-point', 299.00, 299.00, 0),
  ('microsoft-outlook', 299.00, 299.00, 0),
  ('microsoft-access', 299.00, 299.00, 0)
ON DUPLICATE KEY UPDATE
  `price_zar` = VALUES(`price_zar`),
  `founding_price_zar` = VALUES(`founding_price_zar`),
  `founding_cutoff` = VALUES(`founding_cutoff`);

INSERT IGNORE INTO `course_unlock_founding_counter` (`parent_slug`, `redeemed_count`)
SELECT `parent_slug`, 0
FROM `course_unlock_pricing`
WHERE `parent_slug` LIKE 'microsoft-%';

-- Microsoft Word 2019 Foundation
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-basics', id FROM courses WHERE slug = 'managing-word-edits-and-document-layouts';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-basics', id FROM courses WHERE slug = 'working-with-word-objects';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-basics', id FROM courses WHERE slug = 'inserting-and-managing-word-tables-and-lists';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-basics', id FROM courses WHERE slug = 'managing-word-references-and-finalizing-word-documents';

-- Microsoft Word 2019 Advanced
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-advance', id FROM courses WHERE slug = 'modifying-and-creating-document-style-and-templates';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-advance', id FROM courses WHERE slug = 'creating-reusable-content-and-custom-design-elements';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-advance', id FROM courses WHERE slug = 'creating-reference-tables-and-restricting-editing';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-advance', id FROM courses WHERE slug = 'managing-document-content';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-advance', id FROM courses WHERE slug = 'creating-and-managing-macros';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-word-advance', id FROM courses WHERE slug = 'managing-customer-lists-and-creating-mailings';

-- Microsoft Excel 2019 Associate
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'managing-worksheets-and-workbooks';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'formatting-cells';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'managing-tables-and-range-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'using-formulas-and-functions';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'getting-and-transforming-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'visualizing-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-basics', id FROM courses WHERE slug = 'preparing-to-print-and-checking-for-issues';

-- Microsoft Excel 2019 Expert
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-advance', id FROM courses WHERE slug = 'using-advanced-formulas';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-advance', id FROM courses WHERE slug = 'validating-and-auditing-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-advance', id FROM courses WHERE slug = 'analyzing-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-advance', id FROM courses WHERE slug = 'using-simple-macros';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-advance', id FROM courses WHERE slug = 'using-microsoft-pivottables-and-microsoft-pivotcharts';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-excel-advance', id FROM courses WHERE slug = 'collaborating-with-other-people';

-- Microsoft PowerPoint 2019
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-power-point', id FROM courses WHERE slug = 'managing-content-on-slides';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-power-point', id FROM courses WHERE slug = 'adding-visuals-to-presentations';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-power-point', id FROM courses WHERE slug = 'working-with-advanced-visuals';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-power-point', id FROM courses WHERE slug = 'organizing-and-printing-presentations';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-power-point', id FROM courses WHERE slug = 'configuring-slideshows';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-power-point', id FROM courses WHERE slug = 'managing-slide-masters-and-presentation-settings';

-- Microsoft Outlook 2019
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-outlook', id FROM courses WHERE slug = 'composing-and-managing-email';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-outlook', id FROM courses WHERE slug = 'organizing-email';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-outlook', id FROM courses WHERE slug = 'automating-messages';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-outlook', id FROM courses WHERE slug = 'managing-calendars';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-outlook', id FROM courses WHERE slug = 'creating-and-managing-contacts';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-outlook', id FROM courses WHERE slug = 'managing-tasks-and-notes';

-- Microsoft Access 2019
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'designing-and-setting-up-data-structure';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'adding-and-editing-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'asking-questions-of-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'understanding-reporting-basics';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'defining-database-relationships';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'asking-deeper-questions-of-data';
INSERT IGNORE INTO course_unlock_children (parent_slug, child_course_id) SELECT 'microsoft-access', id FROM courses WHERE slug = 'presenting-complex-data';

-- Verify every mapping resolved to a real migrated child course.
SELECT parent_slug, COUNT(*) AS paid_child_modules
FROM course_unlock_children
WHERE parent_slug LIKE 'microsoft-%'
GROUP BY parent_slug
ORDER BY parent_slug;

-- Patch 037 complete.
