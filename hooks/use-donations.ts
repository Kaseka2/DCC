"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Database, Donation } from "@/lib/types";

type DonationInsert = Database["public"]["Tables"]["donations"]["Insert"];
type DonationUpdate = Database["public"]["Tables"]["donations"]["Update"];

export function useDonations() {
  const supabase = createClient();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("donations")
      .select("*")
      .order("date", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setDonations(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchDonations();
  }, [fetchDonations]);

  const createDonation = async (payload: DonationInsert) => {
    const { error: insertError } = await supabase.from("donations").insert(payload);
    if (insertError) {
      throw new Error(insertError.message);
    }
    await fetchDonations();
  };

  const updateDonation = async (id: string, payload: DonationUpdate) => {
    const { error: updateError } = await supabase.from("donations").update(payload).eq("id", id);
    if (updateError) {
      throw new Error(updateError.message);
    }
    await fetchDonations();
  };

  const deleteDonation = async (id: string) => {
    const { error: deleteError } = await supabase.from("donations").delete().eq("id", id);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
    await fetchDonations();
  };

  return {
    donations,
    loading,
    error,
    refetch: fetchDonations,
    createDonation,
    updateDonation,
    deleteDonation,
  };
}
