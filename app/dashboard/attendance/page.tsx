import { AttendanceClient } from "@/components/attendance-client";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardAttendancePage() {
  await requireRoles(["admin", "secretary"]);

  const supabase = await createClient();
  const [{ data: members }, { data: events }] = await Promise.all([
    supabase.from("members").select("*").order("full_name"),
    supabase.from("events").select("*").order("event_date", { ascending: false }),
  ]);

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Attendance</h2>
      <p className="text-sm text-muted-foreground">Capture service participation and follow engagement trends over time.</p>
      <AttendanceClient members={members ?? []} events={events ?? []} />
    </div>
  );
}
