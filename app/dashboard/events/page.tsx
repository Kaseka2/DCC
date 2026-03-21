import { requireRoles } from "@/lib/auth";
import { EventsClient } from "@/components/events-client";

export default async function DashboardEventsPage() {
  await requireRoles(["admin", "secretary"]);

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Events</h2>
      <p className="text-sm text-muted-foreground">Publish services, conferences, meetings, and outreach schedules.</p>
      <EventsClient />
    </div>
  );
}
