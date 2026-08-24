import { VowHumanLessonEditor } from "@/components/admin/VowHumanLessonEditor";

export const metadata = {
  title: "AI Lesson Presenters | Admin",
};

type AdminLessonPresentersPageProps = {
  searchParams: Promise<{ lesson?: string }>;
};

const initialBusinessEthicsLesson =
  "module-1-business-ethics-fundamentals-module-reading-material";

export default async function AdminLessonPresentersPage({
  searchParams,
}: AdminLessonPresentersPageProps) {
  const params = await searchParams;

  return (
    <main className="premium-page min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1166c8]">
          VowLMS administration
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">AI lesson presenters</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          Assign approved VowHumans digital people as course presenters, mentors, tutors, or field experts. Learners always retain access to the ordinary lesson.
        </p>

        <VowHumanLessonEditor
          initialLessonSlug={params.lesson?.trim() || initialBusinessEthicsLesson}
        />
      </div>
    </main>
  );
}

