"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { usernameToEmail, normalizeUsername } from "@/lib/username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const email = usernameToEmail(username);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Invalid username or password.");
        return;
      }

      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        setError("Unable to load your session. Please log in again.");
        return;
      }

      const { data, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (roleError || !data?.role) {
        setError("Unable to load your role. Please contact an admin.");
        return;
      }

      const role = data.role;

      if (role === "member") {
        router.replace("/member");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f6f4f0] via-[#efe9df] to-[#e7dfd1] px-4 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-border bg-[var(--surface)] p-8 shadow-[0_24px_60px_rgba(22,18,11,0.12)]">
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            Church Management System
          </p>
          <h1 className="mt-4 text-3xl font-semibold">
            {t("loginHeadline")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("loginSubtitle")}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] px-4 py-3">
              {t("loginFeatureOne")}
            </div>
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] px-4 py-3">
              {t("loginFeatureTwo")}
            </div>
          </div>
        </div>
        <Card className="w-full max-w-md place-self-center">
          <CardHeader>
            <CardTitle>{t("signIn")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t("username")}</label>
                <Input
                  autoComplete="username"
                  value={username}
                  onChange={(event) =>
                    setUsername(normalizeUsername(event.target.value))
                  }
                  placeholder="e.g. john.doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">{t("password")}</label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              {error && (
                <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </div>
              )}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? "Signing in..." : t("signIn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
