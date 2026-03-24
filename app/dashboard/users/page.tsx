import { AdminUsersClient } from "@/components/admin-users-client";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Member, Role } from "@/lib/types";

type UserRow = {
  id: string;
  role: Role;
  created_at: string;
};

function toUsername(email: string | null) {
  if (!email) return "unassigned";
  return email.endsWith("@churchflow.local") ? email.replace("@churchflow.local", "") : email;
}

export default async function DashboardUsersPage() {
  await requireRoles(["admin"]);
  const supabase = await createClient();

  const [{ data: users }, { data: members }] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }),
    supabase.from("members").select("user_id, full_name, email").not("user_id", "is", null),
  ]);

  const userRows = (users ?? []) as UserRow[];
  const memberRows = (members ?? []) as Pick<Member, "user_id" | "full_name" | "email">[];

  const managedUsers = userRows.map((user: UserRow) => {
    const member = memberRows.find((item) => item.user_id === user.id);
    return {
      id: user.id,
      role: user.role,
      created_at: user.created_at,
      full_name: member?.full_name ?? "Unknown user",
      email: member?.email ?? null,
      username: toUsername(member?.email ?? null),
    };
  });

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">Users</h2>
      <p className="text-sm text-muted-foreground">
        Admins create credentials here and assign roles before staff or members sign in.
      </p>
      <AdminUsersClient users={managedUsers} />
    </div>
  );
}
