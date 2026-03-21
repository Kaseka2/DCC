import { getCurrentRole, getSessionUser } from "@/lib/auth";

export async function DashboardHeader() {
  const user = await getSessionUser();
  const role = await getCurrentRole();

  return (
    <div className="rounded-3xl border bg-warm-glow p-6 shadow-panel">
      <p className="text-sm uppercase tracking-[0.24em] text-accent">Operations Center</p>
      <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Welcome back{user?.email ? `, ${user.email}` : ""}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track members, stewardship, events, attendance, and digital ministry from one place.
          </p>
        </div>
        <div className="rounded-2xl border bg-card/90 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Signed in role: </span>
          <span className="font-semibold capitalize">{role ?? "unknown"}</span>
        </div>
      </div>
    </div>
  );
}
