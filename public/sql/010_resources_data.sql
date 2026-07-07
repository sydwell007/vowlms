-- =============================================================
-- VowLMS Lesson Resources — generated from Moodle live API
-- Generated: 2026-07-07T20:21:43.936Z
-- Upload AFTER 009_lesson_resources.sql (table must exist first)
-- =============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;


-- ── upskilling ────────────────────────────────────────────────────
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000001', l.id, 'upskilling', 'pdf', 'Employee Ethics Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2145/mod_resource/content/2/Employee%20Ethics%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13729513, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-employee-ethics-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000002', l.id, 'upskilling', 'pdf', 'Bussiness Ethics Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2143/mod_resource/content/2/Bussiness%20Ethics%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9605640, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-business-ethics-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000003', l.id, 'upskilling', 'pdf', 'Leadership on Ethics Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2144/mod_resource/content/2/Leadership%20on%20Ethics%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14218938, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-leadership-on-ethics-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000004', l.id, 'upskilling', 'pdf', 'Workplace HealthSafety Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2146/mod_resource/content/2/Workplace%20HealthSafety%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 27648619, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-workplace-health-amp-safety-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000005', l.id, 'upskilling', 'pdf', 'Workplace Violence Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2147/mod_resource/content/2/Workplace%20Violence%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23565334, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-workplace-violence-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000006', l.id, 'upskilling', 'pdf', 'Inclusive Communication Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2149/mod_resource/content/2/Inclusive%20Communication%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 49231152, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-inclusive-communication-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000007', l.id, 'upskilling', 'pdf', 'Culture Competence Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2150/mod_resource/content/2/Culture%20Competence%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23947638, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-culture-competence-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000008', l.id, 'upskilling', 'pdf', 'Inclusion and Respect Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2148/mod_resource/content/2/Inclusion%20and%20Respect%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13518459, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-inclusion-and-respect-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000009', l.id, 'upskilling', 'pdf', 'Stress Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2140/mod_resource/content/2/Stress%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23911573, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-stress-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000000a', l.id, 'upskilling', 'pdf', 'Stress and Work Performance Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2141/mod_resource/content/2/Stress%20and%20Work%20Performance%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 18240375, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-stress-and-work-performance-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000000b', l.id, 'upskilling', 'pdf', 'Strategies to Relieve Stress Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2142/mod_resource/content/2/Strategies%20to%20Relieve%20Stress%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 31833065, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-strategies-to-relieve-stress-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000000c', l.id, 'upskilling', 'pdf', 'Online Security Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2151/mod_resource/content/2/Online%20Security%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12525486, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-online-security-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000000d', l.id, 'upskilling', 'pdf', 'How to Protect your Data Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2152/mod_resource/content/2/How%20to%20Protect%20your%20Data%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13983876, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-how-to-protect-your-data-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000000e', l.id, 'upskilling', 'pdf', 'Social Engineering Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2153/mod_resource/content/2/Social%20Engineering%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10123861, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-social-engineering-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000000f', l.id, 'upskilling', 'pdf', 'Dealing with Emotions Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2139/mod_resource/content/2/Dealing%20with%20Emotions%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20773716, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-dealing-with-emotions-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000010', l.id, 'upskilling', 'pdf', 'Exercise Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2137/mod_resource/content/1/Exercise%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 31253182, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-exercise-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000011', l.id, 'upskilling', 'pdf', 'Forming Healthy Habits Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2135/mod_resource/content/2/Forming%20Healthy%20Habits%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30662639, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-forming-healthy-habits-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000012', l.id, 'upskilling', 'pdf', 'Mental Health Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2138/mod_resource/content/2/Mental%20Health%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 28613802, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-mental-health-awareness-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000013', l.id, 'upskilling', 'pdf', 'Positve Psych Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2134/mod_resource/content/2/Positve%20Psych%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30927714, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-positive-psychology-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000014', l.id, 'upskilling', 'pdf', 'Positve Psych Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2136/mod_resource/content/2/Positve%20Psych%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 21227238, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-positive-psychology-in-the-workplace-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000015', l.id, 'upskilling', 'pdf', 'Course Material for Diversity Iinclusion and Belonging.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1028/mod_resource/content/10/Course%20Material%20for%20Diversity%20Iinclusion%20and%20Belonging.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13776888, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-diversity-inclusion-and-belonging-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000016', l.id, 'upskilling', 'pdf', 'Fundamentals of HR Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1047/mod_resource/content/3/Fundamentals%20of%20HR%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 21665340, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-hr-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000017', l.id, 'upskilling', 'pdf', 'Interviewing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1057/mod_resource/content/3/Interviewing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 39969832, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-interviewing-module-reading-materials' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000018', l.id, 'upskilling', 'pdf', 'Retirement Planning Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1062/mod_resource/content/4/Retirement%20Planning%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30323071, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-retirement-planning-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000019', l.id, 'upskilling', 'pdf', 'Anti-Harassment and Discrimination Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1146/mod_resource/content/2/Anti-Harassment%20and%20Discrimination%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 49962998, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-anti-harassment-and-discrimination-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000001a', l.id, 'upskilling', 'pdf', 'Talent Management Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1154/mod_resource/content/3/Talent%20Management%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11643151, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-talent-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000001b', l.id, 'upskilling', 'pdf', 'Unconcious Bias Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1158/mod_resource/content/3/Unconcious%20Bias%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15851873, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-unconscious-bias-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000001c', l.id, 'upskilling', 'pdf', 'Workplace Wellbeing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1167/mod_resource/content/2/Workplace%20Wellbeing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 17000439, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-workplace-well-being-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000001d', l.id, 'upskilling', 'pdf', 'Brand Identity and Strategy Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1933/mod_resource/content/2/Brand%20Identity%20and%20Strategy%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 41957983, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-brand-identity-and-strategy-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000001e', l.id, 'upskilling', 'pdf', 'Content Marketing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1935/mod_resource/content/2/Content%20Marketing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 29130761, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-content-marketing-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000001f', l.id, 'upskilling', 'pdf', 'Customer and Maketing Research Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1937/mod_resource/content/2/Customer%20and%20Maketing%20Research%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 37212574, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-customer-and-marketing-research-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000020', l.id, 'upskilling', 'pdf', 'Email Marketing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1945/mod_resource/content/2/Email%20Marketing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26051601, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-9-email-marketing-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000021', l.id, 'upskilling', 'pdf', 'Marketing Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1926/mod_resource/content/2/Marketing%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 32231075, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-marketing-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000022', l.id, 'upskilling', 'pdf', 'Paid Advertising Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1949/mod_resource/content/2/Paid%20Advertising%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24390135, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-11-marketing-analytics-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000023', l.id, 'upskilling', 'pdf', 'Paid Advertising Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1947/mod_resource/content/2/Paid%20Advertising%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24390135, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-10-paid-advertising-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000024', l.id, 'upskilling', 'pdf', 'Product Marketing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1140/mod_resource/content/3/Product%20Marketing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30847830, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-product-marketing-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000025', l.id, 'upskilling', 'pdf', 'Search Engine Optimisation (SEO) Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1941/mod_resource/content/2/Search%20Engine%20Optimisation%20%28SEO%29%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 49630763, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-search-engine-optimization-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000026', l.id, 'upskilling', 'pdf', 'Social Media Marketing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1943/mod_resource/content/2/Social%20Media%20Marketing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 39909765, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-social-media-marketing-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000027', l.id, 'upskilling', 'pdf', 'Website Marketing Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1939/mod_resource/content/2/Website%20Marketing%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8963621, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-website-marketing-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000028', l.id, 'upskilling', 'pdf', 'Closing the Deal Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2070/mod_resource/content/2/Closing%20the%20Deal%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 6748502, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-closing-the-deal-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000029', l.id, 'upskilling', 'pdf', 'Sales Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2065/mod_resource/content/2/Sales%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15949773, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-sales-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000002a', l.id, 'upskilling', 'pdf', 'Handling Objections Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2071/mod_resource/content/2/Handling%20Objections%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 38210661, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-handling-objections-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000002b', l.id, 'upskilling', 'pdf', 'Sales Leadership and Management.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2066/mod_resource/content/2/Sales%20Leadership%20and%20Management.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26500106, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-sales-leadership-and-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000002c', l.id, 'upskilling', 'pdf', 'Presenting your Solution Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2068/mod_resource/content/2/Presenting%20your%20Solution%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 32884426, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-presenting-your-solution-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000002d', l.id, 'upskilling', 'pdf', 'Prospecting Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2072/mod_resource/content/2/Prospecting%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 22864178, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-prospecting-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000002e', l.id, 'upskilling', 'pdf', 'Sales Psychology Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2067/mod_resource/content/2/Sales%20Psychology%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14297826, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-sales-psychology-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000002f', l.id, 'upskilling', 'pdf', 'Building Customer Relationships Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2069/mod_resource/content/2/Building%20Customer%20Relationships%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12917363, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-building-relationships-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000030', l.id, 'upskilling', 'pdf', 'Change Management Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2080/mod_resource/content/2/Change%20Management%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7818529, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-project-change-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000031', l.id, 'upskilling', 'pdf', 'Communication in Project Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2075/mod_resource/content/2/Communication%20in%20Project%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10588623, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-project-communication-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000032', l.id, 'upskilling', 'pdf', 'Framework course material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2074/mod_resource/content/2/Framework%20course%20material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15504038, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-project-frameworks-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000033', l.id, 'upskilling', 'pdf', 'Project Management Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2073/mod_resource/content/2/Project%20Management%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24704191, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-project-management-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000034', l.id, 'upskilling', 'pdf', 'Project Improvement Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2079/mod_resource/content/2/Project%20Improvement%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12856421, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-project-improvement-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000035', l.id, 'upskilling', 'pdf', 'Project Scheduling Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2076/mod_resource/content/2/Project%20Scheduling%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 28991081, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-project-scheduling-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000036', l.id, 'upskilling', 'pdf', 'Reporting Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2078/mod_resource/content/2/Reporting%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9724818, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-project-reporting-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000037', l.id, 'upskilling', 'pdf', 'Scope Management Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2077/mod_resource/content/2/Scope%20Management%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11819295, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-project-scope-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000038', l.id, 'upskilling', 'pdf', 'Customer Communication Channels Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2062/mod_resource/content/2/Customer%20Communication%20Channels%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 37700707, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-customer-communication-channels-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000039', l.id, 'upskilling', 'pdf', 'Customer Communication Basics Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2061/mod_resource/content/2/Customer%20Communication%20Basics%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 16585778, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-customer-communication-basics-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000003a', l.id, 'upskilling', 'pdf', 'Cultural Sensitivity Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2063/mod_resource/content/2/Cultural%20Sensitivity%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 19497420, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-culture-sensitivity-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000003b', l.id, 'upskilling', 'pdf', 'Difficult Situation Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2064/mod_resource/content/2/Difficult%20Situation%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14064319, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-difficult-situations-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000003c', l.id, 'upskilling', 'pdf', 'Customer Service Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1956/mod_resource/content/2/Customer%20Service%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 6582955, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-customer-service-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000003d', l.id, 'upskilling', 'pdf', 'Customer Service Skills Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2060/mod_resource/content/2/Customer%20Service%20Skills%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26046716, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-customer-service-skills-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000003e', l.id, 'upskilling', 'pdf', 'Team Management for Custome Service.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1137/mod_resource/content/3/Team%20Management%20for%20Custome%20Service.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23257488, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-team-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000003f', l.id, 'upskilling', 'pdf', 'Assessing your Strength  Skills Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2101/mod_resource/content/2/Assessing%20your%20Strength%20%20Skills%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11945826, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-assessing-your-strengths-and-skills-module-reading-materials' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000040', l.id, 'upskilling', 'pdf', 'Driving your Career Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2100/mod_resource/content/2/Driving%20your%20Career%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26044661, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-driving-your-career-module-reading-materials' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000041', l.id, 'upskilling', 'pdf', 'Finding a New Job Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2102/mod_resource/content/2/Finding%20a%20New%20Job%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 17027333, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-finding-a-new-job-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000042', l.id, 'upskilling', 'pdf', 'Mentoring in the Workplace Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2105/mod_resource/content/2/Mentoring%20in%20the%20Workplace%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20087605, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-mentoring-in-the-workplace-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000043', l.id, 'upskilling', 'pdf', 'Networking Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2104/mod_resource/content/2/Networking%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11119028, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-networking-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000044', l.id, 'upskilling', 'pdf', 'New Professional Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2103/mod_resource/content/2/New%20Professional%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 29654315, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-new-professional-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000045', l.id, 'upskilling', 'pdf', 'Overcoming Challenges Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2108/mod_resource/content/2/Overcoming%20Challenges%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 35873105, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-9-overcoming-challenges-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000046', l.id, 'upskilling', 'pdf', 'Professional Etiquette Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2106/mod_resource/content/2/Professional%20Etiquette%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7847795, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-professional-etiquette-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000047', l.id, 'upskilling', 'pdf', 'Working Relationship Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2107/mod_resource/content/2/Working%20Relationship%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9833959, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-working-relationships-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000048', l.id, 'upskilling', 'pdf', 'Change Managmnt Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2109/mod_resource/content/2/Change%20Managmnt%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13928061, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-change-management-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000049', l.id, 'upskilling', 'pdf', 'Change Mangmnt Models Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2110/mod_resource/content/2/Change%20Mangmnt%20Models%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 21281079, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-change-management-models-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000004a', l.id, 'upskilling', 'pdf', 'Communicating Change Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2112/mod_resource/content/2/Communicating%20Change%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 54271603, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-communicating-change-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000004b', l.id, 'upskilling', 'pdf', 'Leading through Change Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2113/mod_resource/content/2/Leading%20through%20Change%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 27299554, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-leading-through-change-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000004c', l.id, 'upskilling', 'pdf', 'Managing Change in Crisis Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2114/mod_resource/content/2/Managing%20Change%20in%20Crisis%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 6219520, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-managing-change-in-time-of-crisis-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000004d', l.id, 'upskilling', 'pdf', 'Change Mangmnt Process Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2111/mod_resource/content/2/Change%20Mangmnt%20Process%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 16456587, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-the-change-management-process-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000004e', l.id, 'upskilling', 'pdf', 'Communicating in Difficult Situation Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2099/mod_resource/content/3/Communicating%20in%20Difficult%20Situation%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 52775285, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-communicating-in-difficult-situations-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000004f', l.id, 'upskilling', 'pdf', 'Empathy Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2093/mod_resource/content/2/Empathy%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 5053621, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-empathy-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000050', l.id, 'upskilling', 'pdf', 'Communication Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2092/mod_resource/content/2/Communication%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11231976, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-communication-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000051', l.id, 'upskilling', 'pdf', 'Meetings Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2095/mod_resource/content/2/Meetings%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15482083, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-meetings-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000052', l.id, 'upskilling', 'pdf', 'Negotiation and Persuasion Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2097/mod_resource/content/2/Negotiation%20and%20Persuasion%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7047324, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-negotiation-and-persuasion-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000053', l.id, 'upskilling', 'pdf', 'Presentation Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2096/mod_resource/content/2/Presentation%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10086774, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-presentations-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000054', l.id, 'upskilling', 'pdf', 'Verbal Communication Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2094/mod_resource/content/2/Verbal%20Communication%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8757078, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-verbal-communication-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000055', l.id, 'upskilling', 'pdf', 'Writing Well Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2098/mod_resource/content/2/Writing%20Well%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14319581, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-writing-well-module-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000056', l.id, 'upskilling', 'pdf', 'Crisis Management Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1917/mod_resource/content/2/Crisis%20Management%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7029924, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-crisis-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000057', l.id, 'upskilling', 'pdf', 'Emotional Intelligence Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1911/mod_resource/content/2/Emotional%20Intelligence%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 19737923, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-emotional-intelligence-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000058', l.id, 'upskilling', 'pdf', 'Leadership Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1199/mod_resource/content/2/Leadership%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 16748824, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-leadership-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000059', l.id, 'upskilling', 'pdf', 'Leadership Styles Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/1860/mod_resource/content/2/Leadership%20Styles%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13502790, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-leadership-styles-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000005a', l.id, 'upskilling', 'pdf', 'Building Career Resilience Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2082/mod_resource/content/2/Building%20Career%20Resilience%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 18577683, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-building-career-resilience-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000005b', l.id, 'upskilling', 'pdf', 'Emotional  Physical Resilience Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2084/mod_resource/content/2/Emotional%20%20Physical%20Resilience%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 17811473, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-emotional-and-physical-resilience-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000005c', l.id, 'upskilling', 'pdf', 'Leadership and Resilience Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2083/mod_resource/content/2/Leadership%20and%20Resilience%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10786945, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-leadership-and-resilience-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000005d', l.id, 'upskilling', 'pdf', 'Resilience Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2081/mod_resource/content/2/Resilience%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11240426, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-resilience-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000005e', l.id, 'upskilling', 'pdf', 'Thriving Through Challenges Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2085/mod_resource/content/2/Thriving%20Through%20Challenges%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12254077, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-thriving-through-challenges-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000005f', l.id, 'upskilling', 'pdf', 'Problem Solving Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2115/mod_resource/content/2/Problem%20Solving%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14829911, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-problem-solving-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000060', l.id, 'upskilling', 'pdf', 'Problem Solving Steps Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2118/mod_resource/content/2/Problem%20Solving%20Steps%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13879157, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-steps-to-problem-solving-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000061', l.id, 'upskilling', 'pdf', 'Problem Solving in the Workplace Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2117/mod_resource/content/2/Problem%20Solving%20in%20the%20Workplace%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13394007, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-problem-solving-in-the-workplace-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000062', l.id, 'upskilling', 'pdf', 'Advanced Problem Solving Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2119/mod_resource/content/2/Advanced%20Problem%20Solving%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12067845, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-advanced-problem-solving-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000063', l.id, 'upskilling', 'pdf', 'Time Management Concentration Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2090/mod_resource/content/2/Time%20Management%20Concentration%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13850554, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-concentration-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000064', l.id, 'upskilling', 'pdf', 'Time Management Fundamentals Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2086/mod_resource/content/2/Time%20Management%20Fundamentals%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7012788, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-time-management-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000065', l.id, 'upskilling', 'pdf', 'Time Management Prioritization Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2089/mod_resource/content/2/Time%20Management%20Prioritization%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9778315, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-prioritization-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000066', l.id, 'upskilling', 'pdf', 'Time Management Scheduling Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2088/mod_resource/content/2/Time%20Management%20Scheduling%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 4348814, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-scheduling-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000067', l.id, 'upskilling', 'pdf', 'Overcoming Challenges Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2091/mod_resource/content/2/Overcoming%20Challenges%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 18577434, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-overcoming-time-challenges-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000068', l.id, 'upskilling', 'pdf', 'Goal Setting Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2087/mod_resource/content/2/Goal%20Setting%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9192509, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-goal-setting-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000069', l.id, 'upskilling', 'pdf', 'Delegating Task Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2127/mod_resource/content/2/Delegating%20Task%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8387042, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-5-delegating-tasks-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000006a', l.id, 'upskilling', 'pdf', 'Developing your Team Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2125/mod_resource/content/2/Developing%20your%20Team%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24310638, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-developing-your-team-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000006b', l.id, 'upskilling', 'pdf', 'Team Management Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2123/mod_resource/content/2/Team%20Management%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15164535, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-team-management-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000006c', l.id, 'upskilling', 'pdf', 'Letting an Employee Go Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2133/mod_resource/content/2/Letting%20an%20Employee%20Go%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23520722, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-11-letting-an-employee-go-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000006d', l.id, 'upskilling', 'pdf', 'Managing Remote Teams Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2129/mod_resource/content/2/Managing%20Remote%20Teams%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 22833359, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-7-managing-remote-teams-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000006e', l.id, 'upskilling', 'pdf', 'Motivating your Team Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2128/mod_resource/content/2/Motivating%20your%20Team%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24836995, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-6-motivating-your-team-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000006f', l.id, 'upskilling', 'pdf', 'New Manager Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2124/mod_resource/content/2/New%20Manager%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20507148, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-new-manager-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000070', l.id, 'upskilling', 'pdf', 'Performance Management Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2131/mod_resource/content/2/Performance%20Management%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 29740576, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-9-performance-management-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000071', l.id, 'upskilling', 'pdf', 'Resolving Conflict Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2132/mod_resource/content/2/Resolving%20Conflict%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 27915430, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-10-resolving-conflict-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000072', l.id, 'upskilling', 'pdf', 'Team Culture Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2126/mod_resource/content/2/Team%20Culture%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30368707, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-4-team-culture-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000073', l.id, 'upskilling', 'pdf', 'Team Dynamics Couse Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2130/mod_resource/content/2/Team%20Dynamics%20Couse%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 33517588, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-8-team-dynamics-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000074', l.id, 'upskilling', 'pdf', 'Critical Thinking  Info Lit Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2122/mod_resource/content/2/Critical%20Thinking%20%20Info%20Lit%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 5635544, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-3-critical-thinking-and-information-literacy-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000075', l.id, 'upskilling', 'pdf', 'Critical Thinking Fund Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2120/mod_resource/content/2/Critical%20Thinking%20Fund%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13007168, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-1-critical-thinking-fundamentals-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000076', l.id, 'upskilling', 'pdf', 'Workplace Critical Thinking Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/2121/mod_resource/content/2/Workplace%20Critical%20Thinking%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8251778, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'module-2-thinking-in-the-workplace-module-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000077', l.id, 'upskilling', 'pdf', 'Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3194/mod_resource/content/3/Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 4688270, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'managing-word-documents-and-options-module-reading-materials' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000078', l.id, 'upskilling', 'pdf', 'Driving your Career Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3338/mod_resource/content/3/Driving%20your%20Career%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 458908, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-1-driving-your-career-to-success' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000079', l.id, 'upskilling', 'pdf', 'Driving your Career Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3340/mod_resource/content/1/Driving%20your%20Career%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26044661, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-1-driving-your-career-to-success' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000007a', l.id, 'upskilling', 'pdf', 'Module 1 Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3341/mod_resource/content/1/Module%201%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 323104, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-1-driving-your-career-to-success' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000007b', l.id, 'upskilling', 'pdf', 'Assessing your Strength  Skills Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3345/mod_resource/content/1/Assessing%20your%20Strength%20%20Skills%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 483657, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-2-assessing-your-strengths-and-skills' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000007c', l.id, 'upskilling', 'pdf', 'Assessing your Strength  Skills Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3349/mod_resource/content/1/Assessing%20your%20Strength%20%20Skills%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11945826, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-2-assessing-your-strengths-and-skills' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000007d', l.id, 'upskilling', 'pdf', 'Assessing your Strength  Skills Module 2 Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3356/mod_resource/content/1/Assessing%20your%20Strength%20%20Skills%20Module%202%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 221471, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-2-assessing-your-strengths-and-skills' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000007e', l.id, 'upskilling', 'pdf', 'Finding a New Job Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3360/mod_resource/content/1/Finding%20a%20New%20Job%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 470885, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-3-finding-a-new-job' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000007f', l.id, 'upskilling', 'pdf', 'Finding a New Job Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3362/mod_resource/content/1/Finding%20a%20New%20Job%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 17027333, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-3-finding-a-new-job' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000080', l.id, 'upskilling', 'pdf', 'Finding a New Job.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3372/mod_resource/content/1/Finding%20a%20New%20Job.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 453144, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-3-finding-a-new-job' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000081', l.id, 'upskilling', 'pdf', 'New Professional Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3373/mod_resource/content/1/New%20Professional%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 641446, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-4-new-professional' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000082', l.id, 'upskilling', 'pdf', 'New Professional Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3375/mod_resource/content/1/New%20Professional%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 29654315, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-4-new-professional' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000083', l.id, 'upskilling', 'pdf', 'New Professional.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3387/mod_resource/content/1/New%20Professional.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 454296, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-4-new-professional' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000084', l.id, 'upskilling', 'pdf', 'Networking.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3388/mod_resource/content/1/Networking.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 670673, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-5-networking' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000085', l.id, 'upskilling', 'pdf', 'Networking Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3390/mod_resource/content/1/Networking%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11119028, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-5-networking' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000086', l.id, 'upskilling', 'pdf', 'Networking Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3398/mod_resource/content/1/Networking%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 150499, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-5-networking' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000087', l.id, 'upskilling', 'pdf', 'Mentoring in the Workplace Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3399/mod_resource/content/1/Mentoring%20in%20the%20Workplace%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20087605, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-6-mentoring-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000088', l.id, 'upskilling', 'pdf', 'Mentoring in the Workplace Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3401/mod_resource/content/1/Mentoring%20in%20the%20Workplace%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20087605, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-6-mentoring-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000089', l.id, 'upskilling', 'pdf', 'Mentoring in the Workplace.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3408/mod_resource/content/1/Mentoring%20in%20the%20Workplace.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 183792, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-6-mentoring-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000008a', l.id, 'upskilling', 'pdf', 'Professional Etiquette Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3409/mod_resource/content/1/Professional%20Etiquette%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 657968, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-7-professional-etiquette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000008b', l.id, 'upskilling', 'pdf', 'Professional Etiquette Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3411/mod_resource/content/1/Professional%20Etiquette%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7847795, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-7-professional-etiquette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000008c', l.id, 'upskilling', 'pdf', 'Professional Etiquette.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3416/mod_resource/content/1/Professional%20Etiquette.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 102982, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-7-professional-etiquette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000008d', l.id, 'upskilling', 'pdf', 'Working Relationship Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3419/mod_resource/content/1/Working%20Relationship%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 521527, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-8-working-relationships' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000008e', l.id, 'upskilling', 'pdf', 'Working Relationship Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3421/mod_resource/content/1/Working%20Relationship%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9833959, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-8-working-relationships' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000008f', l.id, 'upskilling', 'pdf', 'Working Relationship.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3426/mod_resource/content/1/Working%20Relationship.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 315486, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-8-working-relationships' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000090', l.id, 'upskilling', 'pdf', 'Overcoming Challenges Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3429/mod_resource/content/1/Overcoming%20Challenges%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 337943, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-9-overcoming-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000091', l.id, 'upskilling', 'pdf', 'Overcoming Challenges Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3431/mod_resource/content/1/Overcoming%20Challenges%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 35873105, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-9-overcoming-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000092', l.id, 'upskilling', 'pdf', 'Overcoming Challenges.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3440/mod_resource/content/1/Overcoming%20Challenges.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 285380, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'career-management-strategies-module-9-overcoming-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000093', l.id, 'upskilling', 'pdf', 'HR Fundamentals Courses Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3481/mod_resource/content/1/HR%20Fundamentals%20Courses%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2143840, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-1-hr-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000094', l.id, 'upskilling', 'pdf', 'Fundamentals of HR Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3483/mod_resource/content/1/Fundamentals%20of%20HR%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 21665340, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-1-hr-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000095', l.id, 'upskilling', 'pdf', 'Human Resource Fundamentals Module Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3494/mod_resource/content/1/Human%20Resource%20Fundamentals%20Module%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 240526, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-1-hr-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000096', l.id, 'upskilling', 'pdf', 'Diversity Iinclusion and Belonging Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3495/mod_resource/content/1/Diversity%20Iinclusion%20and%20Belonging%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1797202, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-2-diversity-inclusion-and-belonging' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000097', l.id, 'upskilling', 'pdf', 'Course Material for Diversity Iinclusion and Belonging.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3497/mod_resource/content/1/Course%20Material%20for%20Diversity%20Iinclusion%20and%20Belonging.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13776888, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-2-diversity-inclusion-and-belonging' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000098', l.id, 'upskilling', 'pdf', 'Diversity, Inclusion and Belonging.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3504/mod_resource/content/1/Diversity%2C%20Inclusion%20and%20Belonging.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 231019, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-2-diversity-inclusion-and-belonging' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000099', l.id, 'upskilling', 'pdf', 'Interviewing Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3509/mod_resource/content/1/Interviewing%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1560381, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-3-interviewing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000009a', l.id, 'upskilling', 'pdf', 'Interviewing Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3511/mod_resource/content/1/Interviewing%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 39969832, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-3-interviewing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000009b', l.id, 'upskilling', 'pdf', 'Interviewing.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3521/mod_resource/content/1/Interviewing.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 282152, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-3-interviewing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000009c', l.id, 'upskilling', 'pdf', 'Unconscious Bias Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3523/mod_resource/content/1/Unconscious%20Bias%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1826637, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-4-unconscious-bias' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000009d', l.id, 'upskilling', 'pdf', 'Unconscious Bias Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3525/mod_resource/content/1/Unconscious%20Bias%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15851873, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-4-unconscious-bias' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000009e', l.id, 'upskilling', 'pdf', 'Module 4 summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3577/mod_resource/content/1/Module%204%20summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 99519, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-4-unconscious-bias' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000009f', l.id, 'upskilling', 'pdf', 'Talent Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3530/mod_resource/content/1/Talent%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1285880, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-5-talent-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a0', l.id, 'upskilling', 'pdf', 'Talent Management Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3532/mod_resource/content/1/Talent%20Management%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11643151, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-5-talent-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a1', l.id, 'upskilling', 'pdf', 'Module 5 Talent Management SUMMARY.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3578/mod_resource/content/1/Module%205%20Talent%20Management%20SUMMARY.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 171323, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-5-talent-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a2', l.id, 'upskilling', 'pdf', 'Workplace Wellbeing Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3538/mod_resource/content/1/Workplace%20Wellbeing%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2383815, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-6-workplace-well-being' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a3', l.id, 'upskilling', 'pdf', 'Workplace Wellbeing Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3540/mod_resource/content/1/Workplace%20Wellbeing%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 17000439, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-6-workplace-well-being' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a4', l.id, 'upskilling', 'pdf', 'Module 5 Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3579/mod_resource/content/1/Module%205%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 183380, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-6-workplace-well-being' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a5', l.id, 'upskilling', 'pdf', 'Anti-Harassment and Discrimination Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3547/mod_resource/content/1/Anti-Harassment%20and%20Discrimination%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1456460, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-7-anti-harassment-and-discrimination' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a6', l.id, 'upskilling', 'pdf', 'Anti-Harassment and Discrimination Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3549/mod_resource/content/1/Anti-Harassment%20and%20Discrimination%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 49962998, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-7-anti-harassment-and-discrimination' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a7', l.id, 'upskilling', 'pdf', 'MODULE 7 Anti-Harassment and Discrimination Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3580/mod_resource/content/1/MODULE%207%20Anti-Harassment%20and%20Discrimination%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 418888, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-7-anti-harassment-and-discrimination' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a8', l.id, 'upskilling', 'pdf', 'Retirement Planning Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3559/mod_resource/content/1/Retirement%20Planning%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 450651, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-8-retirement-planning' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000a9', l.id, 'upskilling', 'pdf', 'Retirement Planning Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3561/mod_resource/content/1/Retirement%20Planning%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30323071, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-8-retirement-planning' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000aa', l.id, 'upskilling', 'pdf', 'Module 8 Retirement Planning Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3581/mod_resource/content/2/Module%208%20Retirement%20Planning%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 144895, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'human-resource-essentials-module-8-retirement-planning' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ab', l.id, 'upskilling', 'pdf', 'Sales Fundamentals Module  Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3782/mod_resource/content/1/Sales%20Fundamentals%20Module%20%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2081616, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-1-sales-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ac', l.id, 'upskilling', 'pdf', 'Sales Fundamentals Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3798/mod_resource/content/1/Sales%20Fundamentals%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15949773, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-1-sales-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ad', l.id, 'upskilling', 'pdf', 'Sales Leadership and Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3783/mod_resource/content/1/Sales%20Leadership%20and%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1491361, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-2-sales-leadership-and-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ae', l.id, 'upskilling', 'pdf', 'Sales Leadership and Management Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3799/mod_resource/content/1/Sales%20Leadership%20and%20Management%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26500106, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-2-sales-leadership-and-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000af', l.id, 'upskilling', 'pdf', 'Sales Psychology Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3784/mod_resource/content/1/Sales%20Psychology%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2281456, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-3-sales-psychology' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b0', l.id, 'upskilling', 'pdf', 'Sales Psychology Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3800/mod_resource/content/1/Sales%20Psychology%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14297826, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-3-sales-psychology' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b1', l.id, 'upskilling', 'pdf', 'Presenting your Solution Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3785/mod_resource/content/1/Presenting%20your%20Solution%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1764897, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-4-presenting-your-solution' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b2', l.id, 'upskilling', 'pdf', 'Presenting your Solution Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3801/mod_resource/content/1/Presenting%20your%20Solution%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 32884426, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-4-presenting-your-solution' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b3', l.id, 'upskilling', 'pdf', 'Building Customer Relationships Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3786/mod_resource/content/1/Building%20Customer%20Relationships%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1822584, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-5-building-relationships' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b4', l.id, 'upskilling', 'pdf', 'Building Customer Relationships Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3802/mod_resource/content/1/Building%20Customer%20Relationships%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12917363, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-5-building-relationships' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b5', l.id, 'upskilling', 'pdf', 'Closing the Deal Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3787/mod_resource/content/1/Closing%20the%20Deal%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2460553, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-6-closing-the-deal' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b6', l.id, 'upskilling', 'pdf', 'Closing the Deal Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3803/mod_resource/content/1/Closing%20the%20Deal%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 6748502, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-6-closing-the-deal' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b7', l.id, 'upskilling', 'pdf', 'Handling Objections Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3788/mod_resource/content/1/Handling%20Objections%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1171354, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-7-handling-objections' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b8', l.id, 'upskilling', 'pdf', 'Handling Objections Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3804/mod_resource/content/1/Handling%20Objections%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 38210661, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-7-handling-objections' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000b9', l.id, 'upskilling', 'pdf', 'Prospecting Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3789/mod_resource/content/1/Prospecting%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1680872, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'sales-techniques-module-8-prospecting' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ba', l.id, 'upskilling', 'pdf', 'Prospecting Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3805/mod_resource/content/1/Prospecting%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 22864178, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'sales-techniques-module-8-prospecting' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000bb', l.id, 'upskilling', 'pdf', 'Customer Service Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3977/mod_resource/content/1/Customer%20Service%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 288463, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-1-customer-service-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000bc', l.id, 'upskilling', 'pdf', 'Customer Service Fundamentals Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3985/mod_resource/content/1/Customer%20Service%20Fundamentals%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 6582955, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-1-customer-service-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000bd', l.id, 'upskilling', 'pdf', 'Customer Service Skills Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3978/mod_resource/content/1/Customer%20Service%20Skills%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1802788, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-2-customer-service-skills' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000be', l.id, 'upskilling', 'pdf', 'Customer Service Skills Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3987/mod_resource/content/1/Customer%20Service%20Skills%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26046716, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-2-customer-service-skills' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000bf', l.id, 'upskilling', 'pdf', 'Customer Communication Basics Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3979/mod_resource/content/1/Customer%20Communication%20Basics%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1707756, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-3-customer-communication-basics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c0', l.id, 'upskilling', 'pdf', 'Customer Communication Basics Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3989/mod_resource/content/1/Customer%20Communication%20Basics%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 16585778, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-3-customer-communication-basics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c1', l.id, 'upskilling', 'pdf', 'Customer Communication Channels Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3981/mod_resource/content/2/Customer%20Communication%20Channels%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 960457, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-4-customer-communication-channels' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c2', l.id, 'upskilling', 'pdf', 'Customer Communication Channels Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3991/mod_resource/content/1/Customer%20Communication%20Channels%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 37700707, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-4-customer-communication-channels' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c3', l.id, 'upskilling', 'pdf', 'Team Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3980/mod_resource/content/1/Team%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1809899, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-5-team-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c4', l.id, 'upskilling', 'pdf', 'Team Management Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3993/mod_resource/content/1/Team%20Management%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23257488, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-5-team-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c5', l.id, 'upskilling', 'pdf', 'Cultural Sensitivity Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3982/mod_resource/content/2/Cultural%20Sensitivity%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 918235, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-6-culture-sensitivity' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c6', l.id, 'upskilling', 'pdf', 'Cultural Sensitivity Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3995/mod_resource/content/1/Cultural%20Sensitivity%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 19497420, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-6-culture-sensitivity' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c7', l.id, 'upskilling', 'pdf', 'Difficult Situation Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3983/mod_resource/content/1/Difficult%20Situation%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 414665, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-7-difficult-situations' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c8', l.id, 'upskilling', 'pdf', 'Difficult Situation Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3997/mod_resource/content/1/Difficult%20Situation%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14064319, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'customer-service-excellence-module-7-difficult-situations' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000c9', l.id, 'upskilling', 'pdf', 'Project Management Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4077/mod_resource/content/1/Project%20Management%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1837347, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-1-project-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ca', l.id, 'upskilling', 'pdf', 'Project Management Fundamentals Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4086/mod_resource/content/1/Project%20Management%20Fundamentals%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24704191, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-1-project-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000cb', l.id, 'upskilling', 'pdf', 'Project Management Framework Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4078/mod_resource/content/1/Project%20Management%20Framework%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1854685, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-2-project-frameworks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000cc', l.id, 'upskilling', 'pdf', 'Framework Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4089/mod_resource/content/1/Framework%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15504038, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-2-project-frameworks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000cd', l.id, 'upskilling', 'pdf', 'Project Communication.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4081/mod_resource/content/1/Project%20Communication.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2066122, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-3-project-communication' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ce', l.id, 'upskilling', 'pdf', 'Communication in Project Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4091/mod_resource/content/1/Communication%20in%20Project%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10588623, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-3-project-communication' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000cf', l.id, 'upskilling', 'pdf', 'Project Scheduling Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4079/mod_resource/content/1/Project%20Scheduling%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1661453, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-4-project-scheduling' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d0', l.id, 'upskilling', 'pdf', 'Project Scheduling Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4093/mod_resource/content/1/Project%20Scheduling%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 28991081, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-4-project-scheduling' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d1', l.id, 'upskilling', 'pdf', 'Project Scope Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4080/mod_resource/content/1/Project%20Scope%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 757297, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-5-project-scope-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d2', l.id, 'upskilling', 'pdf', 'Scope Management Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4095/mod_resource/content/1/Scope%20Management%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11819295, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-5-project-scope-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d3', l.id, 'upskilling', 'pdf', 'Project Reporting Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4082/mod_resource/content/1/Project%20Reporting%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 561125, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-6-project-reporting' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d4', l.id, 'upskilling', 'pdf', 'Project Reporting Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4097/mod_resource/content/1/Project%20Reporting%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9724818, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-6-project-reporting' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d5', l.id, 'upskilling', 'pdf', 'Project Improvement Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4083/mod_resource/content/1/Project%20Improvement%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1707672, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-7-project-improvement' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d6', l.id, 'upskilling', 'pdf', 'Project Improvement Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4099/mod_resource/content/1/Project%20Improvement%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12856421, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-7-project-improvement' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d7', l.id, 'upskilling', 'pdf', 'Project Change Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4084/mod_resource/content/1/Project%20Change%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1837019, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'project-management-basics-module-8-project-change-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d8', l.id, 'upskilling', 'pdf', 'Change Management Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4101/mod_resource/content/1/Change%20Management%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7818529, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'project-management-basics-module-8-project-change-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000d9', l.id, 'upskilling', 'pdf', 'Online Security Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4448/mod_resource/content/1/Online%20Security%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 501568, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'cybersecurity-basics-module-1-online-security-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000da', l.id, 'upskilling', 'pdf', 'Online Security Fund Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4452/mod_resource/content/1/Online%20Security%20Fund%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12525486, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'cybersecurity-basics-module-1-online-security-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000db', l.id, 'upskilling', 'pdf', 'How to Protect your Data Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4449/mod_resource/content/1/How%20to%20Protect%20your%20Data%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 500380, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'cybersecurity-basics-module-2-how-to-protect-your-data' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000dc', l.id, 'upskilling', 'pdf', 'How to Protect your Data Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4454/mod_resource/content/1/How%20to%20Protect%20your%20Data%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13983876, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'cybersecurity-basics-module-2-how-to-protect-your-data' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000dd', l.id, 'upskilling', 'pdf', 'Social Engineering Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4450/mod_resource/content/1/Social%20Engineering%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 702162, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'cybersecurity-basics-module-3-social-engineering' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000de', l.id, 'upskilling', 'pdf', 'Social Engineering Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4456/mod_resource/content/1/Social%20Engineering%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10123861, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'cybersecurity-basics-module-3-social-engineering' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000df', l.id, 'upskilling', 'pdf', 'Communication Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4168/mod_resource/content/1/Communication%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 289113, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-1-communication-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e0', l.id, 'upskilling', 'pdf', 'Communication Fundamentals Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4177/mod_resource/content/1/Communication%20Fundamentals%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11231976, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-1-communication-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e1', l.id, 'upskilling', 'pdf', 'Empathy Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4169/mod_resource/content/1/Empathy%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 355824, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-2-empathy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e2', l.id, 'upskilling', 'pdf', 'Empathy Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4179/mod_resource/content/1/Empathy%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 5053621, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-2-empathy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e3', l.id, 'upskilling', 'pdf', 'Verbal Communication Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4170/mod_resource/content/1/Verbal%20Communication%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 663996, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-3-verbal-communication' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e4', l.id, 'upskilling', 'pdf', 'Verbal Communication Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4181/mod_resource/content/1/Verbal%20Communication%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8757078, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-3-verbal-communication' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e5', l.id, 'upskilling', 'pdf', 'Meetings Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4171/mod_resource/content/1/Meetings%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 558990, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-4-meetings' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e6', l.id, 'upskilling', 'pdf', 'Meetings Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4183/mod_resource/content/1/Meetings%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15482083, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-4-meetings' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e7', l.id, 'upskilling', 'pdf', 'Presentation Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4172/mod_resource/content/1/Presentation%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 445161, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-5-presentations' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e8', l.id, 'upskilling', 'pdf', 'Presentation Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4185/mod_resource/content/1/Presentation%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10086774, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-5-presentations' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000e9', l.id, 'upskilling', 'pdf', 'Negotiation and Persuasion Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4173/mod_resource/content/1/Negotiation%20and%20Persuasion%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 514546, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-6-negotiation-and-persuasion' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ea', l.id, 'upskilling', 'pdf', 'Writing Well Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4174/mod_resource/content/1/Writing%20Well%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 556373, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-7-writing-well' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000eb', l.id, 'upskilling', 'pdf', 'Writing Well Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4188/mod_resource/content/1/Writing%20Well%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14319581, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-7-writing-well' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ec', l.id, 'upskilling', 'pdf', 'Communicating in Difficult Situation Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4175/mod_resource/content/1/Communicating%20in%20Difficult%20Situation%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2381498, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-8-communicating-in-difficult-situations' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ed', l.id, 'upskilling', 'pdf', 'Communicating in Difficult Situation Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4190/mod_resource/content/1/Communicating%20in%20Difficult%20Situation%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 52775285, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'effective-communication-skills-module-8-communicating-in-difficult-situations' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ee', l.id, 'upskilling', 'pdf', 'Resilience Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4399/mod_resource/content/1/Resilience%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 461055, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-1-resilience-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ef', l.id, 'upskilling', 'pdf', 'Resilience Fundamentals Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4405/mod_resource/content/1/Resilience%20Fundamentals%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 11240426, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-1-resilience-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f0', l.id, 'upskilling', 'pdf', 'Building Career Resilience Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4400/mod_resource/content/1/Building%20Career%20Resilience%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1442124, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-2-building-career-resilience' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f1', l.id, 'upskilling', 'pdf', 'Building Career Resilience Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4407/mod_resource/content/1/Building%20Career%20Resilience%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 18577683, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-2-building-career-resilience' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f2', l.id, 'upskilling', 'pdf', 'Leadership and Resilience Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4401/mod_resource/content/1/Leadership%20and%20Resilience%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1900682, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-3-leadership-and-resilience' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f3', l.id, 'upskilling', 'pdf', 'Leadership and Resilience Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4409/mod_resource/content/1/Leadership%20and%20Resilience%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 10786945, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-3-leadership-and-resilience' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f4', l.id, 'upskilling', 'pdf', 'Emotional  Physical Resilience Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4402/mod_resource/content/1/Emotional%20%20Physical%20Resilience%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1468701, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-4-emotional-and-physical-resilience' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f5', l.id, 'upskilling', 'pdf', 'Emotional  Physical Resilience Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4411/mod_resource/content/1/Emotional%20%20Physical%20Resilience%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 17811473, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-4-emotional-and-physical-resilience' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f6', l.id, 'upskilling', 'pdf', 'Thriving Through Challenges Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4403/mod_resource/content/1/Thriving%20Through%20Challenges%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 737431, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-5-thriving-through-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f7', l.id, 'upskilling', 'pdf', 'Thriving Through Challenges Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4413/mod_resource/content/1/Thriving%20Through%20Challenges%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12254077, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'building-resilience-in-the-workplace-module-5-thriving-through-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f8', l.id, 'upskilling', 'pdf', 'Time Management Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4265/mod_resource/content/1/Time%20Management%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 661017, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-1-time-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000f9', l.id, 'upskilling', 'pdf', 'Time Management Fundamentals Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4272/mod_resource/content/1/Time%20Management%20Fundamentals%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7012788, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-1-time-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000fa', l.id, 'upskilling', 'pdf', 'Goal Setting Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4266/mod_resource/content/1/Goal%20Setting%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 274133, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-2-goal-setting' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000fb', l.id, 'upskilling', 'pdf', 'Goal Setting Course Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4275/mod_resource/content/1/Goal%20Setting%20Course%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9192509, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-2-goal-setting' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000fc', l.id, 'upskilling', 'pdf', 'Time Management Scheduling Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4267/mod_resource/content/1/Time%20Management%20Scheduling%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 676456, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-3-scheduling' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000fd', l.id, 'upskilling', 'pdf', 'Time Management Scheduling Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4274/mod_resource/content/1/Time%20Management%20Scheduling%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 4348814, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-3-scheduling' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000fe', l.id, 'upskilling', 'pdf', 'Time Management Prioritization Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4268/mod_resource/content/1/Time%20Management%20Prioritization%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 664769, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-4-prioritization' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000000ff', l.id, 'upskilling', 'pdf', 'Time Management Prioritization Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4278/mod_resource/content/1/Time%20Management%20Prioritization%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9778315, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-4-prioritization' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000100', l.id, 'upskilling', 'pdf', 'Time Management Concentration Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4269/mod_resource/content/1/Time%20Management%20Concentration%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 749243, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-5-concentration' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000101', l.id, 'upskilling', 'pdf', 'Time Management Concentration Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4280/mod_resource/content/1/Time%20Management%20Concentration%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13850554, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-5-concentration' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000102', l.id, 'upskilling', 'pdf', 'Overcoming Challenges Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4270/mod_resource/content/1/Overcoming%20Challenges%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 475175, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-6-overcoming-time-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000103', l.id, 'upskilling', 'pdf', 'Overcoming Challenges Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4282/mod_resource/content/1/Overcoming%20Challenges%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 18577434, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'time-management-amp-prioritization-module-6-overcoming-time-challenges' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000104', l.id, 'upskilling', 'pdf', 'Problem Solving Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4324/mod_resource/content/1/Problem%20Solving%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 412170, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-1-problem-solving-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000105', l.id, 'upskilling', 'pdf', 'Problem Solving Fund Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4329/mod_resource/content/1/Problem%20Solving%20Fund%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14829911, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-1-problem-solving-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000106', l.id, 'upskilling', 'pdf', 'Problem Solving in the Workplace Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4325/mod_resource/content/1/Problem%20Solving%20in%20the%20Workplace%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 713306, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-2-problem-solving-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000107', l.id, 'upskilling', 'pdf', 'Problem Solving Steps Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4331/mod_resource/content/1/Problem%20Solving%20Steps%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13879157, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-2-problem-solving-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000108', l.id, 'upskilling', 'pdf', 'Steps to Problem Solving Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4326/mod_resource/content/1/Steps%20to%20Problem%20Solving%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 361051, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-3-steps-to-problem-solving' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000109', l.id, 'upskilling', 'pdf', 'Advanced Problem Solving Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4333/mod_resource/content/1/Advanced%20Problem%20Solving%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12067845, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-3-steps-to-problem-solving' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000010a', l.id, 'upskilling', 'pdf', 'Advanced Problem Solving Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4327/mod_resource/content/1/Advanced%20Problem%20Solving%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 381784, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-4-advanced-problem-solving' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000010b', l.id, 'upskilling', 'pdf', 'Advanced Problem Solving Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4335/mod_resource/content/1/Advanced%20Problem%20Solving%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 12067845, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'problem-solving-techniques-module-4-advanced-problem-solving' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000010c', l.id, 'upskilling', 'pdf', 'Critical Thinking Fund Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4366/mod_resource/content/1/Critical%20Thinking%20Fund%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 490219, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'critical-thinking-strategies-module-1-critical-thinking-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000010d', l.id, 'upskilling', 'pdf', 'Critical Thinking Fund Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4370/mod_resource/content/1/Critical%20Thinking%20Fund%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13007168, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'critical-thinking-strategies-module-1-critical-thinking-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000010e', l.id, 'upskilling', 'pdf', 'Workplace Critical Thinking Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4367/mod_resource/content/1/Workplace%20Critical%20Thinking%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 491097, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'critical-thinking-strategies-module-2-thinking-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000010f', l.id, 'upskilling', 'pdf', 'Workplace Critical Thinking Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4372/mod_resource/content/1/Workplace%20Critical%20Thinking%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8251778, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'critical-thinking-strategies-module-2-thinking-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000110', l.id, 'upskilling', 'pdf', 'Critical Thinking  Info Lit Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4368/mod_resource/content/1/Critical%20Thinking%20%20Info%20Lit%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 713457, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'critical-thinking-strategies-module-3-critical-thinking-and-information-literacy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000111', l.id, 'upskilling', 'pdf', 'Critical Thinking  Info Lit Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4374/mod_resource/content/1/Critical%20Thinking%20%20Info%20Lit%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 5635544, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'critical-thinking-strategies-module-3-critical-thinking-and-information-literacy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000112', l.id, 'upskilling', 'pdf', 'Marketing Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3615/mod_resource/content/1/Marketing%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2240432, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-1-marketing-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000113', l.id, 'upskilling', 'pdf', 'Marketing Fundamentals Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3627/mod_resource/content/1/Marketing%20Fundamentals%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 32231075, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-1-marketing-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000114', l.id, 'upskilling', 'pdf', 'Module 1 Marketing Fundamentals Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3733/mod_resource/content/1/Module%201%20Marketing%20Fundamentals%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 204854, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-1-marketing-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000115', l.id, 'upskilling', 'pdf', 'Brand Identity and Strategy Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3616/mod_resource/content/1/Brand%20Identity%20and%20Strategy%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2010260, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-2-brand-identity-and-strategy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000116', l.id, 'upskilling', 'pdf', 'Brand Identity and Strategy Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3629/mod_resource/content/1/Brand%20Identity%20and%20Strategy%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 41957983, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-2-brand-identity-and-strategy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000117', l.id, 'upskilling', 'pdf', 'Module 2 Brand Identity Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3735/mod_resource/content/1/Module%202%20Brand%20Identity%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 174259, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-2-brand-identity-and-strategy' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000118', l.id, 'upskilling', 'pdf', 'Product Marketing Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3617/mod_resource/content/1/Product%20Marketing%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1236522, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-3-product-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000119', l.id, 'upskilling', 'pdf', 'Product Marketing Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3631/mod_resource/content/1/Product%20Marketing%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30847830, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-3-product-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000011a', l.id, 'upskilling', 'pdf', 'MODULE 3 PRODUCT MARKETING SUMMARY.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3737/mod_resource/content/1/MODULE%203%20PRODUCT%20MARKETING%20SUMMARY.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 257337, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-3-product-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000011b', l.id, 'upskilling', 'pdf', 'Content Marketing Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3618/mod_resource/content/1/Content%20Marketing%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2715398, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-4-content-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000011c', l.id, 'upskilling', 'pdf', 'Content Marketing Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3633/mod_resource/content/1/Content%20Marketing%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 29130761, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-4-content-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000011d', l.id, 'upskilling', 'pdf', 'Module 4 Content Marketing Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3741/mod_resource/content/1/Module%204%20Content%20Marketing%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 199642, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-4-content-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000011e', l.id, 'upskilling', 'pdf', 'Customer and Maketing Research Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3619/mod_resource/content/1/Customer%20and%20Maketing%20Research%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2512916, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-5-customer-and-marketing-research' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000011f', l.id, 'upskilling', 'pdf', 'Customer and Marketing Research Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3635/mod_resource/content/1/Customer%20and%20Marketing%20Research%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 37212574, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-5-customer-and-marketing-research' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000120', l.id, 'upskilling', 'pdf', 'Customer and Marketing Research Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3766/mod_resource/content/1/Customer%20and%20Marketing%20Research%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 101851, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-5-customer-and-marketing-research' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000121', l.id, 'upskilling', 'pdf', 'Website Marketing Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3620/mod_resource/content/1/Website%20Marketing%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1779289, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-6-website-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000122', l.id, 'upskilling', 'pdf', 'Website Marketing Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3637/mod_resource/content/1/Website%20Marketing%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8963621, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-6-website-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000123', l.id, 'upskilling', 'pdf', 'Website Marketing Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3767/mod_resource/content/1/Website%20Marketing%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 154227, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-6-website-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000124', l.id, 'upskilling', 'pdf', 'Search Engine Optimisation (SEO) Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3621/mod_resource/content/1/Search%20Engine%20Optimisation%20%28SEO%29%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 698268, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-7-search-engine-optimization' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000125', l.id, 'upskilling', 'pdf', 'Search Engine Optimisation (SEO) Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3639/mod_resource/content/1/Search%20Engine%20Optimisation%20%28SEO%29%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 49630763, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-7-search-engine-optimization' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000126', l.id, 'upskilling', 'pdf', 'Search Engine Optimization Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3768/mod_resource/content/1/Search%20Engine%20Optimization%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 216445, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-7-search-engine-optimization' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000127', l.id, 'upskilling', 'pdf', 'Social Media Marketing Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3622/mod_resource/content/1/Social%20Media%20Marketing%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 2594822, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-8-social-media-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000128', l.id, 'upskilling', 'pdf', 'Social Media Marketing Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3641/mod_resource/content/1/Social%20Media%20Marketing%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 39909765, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-8-social-media-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000129', l.id, 'upskilling', 'pdf', 'Social Media Marketing Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3769/mod_resource/content/1/Social%20Media%20Marketing%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 238021, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-8-social-media-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000012a', l.id, 'upskilling', 'pdf', 'Email Marketing Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3623/mod_resource/content/1/Email%20Marketing%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1621537, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-9-email-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000012b', l.id, 'upskilling', 'pdf', 'Email Marketing Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3643/mod_resource/content/1/Email%20Marketing%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26051601, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-9-email-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000012c', l.id, 'upskilling', 'pdf', 'Email Marketing MODULE SUMMARY.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3770/mod_resource/content/1/Email%20Marketing%20MODULE%20SUMMARY.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 242813, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-9-email-marketing' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000012d', l.id, 'upskilling', 'pdf', 'Paid Advertising Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3624/mod_resource/content/1/Paid%20Advertising%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1302420, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-10-paid-advertising' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000012e', l.id, 'upskilling', 'pdf', 'Paid Advertising Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3645/mod_resource/content/1/Paid%20Advertising%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24390135, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-10-paid-advertising' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000012f', l.id, 'upskilling', 'pdf', 'Paid Advertising Module Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3771/mod_resource/content/1/Paid%20Advertising%20Module%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 102638, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-10-paid-advertising' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000130', l.id, 'upskilling', 'pdf', 'Marketing Analytics Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3625/mod_resource/content/1/Marketing%20Analytics%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1534305, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-11-marketing-analytics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000131', l.id, 'upskilling', 'pdf', 'Marketing Analytics Module Reading Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3647/mod_resource/content/2/Marketing%20Analytics%20Module%20Reading%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 26018804, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-11-marketing-analytics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000132', l.id, 'upskilling', 'pdf', 'Marketing Analytics Module Summary.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/3773/mod_resource/content/1/Marketing%20Analytics%20Module%20Summary.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 155901, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'marketing-fundamentals-module-11-marketing-analytics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000133', l.id, 'upskilling', 'pdf', 'Leadership Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4492/mod_resource/content/1/Leadership%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 331025, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leadership-development-module-1-leadership-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000134', l.id, 'upskilling', 'pdf', 'Leadership Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4497/mod_resource/content/1/Leadership%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 16748824, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leadership-development-module-1-leadership-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000135', l.id, 'upskilling', 'pdf', 'Leadership Styles Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4493/mod_resource/content/1/Leadership%20Styles%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 612229, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leadership-development-module-2-leadership-styles' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000136', l.id, 'upskilling', 'pdf', 'Leadership Styles Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4499/mod_resource/content/1/Leadership%20Styles%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13502790, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leadership-development-module-2-leadership-styles' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000137', l.id, 'upskilling', 'pdf', 'Emotional Intelligence Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4494/mod_resource/content/1/Emotional%20Intelligence%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1996162, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leadership-development-module-3-emotional-intelligence' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000138', l.id, 'upskilling', 'pdf', 'Emotional Intelligence Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4501/mod_resource/content/1/Emotional%20Intelligence%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 19737923, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leadership-development-module-3-emotional-intelligence' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000139', l.id, 'upskilling', 'pdf', 'Crisis Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4495/mod_resource/content/1/Crisis%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 632999, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leadership-development-module-4-crisis-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000013a', l.id, 'upskilling', 'pdf', 'Crisis Management Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4503/mod_resource/content/1/Crisis%20Management%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 7029924, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leadership-development-module-4-crisis-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000013b', l.id, 'upskilling', 'pdf', 'Team Management Fundamentals.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4535/mod_resource/content/1/Team%20Management%20Fundamentals.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 564855, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-1-team-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000013c', l.id, 'upskilling', 'pdf', 'Team Management Fund Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4568/mod_resource/content/1/Team%20Management%20Fund%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 15164535, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-1-team-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000013d', l.id, 'upskilling', 'pdf', 'New Manager Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4537/mod_resource/content/1/New%20Manager%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 637698, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-2-new-manager' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000013e', l.id, 'upskilling', 'pdf', 'New Manager Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4575/mod_resource/content/1/New%20Manager%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20507148, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-2-new-manager' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000013f', l.id, 'upskilling', 'pdf', 'Developing your Team Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4539/mod_resource/content/1/Developing%20your%20Team%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 501149, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-3-developing-your-team' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000140', l.id, 'upskilling', 'pdf', 'Developing your Team Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4581/mod_resource/content/1/Developing%20your%20Team%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24310638, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-3-developing-your-team' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000141', l.id, 'upskilling', 'pdf', 'Team Culture Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4552/mod_resource/content/1/Team%20Culture%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 468014, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-4-team-culture' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000142', l.id, 'upskilling', 'pdf', 'Team Culture Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4590/mod_resource/content/1/Team%20Culture%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30368707, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-4-team-culture' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000143', l.id, 'upskilling', 'pdf', 'Delegating Tasks Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4560/mod_resource/content/1/Delegating%20Tasks%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 821677, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-5-delegating-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000144', l.id, 'upskilling', 'pdf', 'Delegating Task Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4598/mod_resource/content/1/Delegating%20Task%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 8387042, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-5-delegating-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000145', l.id, 'upskilling', 'pdf', 'Motivating your Team Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4561/mod_resource/content/1/Motivating%20your%20Team%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 852785, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-6-motivating-your-team' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000146', l.id, 'upskilling', 'pdf', 'Motivating your Team Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4605/mod_resource/content/1/Motivating%20your%20Team%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 24836995, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-6-motivating-your-team' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000147', l.id, 'upskilling', 'pdf', 'Managing Remote Teams Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4562/mod_resource/content/1/Managing%20Remote%20Teams%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 464299, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-7-managing-remote-teams' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000148', l.id, 'upskilling', 'pdf', 'Managing Remote Teams Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4614/mod_resource/content/1/Managing%20Remote%20Teams%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 22833359, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-7-managing-remote-teams' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000149', l.id, 'upskilling', 'pdf', 'Team Dynamics Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4563/mod_resource/content/1/Team%20Dynamics%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 748250, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-8-team-dynamics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000014a', l.id, 'upskilling', 'pdf', 'Team Dynamics Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4622/mod_resource/content/1/Team%20Dynamics%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 33517588, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-8-team-dynamics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000014b', l.id, 'upskilling', 'pdf', 'Performance Management Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4564/mod_resource/content/1/Performance%20Management%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 668307, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-9-performance-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000014c', l.id, 'upskilling', 'pdf', 'Performance Management Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4630/mod_resource/content/1/Performance%20Management%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 29740576, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-9-performance-management' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000014d', l.id, 'upskilling', 'pdf', 'Resolving Conflict Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4565/mod_resource/content/1/Resolving%20Conflict%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 659715, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-10-resolving-conflict' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000014e', l.id, 'upskilling', 'pdf', 'Resolving Conflict Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4641/mod_resource/content/1/Resolving%20Conflict%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 27915430, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-10-resolving-conflict' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000014f', l.id, 'upskilling', 'pdf', 'Letting an Employee Go Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4566/mod_resource/content/1/Letting%20an%20Employee%20Go%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 571003, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-11-letting-an-employee-go' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000150', l.id, 'upskilling', 'pdf', 'Letting an Employee Go Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4649/mod_resource/content/1/Letting%20an%20Employee%20Go%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23520722, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'team-management-strategies-module-11-letting-an-employee-go' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000151', l.id, 'upskilling', 'pdf', 'Change Management Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4684/mod_resource/content/1/Change%20Management%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 525053, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leading-through-change-module-1-change-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000152', l.id, 'upskilling', 'pdf', 'Change Management Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4692/mod_resource/content/1/Change%20Management%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13928061, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leading-through-change-module-1-change-management-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000153', l.id, 'upskilling', 'pdf', 'Change Management Models Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4685/mod_resource/content/1/Change%20Management%20Models%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 491654, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leading-through-change-module-2-change-management-models' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000154', l.id, 'upskilling', 'pdf', 'Change Management Models Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4694/mod_resource/content/1/Change%20Management%20Models%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 21281079, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leading-through-change-module-2-change-management-models' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000155', l.id, 'upskilling', 'pdf', 'Change Management Process Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4688/mod_resource/content/1/Change%20Management%20Process%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 278476, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leading-through-change-module-3-the-change-management-process' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000156', l.id, 'upskilling', 'pdf', 'Change Management Process Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4697/mod_resource/content/1/Change%20Management%20Process%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 16456587, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leading-through-change-module-3-the-change-management-process' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000157', l.id, 'upskilling', 'pdf', 'Communicating Change Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4687/mod_resource/content/1/Communicating%20Change%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 580702, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leading-through-change-module-4-communicating-change' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000158', l.id, 'upskilling', 'pdf', 'Communicating Change Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4696/mod_resource/content/1/Communicating%20Change%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 54271603, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leading-through-change-module-4-communicating-change' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000159', l.id, 'upskilling', 'pdf', 'Fundamentals of Leading Through Change Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4689/mod_resource/content/1/Fundamentals%20of%20Leading%20Through%20Change%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 691409, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leading-through-change-module-5-leading-through-change' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000015a', l.id, 'upskilling', 'pdf', 'Fundamentals of Leading through Change Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4700/mod_resource/content/1/Fundamentals%20of%20Leading%20through%20Change%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 27299554, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leading-through-change-module-5-leading-through-change' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000015b', l.id, 'upskilling', 'pdf', 'Managing Change in time of Crisis Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4690/mod_resource/content/1/Managing%20Change%20in%20time%20of%20Crisis%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 237580, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'leading-through-change-module-6-managing-change-in-time-of-crisis' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000015c', l.id, 'upskilling', 'pdf', 'Managing Change in Crisis Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4702/mod_resource/content/1/Managing%20Change%20in%20Crisis%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 6219520, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'leading-through-change-module-6-managing-change-in-time-of-crisis' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000015d', l.id, 'upskilling', 'pdf', 'Positive Psychology Fundamentals Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4746/mod_resource/content/1/Positive%20Psychology%20Fundamentals%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 298549, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-1-positive-psychology-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000015e', l.id, 'upskilling', 'pdf', 'Positve Psych Fund Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4753/mod_resource/content/1/Positve%20Psych%20Fund%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30927714, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-1-positive-psychology-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000015f', l.id, 'upskilling', 'pdf', 'Forming Healthy Habits Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4747/mod_resource/content/1/Forming%20Healthy%20Habits%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 822460, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-2-forming-healthy-habits' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000160', l.id, 'upskilling', 'pdf', 'Forming Healthy Habits Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4759/mod_resource/content/1/Forming%20Healthy%20Habits%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 30662639, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-2-forming-healthy-habits' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000161', l.id, 'upskilling', 'pdf', 'Positive Psychology Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4748/mod_resource/content/1/Positive%20Psychology%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 726842, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-3-positive-psychology-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000162', l.id, 'upskilling', 'pdf', 'Positive Psychology Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4760/mod_resource/content/1/Positive%20Psychology%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 21227238, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-3-positive-psychology-in-the-workplace' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000163', l.id, 'upskilling', 'pdf', 'Exercise Course Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4749/mod_resource/content/1/Exercise%20Course%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 768455, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-4-exercise' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000164', l.id, 'upskilling', 'pdf', 'Exercise Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4761/mod_resource/content/1/Exercise%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 31253182, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-4-exercise' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000165', l.id, 'upskilling', 'pdf', 'Mental Health Awareness Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4750/mod_resource/content/1/Mental%20Health%20Awareness%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 373764, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-5-mental-health-awareness' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000166', l.id, 'upskilling', 'pdf', 'Mental Health Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4762/mod_resource/content/1/Mental%20Health%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 28613802, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-5-mental-health-awareness' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000167', l.id, 'upskilling', 'pdf', 'Dealing With Emotions Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4751/mod_resource/content/1/Dealing%20With%20Emotions%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 315808, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-6-dealing-with-emotions' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000168', l.id, 'upskilling', 'pdf', 'Dealing with Emotions Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4763/mod_resource/content/1/Dealing%20with%20Emotions%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 20773716, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'employee-mental-health-amp-wellness-module-6-dealing-with-emotions' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000169', l.id, 'upskilling', 'pdf', 'Stress Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4818/mod_resource/content/1/Stress%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 622697, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'stress-management-techniques-module-1-stress-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000016a', l.id, 'upskilling', 'pdf', 'Stress Fundamentals Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4822/mod_resource/content/1/Stress%20Fundamentals%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23911573, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'stress-management-techniques-module-1-stress-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000016b', l.id, 'upskilling', 'pdf', 'Stress and Work Performance Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4819/mod_resource/content/1/Stress%20and%20Work%20Performance%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 451004, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'stress-management-techniques-module-2-stress-and-work-performance' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000016c', l.id, 'upskilling', 'pdf', 'Stress and Work Performance Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4824/mod_resource/content/1/Stress%20and%20Work%20Performance%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 18240375, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'stress-management-techniques-module-2-stress-and-work-performance' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000016d', l.id, 'upskilling', 'pdf', 'Strategies to Relieve Stress Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4820/mod_resource/content/1/Strategies%20to%20Relieve%20Stress%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 472805, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'stress-management-techniques-module-3-strategies-to-relieve-stress' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000016e', l.id, 'upskilling', 'pdf', 'Strategies to Relieve Stress Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4826/mod_resource/content/1/Strategies%20to%20Relieve%20Stress%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 31833065, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'stress-management-techniques-module-3-strategies-to-relieve-stress' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000016f', l.id, 'upskilling', 'pdf', 'Workplace Health Safety Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4854/mod_resource/content/1/Workplace%20Health%20Safety%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 703541, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'workplace-compliance-essentials-module-1-workplace-health-amp-safety' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000170', l.id, 'upskilling', 'pdf', 'Workplace Health Safety Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4857/mod_resource/content/1/Workplace%20Health%20Safety%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 27648619, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'workplace-compliance-essentials-module-1-workplace-health-amp-safety' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000171', l.id, 'upskilling', 'pdf', 'Workplace Violence Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4855/mod_resource/content/1/Workplace%20Violence%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 610371, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'workplace-compliance-essentials-module-2-workplace-violence' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000172', l.id, 'upskilling', 'pdf', 'Workplace Violence Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4859/mod_resource/content/1/Workplace%20Violence%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23565334, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'workplace-compliance-essentials-module-2-workplace-violence' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000173', l.id, 'upskilling', 'pdf', 'Business Ethics Fundamentals Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4880/mod_resource/content/1/Business%20Ethics%20Fundamentals%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 465911, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'business-ethics-in-practice-module-1-business-ethics-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000174', l.id, 'upskilling', 'pdf', 'Bussiness Ethics Fund Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4886/mod_resource/content/1/Bussiness%20Ethics%20Fund%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 9605640, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'business-ethics-in-practice-module-1-business-ethics-fundamentals' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000175', l.id, 'upskilling', 'pdf', 'Leadership on Ethics Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4881/mod_resource/content/1/Leadership%20on%20Ethics%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 447890, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'business-ethics-in-practice-module-2-leadership-on-ethics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000176', l.id, 'upskilling', 'pdf', 'Leadership on Ethics Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4887/mod_resource/content/1/Leadership%20on%20Ethics%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 14218938, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'business-ethics-in-practice-module-2-leadership-on-ethics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000177', l.id, 'upskilling', 'pdf', 'Employee Ethics Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4882/mod_resource/content/1/Employee%20Ethics%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 1969701, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'business-ethics-in-practice-module-3-employee-ethics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000178', l.id, 'upskilling', 'pdf', 'Employee Ethics Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4888/mod_resource/content/1/Employee%20Ethics%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13729513, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'business-ethics-in-practice-module-3-employee-ethics' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000179', l.id, 'upskilling', 'pdf', 'Inclusion and Respect Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4918/mod_resource/content/1/Inclusion%20and%20Respect%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 694802, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'improving-business-ethics-amp-culture-module-1-inclusion-and-respect' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000017a', l.id, 'upskilling', 'pdf', 'Inclusion and Respect Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4924/mod_resource/content/1/Inclusion%20and%20Respect%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 13518459, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'improving-business-ethics-amp-culture-module-1-inclusion-and-respect' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000017b', l.id, 'upskilling', 'pdf', 'Inclusive Communication- Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4919/mod_resource/content/1/Inclusive%20Communication-%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 678641, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'improving-business-ethics-amp-culture-module-2-inclusive-communication' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000017c', l.id, 'upskilling', 'pdf', 'Inclusive Communication Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4925/mod_resource/content/1/Inclusive%20Communication%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 49231152, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'improving-business-ethics-amp-culture-module-2-inclusive-communication' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000017d', l.id, 'upskilling', 'pdf', 'Culture Competence Module Preview.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4920/mod_resource/content/1/Culture%20Competence%20Module%20Preview.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 692901, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'improving-business-ethics-amp-culture-module-3-culture-competence' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000017e', l.id, 'upskilling', 'pdf', 'Culture Competence Module Material.pdf', NULL, 'https://goalvow.com/upskilling/webservice/pluginfile.php/4926/mod_resource/content/1/Culture%20Competence%20Module%20Material.pdf?forcedownload=1&token=00536e412fb8d765b656ee064bf9ca2c', 23947638, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'improving-business-ethics-amp-culture-module-3-culture-competence' LIMIT 1;

-- ── skills-training ────────────────────────────────────────────────────
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000017f', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/338/mod_resource/content/4/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000180', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1_Summary.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/339/mod_resource/content/4/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201_Summary.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 280243, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000181', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/806/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1272876, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000182', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 2 Summary.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/807/mod_resource/content/2/1_KM%201_Intro%20to%20World%20of%20Work_Topic%202%20Summary.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 314060, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000183', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/808/mod_resource/content/1/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000184', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/809/mod_resource/content/2/Reading%20Material%20for%20Topic%204.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 2116107, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000185', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/810/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1917711, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000186', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 6.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/811/mod_resource/content/1/Reading%20Material%20for%20Topic%206.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1809860, 'application/pdf', 7
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000187', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 7.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/812/mod_resource/content/1/Reading%20Material%20for%20Topic%207.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 948526, 'application/pdf', 8
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000188', l.id, 'skills-training', 'pdf', 'Reading Material Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/436/mod_resource/content/2/Reading%20Material%20Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 973655, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000189', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/441/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000018a', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/443/mod_resource/content/2/Reading%20Material%20for%20Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1208714, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000018b', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/450/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000018c', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 3.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/444/mod_resource/content/2/Reading%20Material%20for%20Topic%203.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 726106, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000018d', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/449/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000018e', l.id, 'skills-training', 'pdf', 'Reading Material for Topic4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/445/mod_resource/content/2/Reading%20Material%20for%20Topic4.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 914009, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000018f', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/448/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 7
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000190', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/446/mod_resource/content/2/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1439165, 'application/pdf', 8
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000191', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/447/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 9
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000192', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/477/mod_resource/content/2/Reading%20Material%20for%20Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 752901, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000193', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/475/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000194', l.id, 'skills-training', 'pdf', 'KM 3 Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/480/mod_resource/content/2/KM%203%20Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1048682, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000195', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/482/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000196', l.id, 'skills-training', 'pdf', 'KM3 topic 3.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/479/mod_resource/content/2/KM3%20topic%203.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1928749, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000197', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/483/mod_resource/content/2/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000198', l.id, 'skills-training', 'pdf', 'KM3 topic 4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/478/mod_resource/content/2/KM3%20topic%204.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186165, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000199', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/481/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 7
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-theory-knowledge-module-3-basics-of-cleaning-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000019a', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/504/mod_resource/content/4/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-common-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000019b', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/510/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-common-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000019c', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/511/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-common-reading-material' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000019d', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/512/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000019e', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/505/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000019f', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/513/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a0', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/524/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a1', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/525/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a2', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/526/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a3', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/514/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a4', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/527/mod_resource/content/2/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 7
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a5', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/534/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 8
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a6', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/535/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 9
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a7', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/529/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 10
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-1-complete-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a8', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/551/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001a9', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/552/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001aa', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/553/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ab', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/554/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ac', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/555/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ad', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/540/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ae', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/561/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001af', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/579/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 7
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b0', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/580/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 8
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b1', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/581/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 9
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b2', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/582/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 10
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b3', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/583/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 11
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b4', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/584/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 12
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b5', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/585/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 13
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b6', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/563/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 14
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b7', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/565/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 15
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b8', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/593/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 16
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001b9', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/594/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 17
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ba', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/595/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 18
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001bb', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/596/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 19
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001bc', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/597/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 20
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001bd', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/598/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 21
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001be', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/599/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 22
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001bf', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/567/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 23
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c0', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/569/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 24
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c1', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/607/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 25
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c2', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/608/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 26
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c3', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/609/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 27
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c4', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/610/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 28
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c5', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/571/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 29
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c6', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/573/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 30
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c7', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/620/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 31
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c8', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/621/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 32
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001c9', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/575/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 33
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-2-clean-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ca', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/709/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001cb', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/656/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001cc', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/657/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001cd', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/637/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ce', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/661/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001cf', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/662/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d0', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/663/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d1', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/664/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 7
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d2', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/631/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 8
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d3', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/667/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 9
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d4', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/668/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 10
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d5', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/669/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 11
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d6', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/670/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 12
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d7', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/642/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 13
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d8', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/674/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 14
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001d9', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/675/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 15
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001da', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/676/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 16
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001db', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/677/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 17
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001dc', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/678/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 18
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001dd', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/646/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 19
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-practical-skills-training-module-3-check-and-confirm-completed-tasks' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001de', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/650/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-1-procedures-for-completing-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001df', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/710/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-1-procedures-for-completing-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e0', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/711/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-1-procedures-for-completing-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e1', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/712/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-1-procedures-for-completing-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e2', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/713/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-1-procedures-for-completing-before-shift-duties' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e3', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/718/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-2-procedures-for-cleaning-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e4', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/765/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-2-procedures-for-cleaning-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e5', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/766/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-2-procedures-for-cleaning-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e6', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/767/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-2-procedures-for-cleaning-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e7', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/768/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-2-procedures-for-cleaning-the-commercial-kitchenette' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e8', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/771/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-3-procedures-for-checking-and-confirming-completed-t' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001e9', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/796/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-3-procedures-for-checking-and-confirming-completed-t' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ea', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/797/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-3-procedures-for-checking-and-confirming-completed-t' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001eb', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/798/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-3-procedures-for-checking-and-confirming-completed-t' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ec', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/799/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-3-procedures-for-checking-and-confirming-completed-t' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ed', l.id, 'skills-training', 'pdf', 'DRAFT Reading Material.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/800/mod_resource/content/1/DRAFT%20Reading%20Material.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 187667, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-kitchenette-cleaner-workplace-experience-module-3-procedures-for-checking-and-confirming-completed-t' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ee', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/875/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ef', l.id, 'skills-training', 'pdf', 'KM 1_Intro to World of Work_Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/883/mod_resource/content/1/KM%201_Intro%20to%20World%20of%20Work_Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1272876, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f0', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/899/mod_resource/content/2/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f1', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/901/mod_resource/content/1/Reading%20Material%20for%20Topic%204.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 2116107, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f2', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/910/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1917711, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f3', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 6.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/924/mod_resource/content/1/Reading%20Material%20for%20Topic%206.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1809860, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f4', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 7.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/933/mod_resource/content/1/Reading%20Material%20for%20Topic%207.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 948526, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f5', l.id, 'skills-training', 'pdf', 'Reading Material Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/948/mod_resource/content/1/Reading%20Material%20Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 973655, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f6', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/977/mod_resource/content/1/Reading%20Material%20for%20Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1208714, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f7', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 3.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1003/mod_resource/content/1/Reading%20Material%20for%20Topic%203.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 726106, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f8', l.id, 'skills-training', 'pdf', 'Reading Material for Topic4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1027/mod_resource/content/1/Reading%20Material%20for%20Topic4.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 914009, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001f9', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1063/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1439165, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001fa', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1291/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-3-cleaning-ablution-facilities' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001fb', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1297/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-3-cleaning-ablution-facilities' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001fc', l.id, 'skills-training', 'pdf', 'KM 1_Intro to World of Work_Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1300/mod_resource/content/1/KM%201_Intro%20to%20World%20of%20Work_Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1272876, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-3-cleaning-ablution-facilities' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001fd', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1304/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-3-cleaning-ablution-facilities' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001fe', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1307/mod_resource/content/1/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-3-cleaning-ablution-facilities' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-0000000001ff', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1313/mod_resource/content/1/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-ablution-cleaner-theory-knowledge-module-3-cleaning-ablution-facilities' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000200', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1095/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000201', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1116/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1272876, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000202', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1138/mod_resource/content/1/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000203', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1164/mod_resource/content/1/Reading%20Material%20for%20Topic%204.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 2116107, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000204', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1191/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1917711, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000205', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 6.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1220/mod_resource/content/1/Reading%20Material%20for%20Topic%206.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1809860, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000206', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 7.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1246/mod_resource/content/1/Reading%20Material%20for%20Topic%207.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 948526, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000207', l.id, 'skills-training', 'pdf', 'Reading Material Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/949/mod_resource/content/1/Reading%20Material%20Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 973655, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000208', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/978/mod_resource/content/1/Reading%20Material%20for%20Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1208714, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000209', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 3.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1004/mod_resource/content/1/Reading%20Material%20for%20Topic%203.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 726106, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000020a', l.id, 'skills-training', 'pdf', 'Reading Material for Topic4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1028/mod_resource/content/1/Reading%20Material%20for%20Topic4.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 914009, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000020b', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1064/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1439165, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000020c', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1317/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-3-introduction-to-above-the-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000020d', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1322/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-3-introduction-to-above-the-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000020e', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1325/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-3-introduction-to-above-the-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000020f', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1329/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-3-introduction-to-above-the-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000210', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1332/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-3-introduction-to-above-the-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000211', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1336/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-above-the-floor-surface-cleaner-knowledge-module-3-introduction-to-above-the-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000212', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1094/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000213', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1115/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1272876, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000214', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1139/mod_resource/content/1/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000215', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1163/mod_resource/content/1/Reading%20Material%20for%20Topic%204.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 2116107, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000216', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1190/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1917711, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000217', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 6.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1219/mod_resource/content/1/Reading%20Material%20for%20Topic%206.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1809860, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000218', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 7.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1247/mod_resource/content/1/Reading%20Material%20for%20Topic%207.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 948526, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000219', l.id, 'skills-training', 'pdf', 'Reading Material Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/950/mod_resource/content/1/Reading%20Material%20Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 973655, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000021a', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/979/mod_resource/content/1/Reading%20Material%20for%20Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1208714, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000021b', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 3.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1005/mod_resource/content/1/Reading%20Material%20for%20Topic%203.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 726106, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000021c', l.id, 'skills-training', 'pdf', 'Reading Material for Topic4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1029/mod_resource/content/1/Reading%20Material%20for%20Topic4.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 914009, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000021d', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1065/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1439165, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumables' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000021e', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1339/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-3-basics-of-cleaning-commercial-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000021f', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1348/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-3-basics-of-cleaning-commercial-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000220', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1344/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-3-basics-of-cleaning-commercial-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000221', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1350/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-3-basics-of-cleaning-commercial-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000222', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1353/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-3-basics-of-cleaning-commercial-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000223', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1357/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-floor-cleaner-knowledge-module-3-basics-of-cleaning-commercial-floor-surface' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000224', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1093/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1186799, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000225', l.id, 'skills-training', 'pdf', '1_KM 1_Intro to World of Work_Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1114/mod_resource/content/1/1_KM%201_Intro%20to%20World%20of%20Work_Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1272876, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000226', l.id, 'skills-training', 'pdf', 'Employee Employer Relationship.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1140/mod_resource/content/1/Employee%20Employer%20Relationship.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1571429, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000227', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1162/mod_resource/content/1/Reading%20Material%20for%20Topic%204.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 2116107, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000228', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1189/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1917711, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-000000000229', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 6.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1221/mod_resource/content/1/Reading%20Material%20for%20Topic%206.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1809860, 'application/pdf', 5
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000022a', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 7.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1248/mod_resource/content/1/Reading%20Material%20for%20Topic%207.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 948526, 'application/pdf', 6
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-1-introduction-to-the-world-of-work' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000022b', l.id, 'skills-training', 'pdf', 'Reading Material Topic 1.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/951/mod_resource/content/1/Reading%20Material%20Topic%201.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 973655, 'application/pdf', 0
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000022c', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 2.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/980/mod_resource/content/1/Reading%20Material%20for%20Topic%202.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1208714, 'application/pdf', 1
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000022d', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 3.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1006/mod_resource/content/1/Reading%20Material%20for%20Topic%203.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 726106, 'application/pdf', 2
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000022e', l.id, 'skills-training', 'pdf', 'Reading Material for Topic4.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1030/mod_resource/content/1/Reading%20Material%20for%20Topic4.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 914009, 'application/pdf', 3
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;
INSERT IGNORE INTO lesson_resources (id, lesson_id, academy, type, filename, content_hash, file_url, filesize, mime_type, position)
  SELECT 'res-0000-0000-0000-00000000022f', l.id, 'skills-training', 'pdf', 'Reading Material for Topic 5.pdf', NULL, 'https://goalvow.com/skills-training/webservice/pluginfile.php/1066/mod_resource/content/1/Reading%20Material%20for%20Topic%205.pdf?forcedownload=1&token=6b5f00ce3889922a6eb1df2b4a8c45aa', 1439165, 'application/pdf', 4
  FROM lessons l WHERE l.slug = 'commercial-all-rounder-cleaner-theory-knowledge-module-2-commercial-cleaning-equipment-chemicals-and-consumable' LIMIT 1;

-- ── chef-academy ────────────────────────────────────────────────────

-- ── schools ────────────────────────────────────────────────────

-- ── business-school ────────────────────────────────────────────────────

-- ── university ────────────────────────────────────────────────────

-- ── Video hash updates ────────────────────────────────────────

SET FOREIGN_KEY_CHECKS=1;

-- Done: 559 resources, 0 video hash updates.