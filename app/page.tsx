import Link from "next/link";
import { ArrowRight, Calendar, HeartHandshake, Landmark, PlayCircle } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Member care",
    description: "Centralized profiles, ministry assignment, and pastoral oversight.",
    icon: HeartHandshake,
  },
  {
    title: "Stewardship",
    description: "Track tithes, offerings, pledges, and trend reporting with confidence.",
    icon: Landmark,
  },
  {
    title: "Church life",
    description: "Manage services, events, attendance, sermons, and community updates.",
    icon: Calendar,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-accent">Church management, reimagined</p>
            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight text-foreground">
              Run ministry operations and your public church website from one modern platform.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              ChurchFlow combines member records, donations, attendance, events, sermons, and secure portals in a
              production-ready Next.js and Supabase stack.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/auth/login">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/sermons">Explore sermons</Link>
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden border-0 bg-warm-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <PlayCircle className="h-6 w-6 text-accent" />
                Platform snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border bg-card p-4">
                Admin dashboard with role-based access for pastors, treasurers, and secretaries.
              </div>
              <div className="rounded-2xl border bg-card p-4">
                Public pages for events, sermons, and visitor engagement.
              </div>
              <div className="rounded-2xl border bg-card p-4">
                Member portal with profile visibility, giving history, and prayer requests.
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <Card key={item.title}>
                <CardHeader>
                  <item.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="mt-4">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{item.description}</CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
