import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { DonationsClient, type OfferingRow, type OfferingType } from "./donations-client";

type RawOfferingRow = {
  id: string;
  offering_type_id: string;
  member_id: string | null;
  amount: number;
  date: string;
  service_name: string | null;
  notes: string | null;
  offering_types:
    | { name: string; requires_member: boolean }[]
    | { name: string; requires_member: boolean }
    | null;
  members: { full_name: string }[] | { full_name: string } | null;
};

type RawPledgeRow = {
  id: string;
  member_id: string | null;
  pledger_name: string | null;
  amount: number;
  purpose: string | null;
  date: string;
  status: string;
  notes: string | null;
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

  const { data: offeringTypes } = await supabase
    .from("offering_types")
    .select("id, name, description, requires_member")
    .order("name");

  const { data: offerings } = await supabase
    .from("offerings")
    .select("id, offering_type_id, member_id, amount, date, service_name, notes, offering_types(name, requires_member), members(full_name)")
    .order("date", { ascending: false });

  const { data: pledges } = await supabase
    .from("pledges")
    .select("id, member_id, pledger_name, amount, purpose, date, status, notes, members(full_name)")
    .order("date", { ascending: false });

  const normalizedOfferings: OfferingRow[] = (offerings as RawOfferingRow[] | null ?? []).map(
    (row) => ({
      ...row,
      offering_types: Array.isArray(row.offering_types)
        ? row.offering_types[0] ?? null
        : row.offering_types,
      members: Array.isArray(row.members) ? row.members[0] ?? null : row.members,
    })
  );

  const normalizedPledges = (pledges as RawPledgeRow[] | null ?? []).map(
    (row) => ({
      ...row,
      members: Array.isArray(row.members) ? row.members[0] ?? null : row.members,
    })
  );

  return (
    <DonationsClient
      members={members ?? []}
      offeringTypes={(offeringTypes as OfferingType[]) ?? []}
      offerings={normalizedOfferings}
      pledges={normalizedPledges}
      canManage={canManage}
    />
  );
}
