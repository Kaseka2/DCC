import { DashboardCharts } from "@/components/charts";
import { StatCard } from "@/components/stat-card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: memberCount }, { data: donations }, { data: attendance }, { count: eventCount }] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }),
    supabase.from("donations").select("*"),
    supabase.from("attendance").select("*"),
    supabase.from("events").select("*", { count: "exact", head: true }),
  ]);

  const totalGiving = (donations ?? []).reduce((sum, item) => sum + Number(item.amount), 0);

  const givingData = Object.values(
    (donations ?? []).reduce<Record<string, { label: string; total: number }>>((acc, item) => {
      const label = new Date(item.date).toLocaleString("en-US", { month: "short" });
      acc[label] ??= { label, total: 0 };
      acc[label].total += Number(item.amount);
      return acc;
    }, {}),
  );

  const attendanceData = Object.values(
    (attendance ?? []).reduce<Record<string, { label: string; count: number }>>((acc, item) => {
      const label = new Date(item.created_at).toLocaleString("en-US", { month: "short" });
      acc[label] ??= { label, count: 0 };
      if (item.status === "present") acc[label].count += 1;
      return acc;
    }, {}),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total members" value={String(memberCount ?? 0)} hint="Active records in the congregation directory." />
        <StatCard label="Total giving" value={formatCurrency(totalGiving)} hint="Combined tithes, offerings, and pledges." />
        <StatCard label="Attendance rows" value={String(attendance?.length ?? 0)} hint="Attendance entries captured across events." />
        <StatCard label="Scheduled events" value={String(eventCount ?? 0)} hint="Upcoming services, meetings, and outreach moments." />
      </div>
      <DashboardCharts givingData={givingData} attendanceData={attendanceData} />
    </div>
  );
}
