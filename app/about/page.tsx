import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">About ChurchFlow</p>
          <h1 className="mt-4 text-4xl font-semibold">A digital foundation for ministry teams and congregations.</h1>
          <p className="mt-6 text-lg text-muted-foreground">
            This CMS is designed for churches that want one connected platform for administration, communication,
            stewardship, and member care.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {["Mission", "Operations", "Security"].map((title) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {title === "Mission" && "Support discipleship, hospitality, and pastoral care through organized systems."}
                {title === "Operations" && "Equip staff and volunteers with clear workflows for records, finances, and events."}
                {title === "Security" && "Protect member data with Supabase Auth, Row Level Security, and role-based access."}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
