"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

export default function ReportsPage() {
  const { t } = useLanguage();
  const reports = [
    { label: t("members"), type: "members", description: t("reportsMembers") },
    { label: t("donations"), type: "donations", description: t("reportsDonations") },
    { label: t("attendance"), type: "attendance", description: t("reportsAttendance") },
    { label: t("events"), type: "events", description: t("reportsEvents") },
    { label: t("sermons"), type: "sermons", description: t("reportsSermons") },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("reportsExports")}
        description={t("reportsSubtitle")}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.type}>
            <CardHeader>
              <CardTitle>{report.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
              <Button
                onClick={() => {
                  window.location.href = `/api/reports/${report.type}`;
                }}
              >
                {t("downloadCsv")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
