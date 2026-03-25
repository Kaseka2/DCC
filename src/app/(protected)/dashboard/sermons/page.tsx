import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { createSermon, deleteSermon, updateSermon } from "./actions";

type SermonRow = {
  id: string;
  title: string;
  preacher: string;
  date: string;
  summary: string | null;
};

export default async function SermonsPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "pastor";

  const { data: sermons } = await supabase
    .from("sermons")
    .select("id, title, preacher, date, summary")
    .order("date", { ascending: false });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sermons"
        description="Archive sermons, notes, and teaching references."
      />
      <Card>
        <CardHeader>
          <CardTitle>Sermon Library</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">Add sermon</p>
              <form action={createSermon} className="mt-3 grid gap-3 md:grid-cols-4">
                <Input name="title" placeholder="Sermon title" required />
                <Input name="preacher" placeholder="Preacher" required />
                <Input name="date" type="date" required />
                <Input name="summary" placeholder="Summary" />
                <div className="md:col-span-4">
                  <Button type="submit">Add Sermon</Button>
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>Title</TH>
                <TH>Preacher</TH>
                <TH>Date</TH>
                <TH>Summary</TH>
                {canManage && <TH>Actions</TH>}
              </tr>
            </THead>
            <TBody>
              {(sermons as SermonRow[] | null)?.map((sermon) => (
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
                            Save
                          </Button>
                        </form>
                        <form action={deleteSermon}>
                          <input type="hidden" name="sermon_id" value={sermon.id} />
                          <Button size="sm" type="submit" variant="destructive">
                            Delete
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
