"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import { createMember, deleteMember, updateMember } from "./actions";

type MemberRow = {
  id: string;
  full_name: string;
  username: string;
  phone: string | null;
  gender: string | null;
};

export function MembersClient({
  members,
  canManage,
}: {
  members: MemberRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader title={t("members")} description={t("membersSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("memberDirectory")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">{t("addNewMember")}</p>
              <form action={createMember} className="mt-3 grid gap-3 md:grid-cols-4">
                <Input name="full_name" placeholder={t("fullName")} required />
                <Input name="username" placeholder={t("username")} required />
                <Input name="phone" placeholder={t("phone")} />
                <Select name="gender" defaultValue="">
                  <option value="">{t("gender")}</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </Select>
                <div className="md:col-span-4">
                  <Button type="submit">{t("addMember")}</Button>
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>{t("fullName")}</TH>
                <TH>{t("username")}</TH>
                <TH>{t("phone")}</TH>
                <TH>{t("gender")}</TH>
                {canManage && <TH>{t("actions")}</TH>}
              </tr>
            </THead>
            <TBody>
              {members.map((member) => (
                <tr key={member.id}>
                  <TD>
                    {canManage ? (
                      <form action={updateMember} className="flex items-center gap-2">
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
                          <option value="">{t("gender")}</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </Select>
                        <Button size="sm" type="submit" variant="secondary">
                          {t("save")}
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
                          {t("delete")}
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
