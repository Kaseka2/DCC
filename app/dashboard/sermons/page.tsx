import { requireRoles } from "@/lib/auth";
import { SermonsClient } from "@/components/sermons-client";

export default async function DashboardSermonsPage() {
  await requireRoles(["admin", "pastor"]);

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Sermons</h2>
      <p className="text-sm text-muted-foreground">Upload and organize sermon media for the public website.</p>
      <SermonsClient />
    </div>
  );
}
