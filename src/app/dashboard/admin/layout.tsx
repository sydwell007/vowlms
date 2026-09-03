import { redirect } from "next/navigation";
import { getServerRole } from "@/lib/auth/getServerRole";

/**
 * Real enforcement point for /dashboard/admin/* — none existed before this.
 * `src/proxy.ts` only checks that a session cookie is present, not the role
 * it carries, so every admin page previously rendered for any signed-in user
 * and relied entirely on the bridge's own 401/403 to keep data out.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getServerRole();

  if (!role) {
    redirect("/auth/signin");
  }

  if (role !== "admin") {
    redirect(`/dashboard/${role}`);
  }

  return children;
}
