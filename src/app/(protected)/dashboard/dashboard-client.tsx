"use client";

import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

export function DashboardClient({
  membersCount,
  totalDonations,
  eventsCount,
}: {
  membersCount: number;
  totalDonations: number;
  eventsCount: number;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <PageHeader title={t("overview")} description={t("overviewSubtitle")} />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label={t("memberCount")} value={String(membersCount)} helper={t("activeProfiles")} />
        <StatCard
          label={t("totalGiving")}
          value={totalDonations.toLocaleString(undefined, {
            style: "currency",
            currency: "TZS",
          })}
          helper={t("recordedDonations")}
        />
        <StatCard label={t("upcomingEvents")} value={String(eventsCount)} helper={t("onCalendar")} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("nextSteps")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t("nextStepsBody")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
