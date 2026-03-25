import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard-shell";
import { getCurrentRole } from "@/lib/auth";
import { DASHBOARD_ROLES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getCurrentRole();

  if (!role) {
    redirect("/auth/login");
  }

  if (!DASHBOARD_ROLES.includes(role)) {
    redirect("/member");
  }

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
