import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/types";

const allowedRoles: Role[] = ["pastor", "treasurer", "secretary", "member"];

function normalizeUsername(username: string) {
  return username.trim().toLowerCase().replace(/\s+/g, ".");
}

function usernameToEmail(username: string) {
  return `${normalizeUsername(username)}@churchflow.local`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const { data: profile } = (await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()) as { data: { role: Role } | null };

  if (profile?.role !== "admin") {
    return NextResponse.json({ message: "Only admins can create users." }, { status: 403 });
  }

  const body = (await request.json()) as {
    fullName?: string;
    username?: string;
    password?: string;
    role?: Role;
  };

  const fullName = body.fullName?.trim();
  const username = body.username?.trim();
  const password = body.password?.trim();
  const role = body.role;

  if (!fullName || !username || !password || !role) {
    return NextResponse.json({ message: "Full name, username, password, and role are required." }, { status: 400 });
  }

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ message: "Invalid role selected." }, { status: 400 });
  }

  const adminClient = createAdminClient();
  const adminDb = adminClient as any;
  const email = usernameToEmail(username);

  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error || !data.user) {
    return NextResponse.json({ message: error?.message ?? "Unable to create user." }, { status: 400 });
  }

  await adminDb
    .from("users")
    .update({ role })
    .eq("id", data.user.id);
  await adminDb
    .from("members")
    .update({
      full_name: fullName,
      email,
    })
    .eq("user_id", data.user.id);

  return NextResponse.json({ message: "User created successfully." }, { status: 201 });
}
