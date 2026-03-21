"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Database, Event } from "@/lib/types";

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

export function useEvents() {
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setEvents(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (payload: EventInsert) => {
    const { error: insertError } = await supabase.from("events").insert(payload);
    if (insertError) {
      throw new Error(insertError.message);
    }
    await fetchEvents();
  };

  const updateEvent = async (id: string, payload: EventUpdate) => {
    const { error: updateError } = await supabase.from("events").update(payload).eq("id", id);
    if (updateError) {
      throw new Error(updateError.message);
    }
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    const { error: deleteError } = await supabase.from("events").delete().eq("id", id);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
    await fetchEvents();
  };

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
