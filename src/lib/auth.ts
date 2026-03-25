import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type Role } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function getCurrentRole(): Promise<Role | null> {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (error || !data?.role) {
    return null;
  }

  return data.role as Role;
}

export async function requireRole(allowed: Role[], redirectTo = "/auth/login") {
  const role = await getCurrentRole();

  if (!role) {
    redirect(redirectTo);
  }

  if (!allowed.includes(role)) {
    redirect("/auth/login");
  }

  return role;
}
