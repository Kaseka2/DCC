import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { normalizeUsername, usernameToEmail } from "@/lib/username";
import { type Role } from "@/lib/types";

const allowedRoles: Role[] = [
  "admin",
  "pastor",
  "secretary",
  "treasurer",
  "member",
];

async function ensureAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    return null;
  }

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (data?.role !== "admin") {
    return null;
  }

  return authData.user;
}

export async function GET() {
  const adminUser = await ensureAdmin();

  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminClient = createSupabaseAdminClient();

  const [{ data: roles, error: rolesError }, { data: members, error: membersError }] =
    await Promise.all([
      adminClient.from("users").select("id, role, created_at"),
      adminClient
        .from("members")
        .select("user_id, full_name, username, phone, email")
        .not("user_id", "is", null),
    ]);

  if (rolesError || membersError) {
    return NextResponse.json({ error: "Unable to load users." }, { status: 500 });
  }

  const rows = (roles ?? []).map((user) => {
    const member = members?.find((row) => row.user_id === user.id);
    return {
      id: user.id,
      role: user.role,
      created_at: user.created_at,
      full_name: member?.full_name ?? null,
      username: member?.username ?? null,
      phone: member?.phone ?? null,
      email: member?.email ?? null,
    };
  });

  return NextResponse.json({ data: rows });
}

export async function POST(request: Request) {
  const adminUser = await ensureAdmin();

  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as {
    full_name?: string;
    username?: string;
    password?: string;
    role?: Role;
    phone?: string;
  };

  const fullName = String(payload.full_name || "").trim();
  const username = normalizeUsername(String(payload.username || ""));
  const password = String(payload.password || "");
  const role = payload.role;
  const phone = String(payload.phone || "").trim();

  if (!fullName || !username || !password || !role) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  if (!allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Invalid role." }, { status: 400 });
  }

  const email = usernameToEmail(username);
  const adminClient = createSupabaseAdminClient();

  const { data: newUser, error: createError } =
    await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (createError || !newUser.user) {
    return NextResponse.json(
      { error: createError?.message ?? "Unable to create user." },
      { status: 500 }
    );
  }

  const userId = newUser.user.id;

  const { error: roleError } = await adminClient
    .from("users")
    .update({ role })
    .eq("id", userId);

  if (roleError) {
    return NextResponse.json(
      { error: "Unable to assign role." },
      { status: 500 }
    );
  }

  const { error: memberError } = await adminClient.from("members").insert({
    user_id: userId,
    full_name: fullName,
    username,
    phone: phone || null,
    email,
  });

  if (memberError) {
    return NextResponse.json(
      { error: "User created but member profile failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
