import { Sidebar } from "@/components/sidebar";
import { type Role } from "@/lib/types";

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <Sidebar role={role} className="hidden lg:block" />
        <div className="flex flex-col">
          <header className="border-b border-border bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                  Role: {role}
                </p>
              </div>
            </div>
          </header>
          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
