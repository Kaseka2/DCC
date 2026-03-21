import { LogoutButton } from "@/components/logout-button";
import { PortalClient } from "@/components/portal-client";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function PortalPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: member } = await supabase.from("members").select("*").eq("user_id", user.id).maybeSingle();

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between rounded-3xl border bg-card p-6 shadow-panel">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-accent">Member portal</p>
            <h1 className="mt-2 text-3xl font-semibold">Your church profile and giving history</h1>
          </div>
          <LogoutButton />
        </div>
        <PortalClient member={member} />
      </div>
    </main>
  );
}
