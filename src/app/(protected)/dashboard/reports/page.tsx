"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reports = [
  { label: "Members", type: "members", description: "Member directory export." },
  { label: "Donations", type: "donations", description: "Giving records export." },
  { label: "Attendance", type: "attendance", description: "Attendance records export." },
  { label: "Events", type: "events", description: "Event calendar export." },
  { label: "Sermons", type: "sermons", description: "Sermon library export." },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Exports"
        description="Download CSV exports for reporting and backups."
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
                Download CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
