import { CourseCatalogueClient } from "@/components/courses/CourseCatalogueClient";
import {
  getAcademies,
  getAcademyBySlug,
  getCourseSummaries,
} from "@/lib/data";
import { getServerRole } from "@/lib/auth/getServerRole";

export const metadata = {
  title: "Courses",
  description: "Browse practical courses across the GoalVow academy network.",
  alternates: { canonical: "/courses" },
};

type CoursesPageProps = {
  searchParams: Promise<{
    academy?: string;
    q?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const role = await getServerRole();
  const selectedAcademy = params.academy ? getAcademyBySlug(params.academy) : undefined;

  return (
    <CourseCatalogueClient
      academies={getAcademies(role)}
      courses={getCourseSummaries(role)}
      initialAcademy={selectedAcademy?.slug ?? "all"}
      initialQuery={params.q?.trim() ?? ""}
      role={role}
    />
  );
}
