"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function createDonation(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const memberId = String(formData.get("member_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const type = String(formData.get("type") || "").trim();
  const paymentMethod = String(formData.get("payment_method") || "").trim();
  const date = String(formData.get("date") || "");

  if (!memberId || !amount || !type || !date) {
    return;
  }

  await supabase.from("donations").insert({
    member_id: memberId,
    amount,
    type,
    payment_method: paymentMethod || null,
    date,
  });

  revalidatePath("/dashboard/donations");
}

export async function updateDonation(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);

  const donationId = String(formData.get("donation_id") || "");
  const amount = Number(formData.get("amount") || 0);
  const type = String(formData.get("type") || "").trim();
  const paymentMethod = String(formData.get("payment_method") || "").trim();
  const date = String(formData.get("date") || "");

  if (!donationId || !amount || !type || !date) {
    return;
  }

  await supabase
    .from("donations")
    .update({
      amount,
      type,
      payment_method: paymentMethod || null,
      date,
    })
    .eq("id", donationId);

  revalidatePath("/dashboard/donations");
}

export async function deleteDonation(formData: FormData) {
  const supabase = await createSupabaseServerClient(true);
  const donationId = String(formData.get("donation_id") || "");

  if (!donationId) {
    return;
  }

  await supabase.from("donations").delete().eq("id", donationId);
  revalidatePath("/dashboard/donations");
}
