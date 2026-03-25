import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export default function MemberPortal() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="space-y-6">
        <PageHeader
          title="Member Portal"
          description="Your personal space for church updates, attendance, and resources."
        />
        <Card>
          <CardHeader>
            <CardTitle>What’s next</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your attendance history, upcoming events, and sermon notes will
              appear here. If you need a profile update, contact your church
              administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
