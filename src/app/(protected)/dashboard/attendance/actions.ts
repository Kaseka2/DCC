"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createAttendance(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const memberId = String(formData.get("member_id") || "");
  const eventId = String(formData.get("event_id") || "");
  const date = String(formData.get("date") || "");
  const status = String(formData.get("status") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!memberId || !date || !status) {
    return;
  }

  await supabase.from("attendance").insert({
    member_id: memberId,
    event_id: eventId || null,
    date,
    status,
    notes: notes || null,
  });

  revalidatePath("/dashboard/attendance");
}

export async function updateAttendance(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const attendanceId = String(formData.get("attendance_id") || "");
  const status = String(formData.get("status") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!attendanceId || !status) {
    return;
  }

  await supabase
    .from("attendance")
    .update({ status, notes: notes || null })
    .eq("id", attendanceId);

  revalidatePath("/dashboard/attendance");
}

export async function deleteAttendance(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const attendanceId = String(formData.get("attendance_id") || "");

  if (!attendanceId) {
    return;
  }

  await supabase.from("attendance").delete().eq("id", attendanceId);
  revalidatePath("/dashboard/attendance");
}
