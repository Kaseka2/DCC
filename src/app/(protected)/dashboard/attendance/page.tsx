import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { createAttendance, deleteAttendance, updateAttendance } from "./actions";

type AttendanceRow = {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  members: { full_name: string } | null;
  events: { title: string } | null;
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track service attendance, event participation, and follow-up."
      />
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">Log attendance</p>
              <form action={createAttendance} className="mt-3 grid gap-3 md:grid-cols-5">
                <Select name="member_id" required defaultValue="">
                  <option value="" disabled>
                    Member
                  </option>
                  {members?.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </Select>
                <Select name="event_id" defaultValue="">
                  <option value="">Service / Event</option>
                  {events?.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </Select>
                <Input name="date" type="date" required />
                <Select name="status" required defaultValue="present">
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="excused">Excused</option>
                </Select>
                <Input name="notes" placeholder="Notes" />
                <div className="md:col-span-5">
                  <Button type="submit">Add Record</Button>
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>Member</TH>
                <TH>Event</TH>
                <TH>Date</TH>
                <TH>Status</TH>
                <TH>Notes</TH>
                {canManage && <TH>Actions</TH>}
              </tr>
            </THead>
            <TBody>
              {(attendance as AttendanceRow[] | null)?.map((row) => (
                <tr key={row.id}>
                  <TD>{row.members?.full_name ?? "Unknown"}</TD>
                  <TD>{row.events?.title ?? "Service"}</TD>
                  <TD>{row.date}</TD>
                  <TD>{row.status}</TD>
                  <TD>{row.notes ?? "-"}</TD>
                  {canManage && (
                    <TD>
                      <div className="flex flex-col gap-2">
                        <form action={updateAttendance} className="flex items-center gap-2">
                          <input type="hidden" name="attendance_id" value={row.id} />
                          <Select name="status" defaultValue={row.status} className="h-8">
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="excused">Excused</option>
                          </Select>
                          <Input name="notes" defaultValue={row.notes ?? ""} className="h-8" />
                          <Button size="sm" type="submit" variant="secondary">
                            Save
                          </Button>
                        </form>
                        <form action={deleteAttendance}>
                          <input type="hidden" name="attendance_id" value={row.id} />
                          <Button size="sm" type="submit" variant="destructive">
                            Delete
                          </Button>
                        </form>
                      </div>
                    </TD>
                  )}
                </tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
