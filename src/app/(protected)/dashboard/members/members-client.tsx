"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
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
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

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
                  <SubmitButton label={t("addMember")} pendingLabel="Adding..." />
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
                  <TD>{member.full_name}</TD>
                  <TD>{member.username}</TD>
                  <TD>{member.phone ?? "-"}</TD>
                  <TD>{member.gender ?? "-"}</TD>
                  {canManage && (
                    <TD>
                      {editingMemberId === member.id ? (
                        <div className="flex flex-col gap-2">
                          <form action={updateMember} className="grid grid-cols-4 gap-2">
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
                            <SubmitButton
                              size="sm"
                              variant="secondary"
                              label={t("save")}
                              pendingLabel="Saving..."
                            />
                            <button
                              type="button"
                              className="text-xs text-muted-foreground underline"
                              onClick={() => setEditingMemberId(null)}
                            >
                              {t("cancel")}
                            </button>
                          </form>
                          <form action={deleteMember}>
                            <input type="hidden" name="member_id" value={member.id} />
                            <SubmitButton
                              size="sm"
                              variant="destructive"
                              label={t("delete")}
                              pendingLabel="Deleting..."
                            />
                          </form>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="text-xs font-semibold text-primary underline"
                          onClick={() => setEditingMemberId(member.id)}
                        >
                          {t("edit")}
                        </button>
                      )}
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
