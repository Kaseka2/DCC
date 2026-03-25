"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createSermon(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const title = String(formData.get("title") || "").trim();
  const preacher = String(formData.get("preacher") || "").trim();
  const date = String(formData.get("date") || "");
  const summary = String(formData.get("summary") || "").trim();

  if (!title || !preacher || !date) {
    return;
  }

  await supabase.from("sermons").insert({
    title,
    preacher,
    date,
    summary: summary || null,
  });

  revalidatePath("/dashboard/sermons");
}

export async function updateSermon(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const sermonId = String(formData.get("sermon_id") || "");
  const title = String(formData.get("title") || "").trim();
  const preacher = String(formData.get("preacher") || "").trim();
  const date = String(formData.get("date") || "");
  const summary = String(formData.get("summary") || "").trim();

  if (!sermonId || !title || !preacher || !date) {
    return;
  }

  await supabase
    .from("sermons")
    .update({
      title,
      preacher,
      date,
      summary: summary || null,
    })
    .eq("id", sermonId);

  revalidatePath("/dashboard/sermons");
}

export async function deleteSermon(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const sermonId = String(formData.get("sermon_id") || "");

  if (!sermonId) {
    return;
  }

  await supabase.from("sermons").delete().eq("id", sermonId);
  revalidatePath("/dashboard/sermons");
}
