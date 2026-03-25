"use client";

import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import { createAttendance, deleteAttendance, updateAttendance } from "./actions";

export type MemberOption = { id: string; full_name: string };
export type EventOption = { id: string; title: string };
export type AttendanceRow = {
  id: string;
  date: string;
  status: string;
  notes: string | null;
  members: { full_name: string } | null;
  events: { title: string } | null;
};

export function AttendanceClient({
  members,
  events,
  attendance,
  canManage,
}: {
  members: MemberOption[];
  events: EventOption[];
  attendance: AttendanceRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader title={t("attendance")} description={t("attendanceSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("attendanceRecords")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">{t("logAttendance")}</p>
              <form action={createAttendance} className="mt-3 grid gap-3 md:grid-cols-5">
                <Select name="member_id" required defaultValue="">
                  <option value="" disabled>
                    {t("member")}
                  </option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </Select>
                <Select name="event_id" defaultValue="">
                  <option value="">{t("event")}</option>
                  {events.map((event) => (
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
                <Input name="notes" placeholder={t("notes")} />
                <div className="md:col-span-5">
                  <SubmitButton label={t("addAttendance")} pendingLabel="Saving..." />
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>{t("member")}</TH>
                <TH>{t("event")}</TH>
                <TH>{t("date")}</TH>
                <TH>{t("status")}</TH>
                <TH>{t("notes")}</TH>
                {canManage && <TH>{t("actions")}</TH>}
              </tr>
            </THead>
            <TBody>
              {attendance.map((row) => (
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
                          <SubmitButton
                            size="sm"
                            variant="secondary"
                            label={t("save")}
                            pendingLabel="Saving..."
                          />
                        </form>
                        <form action={deleteAttendance}>
                          <input type="hidden" name="attendance_id" value={row.id} />
                          <SubmitButton
                            size="sm"
                            variant="destructive"
                            label={t("delete")}
                            pendingLabel="Deleting..."
                          />
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
