"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Course } from "@/types/lms";

type Props = { course: Course };

type Enrollment = {
  courseSlug?: string;
  course_slug?: string;
  status?: string;
};

type PaymentData = {
  formAction?: string;
  formFields?: Record<string, string | number>;
  redirectUrl?: string;
};

function firstLessonHref(course: Course) {
  const slug = course.modules[0]?.lessons[0]?.slug;
  return slug ? `/lesson/${slug}` : `/courses/${course.slug}`;
}

export function EnrollButton({ course }: Props) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/enrollments", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => (response.ok ? response.json() : null))
      .then((payload) => {
        const enrollments = (payload?.data ?? []) as Enrollment[];
        setEnrolled(
          enrollments.some(
            (item) =>
              (item.courseSlug ?? item.course_slug) === course.slug &&
              item.status !== "cancelled",
          ),
        );
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, [course.slug]);

  async function requireSession() {
    const response = await fetch("/api/auth/me", {
      cache: "no-store",
      credentials: "same-origin",
    });

    if (response.ok) return true;

    const returnTo = encodeURIComponent(`/courses/${course.slug}`);
    router.push(`/auth/signin?returnTo=${returnTo}`);
    return false;
  }

  function submitPayment(data: PaymentData) {
    if (!data.formAction || !data.formFields) {
      if (data.redirectUrl) router.push(data.redirectUrl);
      else toast.error("Payment is not available for this course yet.");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = data.formAction;

    for (const [name, value] of Object.entries(data.formFields)) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = String(value);
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  }

  async function handleEnroll() {
    if (enrolled) {
      router.push(firstLessonHref(course));
      return;
    }

    setLoading(true);

    try {
      if (!(await requireSession())) return;

      if (course.price > 0) {
        const paymentResponse = await fetch("/api/payments/payfast/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ courseSlug: course.slug }),
        });
        const payment = await paymentResponse.json();

        if (!paymentResponse.ok || !payment.ok) {
          throw new Error(payment.error ?? "Payment could not be started.");
        }

        submitPayment(payment.data as PaymentData);
        return;
      }

      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ courseSlug: course.slug }),
      });
      const payload = await response.json();

      if (response.status === 401) {
        const returnTo = encodeURIComponent(`/courses/${course.slug}`);
        router.push(`/auth/signin?returnTo=${returnTo}`);
        return;
      }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Enrolment could not be completed.");
      }

      setEnrolled(true);
      toast.success(`You are enrolled in ${course.title}.`, {
        description: "Your first lesson is ready.",
        action: {
          label: "Start",
          onClick: () => router.push(firstLessonHref(course)),
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleEnroll}
      disabled={loading}
      className={`w-full rounded-xl px-6 py-3 text-center text-sm font-semibold transition ${
        enrolled
          ? "bg-[#06111f] text-white hover:bg-[#0d2239]"
          : "bg-gold text-[#06111f] shadow-[0_10px_24px_rgba(245,197,66,0.25)] hover:bg-[#e8b830]"
      } disabled:cursor-wait disabled:opacity-60`}
    >
      {loading
        ? "Please wait..."
        : enrolled
          ? "Continue learning"
          : course.price === 0
            ? "Enrol free"
            : `Enrol - R${course.price}`}
    </button>
  );
}
