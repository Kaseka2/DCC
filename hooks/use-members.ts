"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Database, Member } from "@/lib/types";

type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];
type MemberUpdate = Database["public"]["Tables"]["members"]["Update"];

export function useMembers() {
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setMembers(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const createMember = async (payload: MemberInsert) => {
    const { error: insertError } = await supabase.from("members").insert(payload);
    if (insertError) {
      throw new Error(insertError.message);
    }
    await fetchMembers();
  };

  const updateMember = async (id: string, payload: MemberUpdate) => {
    const { error: updateError } = await supabase.from("members").update(payload).eq("id", id);
    if (updateError) {
      throw new Error(updateError.message);
    }
    await fetchMembers();
  };

  const deleteMember = async (id: string) => {
    const { error: deleteError } = await supabase.from("members").delete().eq("id", id);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
    await fetchMembers();
  };

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
    createMember,
    updateMember,
    deleteMember,
  };
}
