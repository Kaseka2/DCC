import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { DonationsClient, type OfferingRow, type OfferingType } from "./donations-client";

type RawOfferingRow = {
  id: string;
  member_id: string | null;
  amount: number;
  date: string;
  notes: string | null;
  offering_types:
    | { name: string; requires_member: boolean }[]
    | { name: string; requires_member: boolean }
    | null;
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
    .select("id, member_id, amount, date, notes, offering_types(name, requires_member), members(full_name)")
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

  return (
    <DonationsClient
      members={members ?? []}
      offeringTypes={(offeringTypes as OfferingType[]) ?? []}
      offerings={normalizedOfferings}
      canManage={canManage}
    />
  );
}
