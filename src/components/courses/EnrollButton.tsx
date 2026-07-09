"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Course } from "@/types/lms";

type Props = { course: Course };

export function EnrollButton({ course }: Props) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      const enrollments = JSON.parse(localStorage.getItem("vowlms_enrollments") ?? "[]") as string[];
      setEnrolled(enrollments.includes(course.slug));
    });
    return () => {
      cancelled = true;
    };
  }, [course.slug]);

  async function handleEnroll() {
    if (enrolled) {
      router.push(`/lesson/${course.modules[0]?.lessons[0]?.slug}`);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const enrollments = JSON.parse(localStorage.getItem("vowlms_enrollments") ?? "[]") as string[];
    if (!enrollments.includes(course.slug)) {
      enrollments.push(course.slug);
    }
    localStorage.setItem("vowlms_enrollments", JSON.stringify(enrollments));
    setEnrolled(true);
    setLoading(false);

    toast.success(`Enrolled in ${course.title}!`, {
      description: "Your first lesson is ready to start.",
      action: {
        label: "Start now",
        onClick: () => router.push(`/lesson/${course.modules[0]?.lessons[0]?.slug}`),
      },
    });
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition text-center ${
        enrolled
          ? "bg-[#06111f] text-white hover:bg-[#0d2239]"
          : "bg-gold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] hover:bg-[#e8b830]"
      } disabled:opacity-60`}
    >
      {loading ? "Enrolling…" : enrolled ? "▶ Continue learning" : course.price === 0 ? "Enrol free" : `Enrol — R${course.price}`}
    </button>
  );
}
