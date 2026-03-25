"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createOfferingType(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const requiresMember = Boolean(formData.get("requires_member"));

  if (!name) {
    return;
  }

  await supabase.from("offering_types").insert({
    name,
    description: description || null,
    requires_member: requiresMember,
  });

  revalidatePath("/dashboard/donations");
}

export async function createOffering(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const offeringTypeId = String(formData.get("offering_type_id") || "");
  const memberId = String(formData.get("member_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const date = String(formData.get("date") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!offeringTypeId || !amount || !date) {
    return;
  }

  await supabase.from("offerings").insert({
    offering_type_id: offeringTypeId,
    member_id: memberId || null,
    amount,
    date,
    notes: notes || null,
  });

  revalidatePath("/dashboard/donations");
}

export async function updateOffering(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const offeringId = String(formData.get("offering_id") || "");
  const memberId = String(formData.get("member_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const date = String(formData.get("date") || "");
  const notes = String(formData.get("notes") || "").trim();

  if (!offeringId || !amount || !date) {
    return;
  }

  await supabase
    .from("offerings")
    .update({
      member_id: memberId || null,
      amount,
      date,
      notes: notes || null,
    })
    .eq("id", offeringId);

  revalidatePath("/dashboard/donations");
}

export async function deleteOffering(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const offeringId = String(formData.get("offering_id") || "");

  if (!offeringId) {
    return;
  }

  await supabase.from("offerings").delete().eq("id", offeringId);
  revalidatePath("/dashboard/donations");
}
