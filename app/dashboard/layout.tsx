import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { LogoutButton } from "@/components/logout-button";
import { requireRoles } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { role } = await requireRoles(["admin", "pastor", "treasurer", "secretary"]);

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex justify-end">
          <LogoutButton />
        </div>
        <DashboardHeader />
        <div className="flex flex-col gap-6 lg:flex-row">
          <DashboardSidebar role={role} />
          <div className="flex-1 space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
