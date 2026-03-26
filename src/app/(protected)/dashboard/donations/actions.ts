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

export async function updateOfferingType(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const typeId = String(formData.get("type_id") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const requiresMember = Boolean(formData.get("requires_member"));

  if (!typeId || !name) {
    return;
  }

  await supabase
    .from("offering_types")
    .update({
      name,
      description: description || null,
      requires_member: requiresMember,
    })
    .eq("id", typeId);

  revalidatePath("/dashboard/donations");
}

export async function deleteOfferingType(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const typeId = String(formData.get("type_id") || "");

  if (!typeId) {
    return;
  }

  const { count } = await supabase
    .from("offerings")
    .select("id", { count: "exact", head: true })
    .eq("offering_type_id", typeId);

  if (count && count > 0) {
    return;
  }

  await supabase.from("offering_types").delete().eq("id", typeId);
  revalidatePath("/dashboard/donations");
}

export async function createOffering(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const offeringTypeId = String(formData.get("offering_type_id") || "");
  const memberId = String(formData.get("member_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const date = String(formData.get("date") || "");
  const serviceName = String(formData.get("service_name") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  if (!offeringTypeId || !amount || !date) {
    return;
  }

  await supabase.from("offerings").insert({
    offering_type_id: offeringTypeId,
    member_id: memberId || null,
    amount,
    date,
    service_name: serviceName || null,
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
  const serviceName = String(formData.get("service_name") || "").trim();
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
      service_name: serviceName || null,
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

export async function createPledge(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const memberId = String(formData.get("member_id") || "");
  const pledgerName = String(formData.get("pledger_name") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const purpose = String(formData.get("purpose") || "").trim();
  const date = String(formData.get("date") || "");
  const status = String(formData.get("status") || "open");
  const notes = String(formData.get("notes") || "").trim();

  if (!amount || !date || (!memberId && !pledgerName)) {
    return;
  }

  await supabase.from("pledges").insert({
    member_id: memberId || null,
    pledger_name: memberId ? null : pledgerName,
    amount,
    purpose: purpose || null,
    date,
    status,
    notes: notes || null,
  });

  revalidatePath("/dashboard/donations");
}

export async function updatePledge(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const pledgeId = String(formData.get("pledge_id") || "");
  const memberId = String(formData.get("member_id") || "");
  const pledgerName = String(formData.get("pledger_name") || "").trim();
  const amount = Number(formData.get("amount") || 0);
  const purpose = String(formData.get("purpose") || "").trim();
  const date = String(formData.get("date") || "");
  const status = String(formData.get("status") || "open");
  const notes = String(formData.get("notes") || "").trim();

  if (!pledgeId || !amount || !date || (!memberId && !pledgerName)) {
    return;
  }

  await supabase
    .from("pledges")
    .update({
      member_id: memberId || null,
      pledger_name: memberId ? null : pledgerName,
      amount,
      purpose: purpose || null,
      date,
      status,
      notes: notes || null,
    })
    .eq("id", pledgeId);

  revalidatePath("/dashboard/donations");
}

export async function deletePledge(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const pledgeId = String(formData.get("pledge_id") || "");

  if (!pledgeId) {
    return;
  }

  await supabase.from("pledges").delete().eq("id", pledgeId);
  revalidatePath("/dashboard/donations");
}
