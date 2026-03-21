import { DonationsClient } from "@/components/donations-client";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardDonationsPage() {
  await requireRoles(["admin", "treasurer"]);

  const supabase = await createClient();
  const { data: members } = await supabase.from("members").select("*").order("full_name");

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Donations</h2>
      <p className="text-sm text-muted-foreground">Track giving records for stewardship, finance, and reporting.</p>
      <DonationsClient members={members ?? []} />
    </div>
  );
}
