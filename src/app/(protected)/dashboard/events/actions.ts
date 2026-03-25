"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const title = String(formData.get("title") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const startDate = String(formData.get("start_date") || "");
  const endDate = String(formData.get("end_date") || "");

  if (!title || !startDate) {
    return;
  }

  await supabase.from("events").insert({
    title,
    location: location || null,
    description: description || null,
    start_date: startDate,
    end_date: endDate || null,
  });

  revalidatePath("/dashboard/events");
}

export async function updateEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const eventId = String(formData.get("event_id") || "");
  const title = String(formData.get("title") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const startDate = String(formData.get("start_date") || "");
  const endDate = String(formData.get("end_date") || "");

  if (!eventId || !title || !startDate) {
    return;
  }

  await supabase
    .from("events")
    .update({
      title,
      location: location || null,
      description: description || null,
      start_date: startDate,
      end_date: endDate || null,
    })
    .eq("id", eventId);

  revalidatePath("/dashboard/events");
}

export async function deleteEvent(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const eventId = String(formData.get("event_id") || "");

  if (!eventId) {
    return;
  }

  await supabase.from("events").delete().eq("id", eventId);
  revalidatePath("/dashboard/events");
}
