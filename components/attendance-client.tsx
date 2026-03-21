"use client";

import { useEffect, useState } from "react";

import { attendanceStatuses } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import type { Attendance, Event, Member } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceClientProps {
  members: Member[];
  events: Event[];
}

export function AttendanceClient({ members, events }: AttendanceClientProps) {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const [memberId, setMemberId] = useState(members[0]?.id ?? "");
  const [status, setStatus] = useState<Attendance["status"]>("present");

  useEffect(() => {
    async function fetchAttendance() {
      const supabase = createClient();
      const { data } = await supabase.from("attendance").select("*").order("created_at", { ascending: false });
      setAttendance(data ?? []);
    }

    void fetchAttendance();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("attendance")
      .upsert({ event_id: eventId, member_id: memberId, status }, { onConflict: "member_id,event_id" })
      .select("*");

    if (!error && data) {
      const { data: latest } = await supabase.from("attendance").select("*").order("created_at", { ascending: false });
      setAttendance(latest ?? []);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Record attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Event</Label>
              <Select value={eventId} onValueChange={setEventId}>
                <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                <SelectContent>
                  {events.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Member</Label>
              <Select value={memberId} onValueChange={setMemberId}>
                <SelectTrigger><SelectValue placeholder="Select member" /></SelectTrigger>
                <SelectContent>
                  {members.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Attendance["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {attendanceStatuses.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Save attendance</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Recent attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{members.find((item) => item.id === entry.member_id)?.full_name ?? "Unknown"}</TableCell>
                  <TableCell>{events.find((item) => item.id === entry.event_id)?.title ?? "Unknown"}</TableCell>
                  <TableCell className="capitalize">{entry.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
