"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import { createSermon, deleteSermon, updateSermon } from "./actions";

export type SermonRow = {
  id: string;
  title: string;
  preacher: string;
  date: string;
  summary: string | null;
};

export function SermonsClient({
  sermons,
  canManage,
}: {
  sermons: SermonRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader title={t("sermons")} description={t("sermonsSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("sermonLibrary")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">{t("addSermon")}</p>
              <form action={createSermon} className="mt-3 grid gap-3 md:grid-cols-4">
                <Input name="title" placeholder={t("title")} required />
                <Input name="preacher" placeholder={t("preacher")} required />
                <Input name="date" type="date" required />
                <Input name="summary" placeholder={t("summary")} />
                <div className="md:col-span-4">
                  <Button type="submit">{t("addSermon")}</Button>
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>{t("title")}</TH>
                <TH>{t("preacher")}</TH>
                <TH>{t("date")}</TH>
                <TH>{t("summary")}</TH>
                {canManage && <TH>{t("actions")}</TH>}
              </tr>
            </THead>
            <TBody>
              {sermons.map((sermon) => (
                <tr key={sermon.id}>
                  <TD>{sermon.title}</TD>
                  <TD>{sermon.preacher}</TD>
                  <TD>{sermon.date}</TD>
                  <TD>{sermon.summary ?? "-"}</TD>
                  {canManage && (
                    <TD>
                      <div className="flex flex-col gap-2">
                        <form action={updateSermon} className="grid grid-cols-4 gap-2">
                          <input type="hidden" name="sermon_id" value={sermon.id} />
                          <Input name="title" defaultValue={sermon.title} className="h-8" />
                          <Input name="preacher" defaultValue={sermon.preacher} className="h-8" />
                          <Input name="date" type="date" defaultValue={sermon.date} className="h-8" />
                          <Input name="summary" defaultValue={sermon.summary ?? ""} className="h-8" />
                          <Button size="sm" type="submit" variant="secondary">
                            {t("save")}
                          </Button>
                        </form>
                        <form action={deleteSermon}>
                          <input type="hidden" name="sermon_id" value={sermon.id} />
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
