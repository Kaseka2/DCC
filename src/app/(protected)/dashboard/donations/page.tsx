import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { DonationsClient, type DonationRow } from "./donations-client";

type RawDonationRow = {
  id: string;
  amount: number;
  type: string;
  payment_method: string | null;
  date: string;
  members: { full_name: string }[] | { full_name: string } | null;
};

export default async function DonationsPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "treasurer";

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name")
    .order("full_name");

  const { data: donations } = await supabase
    .from("donations")
    .select("id, amount, type, payment_method, date, members(full_name)")
    .order("date", { ascending: false });

  const normalizedDonations: DonationRow[] = (donations as RawDonationRow[] | null ?? []).map(
    (row) => ({
      ...row,
      members: Array.isArray(row.members) ? row.members[0] ?? null : row.members,
    })
  );

  return (
    <DonationsClient
      members={members ?? []}
      donations={normalizedDonations}
      canManage={canManage}
    />
  );
}
