"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { getGoalTile } from "@/data/goal-tiles";
import { getCoursesForRole } from "@/lib/goal-routing";
import { clearLearnerProfile, type LearnerProfile } from "@/lib/learner-profile";
import type { CourseSummary } from "@/types/lms";

type Enrollment = {
  courseSlug?: string;
  course_slug?: string;
  groupSlug?: string | null;
  status?: string;
};

export function ReturningLearnerBanner({
  profile,
  onChangeGoal,
}: {
  profile: LearnerProfile;
  onChangeGoal: () => void;
}) {
  const [enrolledSlugs, setEnrolledSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/enrollments", { cache: "no-store", credentials: "same-origin", signal: controller.signal })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const enrollments = (payload?.data ?? []) as Enrollment[];
        const active = enrollments.filter((item) => item.status !== "cancelled");
        setEnrolledSlugs(
          new Set(active.flatMap((item) => [item.courseSlug, item.course_slug, item.groupSlug].filter(Boolean) as string[])),
        );
      })
      .catch(() => setEnrolledSlugs(new Set()));
    return () => controller.abort();
  }, []);

  const tile = getGoalTile(profile.goalTileId);
  const roleFromTile = tile?.roles.find((r) => r.id === profile.roleId);

  const recommended: CourseSummary[] = roleFromTile
    ? getCoursesForRole(profile.academyCategory, roleFromTile, 6)
    : [];

  const inProgress = recommended.filter((c) => enrolledSlugs.has(c.slug));
  const nextUp = recommended.filter((c) => !enrolledSlugs.has(c.slug)).slice(0, 3);

  function handleChangeGoal() {
    clearLearnerProfile();
    onChangeGoal();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-ink sm:text-3xl">
          Welcome back — continue your path{profile.roleLabel ? ` to ${profile.roleLabel}` : ""}
        </h2>
        <button type="button" onClick={handleChangeGoal} className="text-sm font-semibold text-muted hover:text-ink">
          Change my learning goal →
        </button>
      </div>

      {inProgress.length > 0 ? (
        <>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-muted">Continue learning</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </>
      ) : null}

      {nextUp.length > 0 ? (
        <>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-muted">Recommended next</p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nextUp.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
