"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createMember(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const fullName = String(formData.get("full_name") || "").trim();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const phone = String(formData.get("phone") || "").trim();
  const gender = String(formData.get("gender") || "").trim();

  if (!fullName || !username) {
    return;
  }

  await supabase.from("members").insert({
    full_name: fullName,
    username,
    phone: phone || null,
    gender: gender || null,
  });

  revalidatePath("/dashboard/members");
}

export async function updateMember(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const memberId = String(formData.get("member_id") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const gender = String(formData.get("gender") || "").trim();

  if (!memberId || !fullName) {
    return;
  }

  await supabase
    .from("members")
    .update({
      full_name: fullName,
      phone: phone || null,
      gender: gender || null,
    })
    .eq("id", memberId);

  revalidatePath("/dashboard/members");
}

export async function deleteMember(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const memberId = String(formData.get("member_id") || "");

  if (!memberId) {
    return;
  }

  await supabase.from("members").delete().eq("id", memberId);
  revalidatePath("/dashboard/members");
}
