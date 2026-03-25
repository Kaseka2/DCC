import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { AttendanceClient, type AttendanceRow } from "./attendance-client";

type RawAttendanceRow = {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  members: { full_name: string }[] | { full_name: string } | null;
  events: { title: string }[] | { title: string } | null;
};

export default async function AttendancePage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "secretary";

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name")
    .order("full_name");

  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .order("start_date", { ascending: false });

  const { data: attendance } = await supabase
    .from("attendance")
    .select("id, date, status, notes, members(full_name), events(title)")
    .order("date", { ascending: false });

  const normalizedAttendance: AttendanceRow[] = (attendance as RawAttendanceRow[] | null ?? []).map(
    (row) => ({
      ...row,
      members: Array.isArray(row.members) ? row.members[0] ?? null : row.members,
      events: Array.isArray(row.events) ? row.events[0] ?? null : row.events,
    })
  );

  return (
    <AttendanceClient
      members={members ?? []}
      events={events ?? []}
      attendance={normalizedAttendance}
      canManage={canManage}
    />
  );
}
