import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { Event } from "@/lib/types";

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from("events").select("*").order("event_date");
  const eventRows = (events ?? []) as Event[];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Church calendar</p>
          <h1 className="mt-4 text-4xl font-semibold">Upcoming gatherings, services, and ministry moments.</h1>
        </div>
        <div className="mt-10 grid gap-6">
          {!eventRows.length ? <EmptyState title="No events scheduled" description="Publish events from the dashboard to see them here." /> : null}
          {eventRows.map((event: Event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle>{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>{formatDate(event.event_date)}</p>
                <p>{event.description ?? "More details coming soon."}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
