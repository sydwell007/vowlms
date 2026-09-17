<?php
/**
 * Server-authoritative catalogue pricing for the 37 SAVVA career courses.
 *
 * Keeping this registry beside the payment code prevents an older imported
 * database row with price=0 from turning a paid launch product into a free
 * enrolment. Migration 039 repairs those rows permanently; this remains the
 * checkout safety net and must be updated if the launch price changes.
 */

const SAVVA_CAREER_COURSE_PRICE_ZAR = 999.00;

function savvaCareerCourseSlugs(): array
{
    return [
        'adobe-after-effects','adobe-animate','adobe-illustrator','adobe-indesign','adobe-photoshop','adobe-premiere-pro',
        'space-travel-and-solar-system','agriscience-1','agriscience-2','agriscience-3',
        'architectural-design-1','architectural-design-2','architectural-design-3','augmented-and-virtual-reality',
        'drones-remote-pilot','entrepreneurship-and-small-business','startups-and-innovation',
        'early-childhood-education-1','early-childhood-education-2','education-and-teaching-advanced',
        'fundamentals-of-bitcoin-and-crypto','fundamentals-of-blockchain-and-crypto','introduction-to-ai','robotics','smart-cities',
        'teaching-as-a-profession','transportation-technologies','wearable-technology','swift-app-development','java-se-8-associate',
        'intuit-design-for-delight','career-exploration','digital-information-technology','meta-social-media-marketing',
        'social-media-marketing','building-maintenance-technology-1','building-maintenance-technology-2',
    ];
}

function isSavvaCareerCourse(string $slug): bool
{
    return in_array($slug, savvaCareerCourseSlugs(), true);
}

function savvaCareerCoursePriceZar(string $slug): ?float
{
    return isSavvaCareerCourse($slug) ? SAVVA_CAREER_COURSE_PRICE_ZAR : null;
}
