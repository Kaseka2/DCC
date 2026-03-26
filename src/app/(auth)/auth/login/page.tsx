"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { usernameToEmail, normalizeUsername } from "@/lib/username";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#3a1457_0%,_#1b0a2c_45%,_#0d0718_100%)] px-4 py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 text-white shadow-[0_24px_60px_rgba(7,4,14,0.6)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-[var(--surface-muted)]">
              <Image
                src="/logo.png"
                alt="TAG DCC"
                fill
                className="object-cover"
                sizes="48px"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                TAG DCC
              </p>
              <p className="text-sm text-white/70">
                Church Management System
              </p>
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-semibold">
            {t("loginHeadline")}
          </h1>
          <p className="mt-3 text-sm text-white/70">
            {t("loginSubtitle")}
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/70">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
              {t("loginFeatureOne")}
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
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
              <Button className="w-full" isLoading={isLoading} type="submit">
                {isLoading && <Spinner className="h-4 w-4" />}
                {isLoading ? "Signing in..." : t("signIn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
