import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [{ count: membersCount }, { data: donations }, { count: eventsCount }] =
    await Promise.all([
      supabase.from("members").select("id", { count: "exact", head: true }),
      supabase.from("donations").select("amount"),
      supabase.from("events").select("id", { count: "exact", head: true }),
    ]);

  const totalDonations =
    donations?.reduce((sum, row) => sum + Number(row.amount || 0), 0) ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Quick insights across the ministry, giving, and planning."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Members"
          value={String(membersCount ?? 0)}
          helper="Active profiles"
        />
        <StatCard
          label="Total Giving"
          value={totalDonations.toLocaleString(undefined, {
            style: "currency",
            currency: "TZS",
          })}
          helper="Recorded donations"
        />
        <StatCard
          label="Upcoming Events"
          value={String(eventsCount ?? 0)}
          helper="On the calendar"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use the sidebar to manage members, attendance, events, sermons, and
            donations. Reports and exports are ready for admin review.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
