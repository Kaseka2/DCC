import { getCurrentRole, requireRoles } from "@/lib/auth";
import { MembersClient } from "@/components/members-client";

export default async function DashboardMembersPage() {
  await requireRoles(["admin", "pastor", "secretary"]);
  const role = await getCurrentRole();

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Members</h2>
      <p className="text-sm text-muted-foreground">Manage member records, contact details, and ministry placement.</p>
      <MembersClient canManage={role !== "pastor"} />
    </div>
  );
}
