"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

function normalizeCredentialToEmail(value: string) {
  const trimmed = value.trim().toLowerCase();
  return trimmed.includes("@") ? trimmed : `${trimmed}@churchflow.local`;
}

function getRedirectPath(role: string | null) {
  return role === "member" ? "/portal" : "/dashboard";
}

export function AuthForm() {
  const router = useRouter();
  const supabase = createClient();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const email = normalizeCredentialToEmail(identifier);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessage(error.message);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user?.id ?? "")
        .maybeSingle();

      router.push(getRedirectPath(profile?.role ?? null));
      router.refresh();
    } catch (error) {
      const friendlyMessage =
        error instanceof TypeError
          ? "Unable to reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, Email auth settings, and restart the dev server."
          : error instanceof Error
            ? error.message
          : "Something went wrong while contacting Supabase.";

      setMessage(friendlyMessage);
      console.error("Auth request failed", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Access is provisioned by an administrator. Sign in with the username and password you were given.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="identifier">Username or email</Label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Enter username or email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
