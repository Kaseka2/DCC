import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentRole(): Promise<Role | null> {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return data?.role ?? null;
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/auth/login");
  }

  return user;
}

export async function requireRoles(roles: Role[]) {
  const user = await requireUser();
  const role = await getCurrentRole();

  if (!role || !roles.includes(role)) {
    redirect("/portal");
  }

  return { user, role };
}
