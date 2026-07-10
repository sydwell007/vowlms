import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Learner Account",
  description: "Create a VowLMS learner account.",
  robots: { index: false, follow: false },
};

export default function SignUpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
