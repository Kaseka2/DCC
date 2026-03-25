import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { MembersClient } from "./members-client";

export default async function MembersPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "secretary";

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name, username, phone, gender, created_at")
    .order("created_at", { ascending: false });

  return (
    <MembersClient members={members ?? []} canManage={canManage} />
  );
}
