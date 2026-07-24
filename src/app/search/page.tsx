import { SearchClient } from "@/components/search/SearchClient";
import { getAcademies, getCourseSummaries } from "@/lib/data";

export const metadata = {
  title: "Search",
  description: "Search GoalVow academies and VowLMS courses.",
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  return (
    <SearchClient
      academies={getAcademies()}
      courses={getCourseSummaries()}
      initialQuery={params.q?.trim() ?? ""}
    />
  );
}
