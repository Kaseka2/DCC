"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import {
  createOffering,
  createOfferingType,
  deleteOffering,
  updateOffering,
} from "./actions";

export type MemberOption = { id: string; full_name: string };
export type OfferingType = {
  id: string;
  name: string;
  description: string | null;
  requires_member: boolean;
};
export type OfferingRow = {
  id: string;
  member_id: string | null;
  amount: number;
  date: string;
  notes: string | null;
  offering_types: { name: string; requires_member: boolean } | null;
  members: { full_name: string } | null;
};

export function DonationsClient({
  members,
  offeringTypes,
  offerings,
  canManage,
}: {
  members: MemberOption[];
  offeringTypes: OfferingType[];
  offerings: OfferingRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();
  const [selectedTypeId, setSelectedTypeId] = useState(
    offeringTypes[0]?.id ?? ""
  );

  const selectedType = offeringTypes.find(
    (type) => type.id === selectedTypeId
  );

  const totalsByType = useMemo(() => {
    return offerings.reduce<Record<string, number>>((acc, row) => {
      const key = row.offering_types?.name ?? "Unknown";
      acc[key] = (acc[key] ?? 0) + Number(row.amount || 0);
      return acc;
    }, {});
  }, [offerings]);

  const groupedOfferings = useMemo(() => {
    return offerings.reduce<Record<string, OfferingRow[]>>((acc, row) => {
      const key = row.offering_types?.name ?? "Unknown";
      acc[key] = acc[key] ?? [];
      acc[key].push(row);
      return acc;
    }, {});
  }, [offerings]);

  return (
    <div className="space-y-6">
      <PageHeader title={t("donations")} description={t("donationsSubtitle")} />
      <Card>
        <CardHeader>
          <CardTitle>{t("givingRecords")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <div className="rounded-2xl border border-border bg-[var(--surface-muted)] p-4">
              <p className="text-sm font-semibold">{t("recordDonation")}</p>
              <form action={createOffering} className="mt-3 grid gap-3 md:grid-cols-6">
                <Select
                  name="offering_type_id"
                  required
                  value={selectedTypeId}
                  onChange={(event) => setSelectedTypeId(event.target.value)}
                >
                  {offeringTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                <Select
                  name="member_id"
                  defaultValue=""
                  disabled={selectedType?.requires_member === false}
                >
                  <option value="">{t("member")}</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name}
                    </option>
                  ))}
                </Select>
                <Input
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={t("amount")}
                  required
                />
                <Input name="date" type="date" required />
                <Input name="notes" placeholder={t("notesLabel")} />
                <div className="md:col-span-6">
                  <SubmitButton label={t("addDonation")} pendingLabel="Saving..." />
                </div>
              </form>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{t("offeringTotals")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {Object.entries(totalsByType).map(([type, total]) => (
                  <div key={type} className="rounded-xl border border-border bg-[var(--surface)] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {type}
                    </p>
                    <p className="mt-2 text-lg font-semibold">
                      {total.toLocaleString(undefined, {
                        style: "currency",
                        currency: "TZS",
                      })}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {Object.entries(groupedOfferings).map(([typeName, rows]) => (
            <div key={typeName} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{typeName}</h3>
                <span className="text-sm text-muted-foreground">
                  {rows.reduce((sum, row) => sum + Number(row.amount || 0), 0).toLocaleString(undefined, {
                    style: "currency",
                    currency: "TZS",
                  })}
                </span>
              </div>
              <Table>
                <THead>
                  <tr>
                    <TH>{t("member")}</TH>
                    <TH>{t("amount")}</TH>
                    <TH>{t("date")}</TH>
                    <TH>{t("notes")}</TH>
                    {canManage && <TH>{t("actions")}</TH>}
                  </tr>
                </THead>
                <TBody>
                  {rows.map((offering) => (
                    <tr key={offering.id}>
                      <TD>{offering.members?.full_name ?? "-"}</TD>
                      <TD>{offering.amount.toFixed(2)}</TD>
                      <TD>{offering.date}</TD>
                      <TD>{offering.notes ?? "-"}</TD>
                      {canManage && (
                        <TD>
                          <div className="flex flex-col gap-2">
                            <form action={updateOffering} className="grid grid-cols-4 gap-2">
                              <input type="hidden" name="offering_id" value={offering.id} />
                              <Select
                                name="member_id"
                                defaultValue={offering.member_id ?? ""}
                                className="h-8"
                                disabled={offering.offering_types?.requires_member === false}
                              >
                                <option value="">{t("member")}</option>
                                {members.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.full_name}
                                  </option>
                                ))}
                              </Select>
                              <Input
                                name="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={offering.amount}
                                className="h-8"
                                required
                              />
                              <Input
                                name="date"
                                type="date"
                                defaultValue={offering.date}
                                className="h-8"
                                required
                              />
                              <Input
                                name="notes"
                                defaultValue={offering.notes ?? ""}
                                className="h-8"
                              />
                              <SubmitButton
                                size="sm"
                                variant="secondary"
                                label={t("save")}
                                pendingLabel="Saving..."
                              />
                            </form>
                            <form action={deleteOffering}>
                              <input type="hidden" name="offering_id" value={offering.id} />
                              <SubmitButton
                                size="sm"
                                variant="destructive"
                                label={t("delete")}
                                pendingLabel="Deleting..."
                              />
                            </form>
                          </div>
                        </TD>
                      )}
                    </tr>
                  ))}
                </TBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>{t("offeringTypes")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createOfferingType} className="grid gap-3 md:grid-cols-4">
              <Input name="name" placeholder={t("offeringType")} required />
              <Input name="description" placeholder={t("description")} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="requires_member" defaultChecked />
                {t("requiresMember")}
              </label>
              <SubmitButton label={t("addType")} pendingLabel="Adding..." />
            </form>
            <Table>
              <THead>
                <tr>
                  <TH>{t("offeringType")}</TH>
                  <TH>{t("description")}</TH>
                  <TH>{t("requiresMember")}</TH>
                </tr>
              </THead>
              <TBody>
                {offeringTypes.map((type) => (
                  <tr key={type.id}>
                    <TD>{type.name}</TD>
                    <TD>{type.description ?? "-"}</TD>
                    <TD>{type.requires_member ? t("yes") : t("no")}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
