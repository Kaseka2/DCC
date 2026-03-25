import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { createMember, deleteMember, updateMember } from "./actions";

export default async function MembersPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "secretary";

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name, username, phone, gender, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <form action={createMember} className="grid gap-3 md:grid-cols-4">
              <Input name="full_name" placeholder="Full name" required />
              <Input name="username" placeholder="Username" required />
              <Input name="phone" placeholder="Phone" />
              <Select name="gender" defaultValue="">
                <option value="">Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </Select>
              <div className="md:col-span-4">
                <Button type="submit">Add Member</Button>
              </div>
            </form>
          )}

          <Table>
            <THead>
              <tr>
                <TH>Name</TH>
                <TH>Username</TH>
                <TH>Phone</TH>
                <TH>Gender</TH>
                {canManage && <TH>Actions</TH>}
              </tr>
            </THead>
            <TBody>
              {members?.map((member) => (
                <tr key={member.id}>
                  <TD>
                    {canManage ? (
                      <form
                        action={updateMember}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="member_id" value={member.id} />
                        <Input
                          name="full_name"
                          defaultValue={member.full_name ?? ""}
                          className="h-8"
                          required
                        />
                        <Input
                          name="phone"
                          defaultValue={member.phone ?? ""}
                          className="h-8"
                        />
                        <Select
                          name="gender"
                          defaultValue={member.gender ?? ""}
                          className="h-8"
                        >
                          <option value="">Gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </Select>
                        <Button size="sm" type="submit" variant="secondary">
                          Save
                        </Button>
                      </form>
                    ) : (
                      member.full_name
                    )}
                  </TD>
                  <TD>{member.username}</TD>
                  <TD>{member.phone ?? "-"}</TD>
                  <TD>{member.gender ?? "-"}</TD>
                  {canManage && (
                    <TD>
                      <form action={deleteMember}>
                        <input type="hidden" name="member_id" value={member.id} />
                        <Button size="sm" type="submit" variant="destructive">
                          Delete
                        </Button>
                      </form>
                    </TD>
                  )}
                </tr>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
