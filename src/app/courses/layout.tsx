import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Course Catalogue",
  description: "Search and compare the current GoalVow academy course catalogue.",
};

export default function CoursesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
