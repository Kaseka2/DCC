import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { EventsClient, type EventRow } from "./events-client";

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "secretary";

  const { data: events } = await supabase
    .from("events")
    .select("id, title, location, description, start_date, end_date")
    .order("start_date", { ascending: false });

  return (
    <EventsClient events={(events as EventRow[]) ?? []} canManage={canManage} />
  );
}
