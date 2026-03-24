import { EmptyState } from "@/components/empty-state";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";
import type { Sermon } from "@/lib/types";

export default async function SermonsPage() {
  const supabase = await createClient();
  const { data: sermons } = await supabase.from("sermons").select("*").order("date", { ascending: false });
  const sermonRows = (sermons ?? []) as Sermon[];

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Sermon library</p>
          <h1 className="mt-4 text-4xl font-semibold">Messages and teachings available on demand.</h1>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {!sermonRows.length ? <EmptyState title="No sermons published" description="Upload sermons from the dashboard to populate this page." /> : null}
          {sermonRows.map((sermon: Sermon) => (
            <Card key={sermon.id}>
              <CardHeader>
                <CardTitle>{sermon.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Preacher: {sermon.preacher}</p>
                <p>Date: {formatDate(sermon.date)}</p>
                {sermon.media_url ? (
                  <a
                    href={sermon.media_url}
                    className="font-medium text-primary hover:text-primary/80"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch or listen
                  </a>
                ) : (
                  <p>Media link coming soon.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
