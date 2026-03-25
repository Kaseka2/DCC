import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { SermonsClient, type SermonRow } from "./sermons-client";

export default async function SermonsPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "pastor";

  const { data: sermons } = await supabase
    .from("sermons")
    .select("id, title, preacher, date, summary")
    .order("date", { ascending: false });

  return (
    <SermonsClient sermons={(sermons as SermonRow[]) ?? []} canManage={canManage} />
  );
}
