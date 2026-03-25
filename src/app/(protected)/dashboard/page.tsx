import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ count: membersCount }, { data: offerings }, { count: eventsCount }] =
    await Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }),
      supabase.from("offerings").select("amount"),
      supabase.from("events").select("id", { count: "exact", head: true }),
    ]);

  const totalDonations =
    offerings?.reduce((sum, row) => sum + Number(row.amount || 0), 0) ?? 0;

  return (
    <DashboardClient
      membersCount={membersCount ?? 0}
      totalDonations={totalDonations}
      eventsCount={eventsCount ?? 0}
    />
  );
}
