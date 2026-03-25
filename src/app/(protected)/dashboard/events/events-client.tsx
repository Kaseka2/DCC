"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import { createEvent, deleteEvent, updateEvent } from "./actions";

export type EventRow = {
  id: string;
  title: string;
  location: string | null;
  description: string | null;
  start_date: string;
  end_date: string | null;
};

export function EventsClient({
  events,
  canManage,
}: {
  events: EventRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader title={t("events")} description={t("eventsSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("eventCalendar")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">{t("createEvent")}</p>
              <form action={createEvent} className="mt-3 grid gap-3 md:grid-cols-5">
                <Input name="title" placeholder={t("title")} required />
                <Input name="location" placeholder={t("location")} />
                <Input name="description" placeholder={t("description")} />
                <Input name="start_date" type="date" required />
                <Input name="end_date" type="date" />
                <div className="md:col-span-5">
                  <Button type="submit">{t("addEvent")}</Button>
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>{t("title")}</TH>
                <TH>{t("location")}</TH>
                <TH>{t("description")}</TH>
                <TH>{t("start")}</TH>
                <TH>{t("end")}</TH>
                {canManage && <TH>{t("actions")}</TH>}
              </tr>
            </THead>
            <TBody>
              {events.map((event) => (
                <tr key={event.id}>
                  <TD>{event.title}</TD>
                  <TD>{event.location ?? "-"}</TD>
                  <TD>{event.description ?? "-"}</TD>
                  <TD>{event.start_date}</TD>
                  <TD>{event.end_date ?? "-"}</TD>
                  {canManage && (
                    <TD>
                      <div className="flex flex-col gap-2">
                        <form action={updateEvent} className="grid grid-cols-5 gap-2">
                          <input type="hidden" name="event_id" value={event.id} />
                          <Input name="title" defaultValue={event.title} className="h-8" />
                          <Input name="location" defaultValue={event.location ?? ""} className="h-8" />
                          <Input name="description" defaultValue={event.description ?? ""} className="h-8" />
                          <Input name="start_date" type="date" defaultValue={event.start_date} className="h-8" />
                          <Input name="end_date" type="date" defaultValue={event.end_date ?? ""} className="h-8" />
                          <Button size="sm" type="submit" variant="secondary">
                            {t("save")}
                          </Button>
                        </form>
                        <form action={deleteEvent}>
                          <input type="hidden" name="event_id" value={event.id} />
                          <Button size="sm" type="submit" variant="destructive">
                            {t("delete")}
                          </Button>
                        </form>
                      </div>
                    </TD>
                  )}
                </tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
