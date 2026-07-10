# Schema Changelog

## 011 - Integrity hardening

- Adds `updated_at` to enrolments and lesson progress.
- Adds `cancelled` to payment status.
- Adds a unique non-null PayFast provider-reference index.
- Provides verification and rollback guidance.

## 009-010 - Lesson resources

- Adds learning-resource records and imported Moodle resource metadata.

## 007 - API alignment

- Adds profile/notification fields, facilitator course assignment, and employer opportunity ownership fields used by PHP endpoints.

## 001-004 - Core baseline

- Creates core users, academy, course, learning, assessment, certificate, reward, payment, opportunity, and hub tables plus initial reference data.

All production imports require a backup, staging verification, and an authorised operator.
