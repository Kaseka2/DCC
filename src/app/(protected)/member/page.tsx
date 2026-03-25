import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MemberPortal() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Member Portal</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Welcome to your member portal. Updates like attendance, sermons,
            and events will appear here soon.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
