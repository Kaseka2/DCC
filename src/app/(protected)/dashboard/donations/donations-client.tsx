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
  createPledge,
  deleteOffering,
  deleteOfferingType,
  deletePledge,
  updateOffering,
  updateOfferingType,
  updatePledge,
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
  offering_type_id: string;
  member_id: string | null;
  amount: number;
  date: string;
  service_name: string | null;
  notes: string | null;
  offering_types: { name: string; requires_member: boolean } | null;
  members: { full_name: string } | null;
};

export type PledgeRow = {
  id: string;
  member_id: string | null;
  pledger_name: string | null;
  amount: number;
  purpose: string | null;
  date: string;
  status: string;
  notes: string | null;
  members: { full_name: string } | null;
};

export function DonationsClient({
  members,
  offeringTypes,
  offerings,
  pledges,
  canManage,
}: {
  members: MemberOption[];
  offeringTypes: OfferingType[];
  offerings: OfferingRow[];
  pledges: PledgeRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();
  const [selectedTypeId, setSelectedTypeId] = useState(
    offeringTypes[0]?.id ?? ""
  );
  const [filterTypeId, setFilterTypeId] = useState("all");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filterService, setFilterService] = useState("");
  const [editingOfferingId, setEditingOfferingId] = useState<string | null>(null);
  const [editingPledgeId, setEditingPledgeId] = useState<string | null>(null);

  const selectedType = offeringTypes.find(
    (type) => type.id === selectedTypeId
  );

  const filteredOfferings = useMemo(() => {
    return offerings.filter((row) => {
      if (filterTypeId !== "all" && row.offering_type_id !== filterTypeId) {
        return false;
      }
      if (filterFrom && row.date < filterFrom) return false;
      if (filterTo && row.date > filterTo) return false;
      if (filterService) {
        const needle = filterService.toLowerCase();
        const hay = `${row.service_name ?? ""} ${row.notes ?? ""}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [offerings, filterTypeId, filterFrom, filterTo, filterService]);

  const totalsByType = useMemo(() => {
    return filteredOfferings.reduce<Record<string, number>>((acc, row) => {
      const key = row.offering_types?.name ?? "Unknown";
      acc[key] = (acc[key] ?? 0) + Number(row.amount || 0);
      return acc;
    }, {});
  }, [filteredOfferings]);

  const monthlyTotalsByType = useMemo(() => {
    const now = new Date();
    const monthPrefix = now.toISOString().slice(0, 7);
    return filteredOfferings.reduce<Record<string, number>>((acc, row) => {
      if (!row.date.startsWith(monthPrefix)) {
        return acc;
      }
      const key = row.offering_types?.name ?? "Unknown";
      acc[key] = (acc[key] ?? 0) + Number(row.amount || 0);
      return acc;
    }, {});
  }, [filteredOfferings]);

  const groupedOfferings = useMemo(() => {
    return filteredOfferings.reduce<Record<string, OfferingRow[]>>((acc, row) => {
      const key = row.offering_types?.name ?? "Unknown";
      acc[key] = acc[key] ?? [];
      acc[key].push(row);
      return acc;
    }, {});
  }, [filteredOfferings]);

  const generalOfferings = useMemo(() => {
    return filteredOfferings.filter(
      (row) => row.offering_types?.requires_member === false
    );
  }, [filteredOfferings]);

  const generalTypes = offeringTypes.filter(
    (type) => type.requires_member === false
  );

  const weeklyTotal = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const startKey = start.toISOString().slice(0, 10);
    const endKey = today.toISOString().slice(0, 10);
    return filteredOfferings
      .filter((row) => row.date >= startKey && row.date <= endKey)
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }, [filteredOfferings]);

  const monthlyTotal = useMemo(() => {
    const now = new Date();
    const monthPrefix = now.toISOString().slice(0, 7);
    return filteredOfferings
      .filter((row) => row.date.startsWith(monthPrefix))
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }, [filteredOfferings]);

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
              {offeringTypes.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("addTypeFirst")}
                </p>
              ) : (
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
                <Input name="service_name" placeholder={t("serviceName")} />
                <Input name="notes" placeholder={t("notesLabel")} />
                <div className="md:col-span-6">
                  <SubmitButton label={t("addDonation")} pendingLabel="Saving..." />
                </div>
              </form>
              )}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{t("filter")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <Select
                  name="filter_type"
                  value={filterTypeId}
                  onChange={(event) => setFilterTypeId(event.target.value)}
                >
                  <option value="all">{t("offeringType")}</option>
                  {offeringTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                <Input
                  type="date"
                  value={filterFrom}
                  onChange={(event) => setFilterFrom(event.target.value)}
                  placeholder={t("dateFrom")}
                />
                <Input
                  type="date"
                  value={filterTo}
                  onChange={(event) => setFilterTo(event.target.value)}
                  placeholder={t("dateTo")}
                />
                <Input
                  value={filterService}
                  onChange={(event) => setFilterService(event.target.value)}
                  placeholder={t("serviceName")}
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{t("offeringTotals")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("weekly")}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {weeklyTotal.toLocaleString(undefined, {
                      style: "currency",
                      currency: "TZS",
                    })}
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-[var(--surface)] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("monthly")}
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {monthlyTotal.toLocaleString(undefined, {
                      style: "currency",
                      currency: "TZS",
                    })}
                  </p>
                </div>
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

            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>{t("monthlyTotalsByType")}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {Object.entries(monthlyTotalsByType).map(([type, total]) => (
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
                {Object.keys(monthlyTotalsByType).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {t("noMonthlyOfferings")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {canManage && (
            <Card>
              <CardHeader>
                <CardTitle>{t("quickAddNoNames")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generalTypes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {t("addTypeFirst")}
                  </p>
                ) : (
                  <form action={createOffering} className="grid gap-3 md:grid-cols-5">
                    <Select name="offering_type_id" required defaultValue={generalTypes[0]?.id ?? ""}>
                      {generalTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
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
                    <Input name="service_name" placeholder={t("cause")} />
                    <Input name="notes" placeholder={t("notesLabel")} />
                    <div className="md:col-span-5">
                      <SubmitButton label={t("addDonation")} pendingLabel="Saving..." />
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

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
                    <TH>{t("serviceName")}</TH>
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
                      <TD>{offering.service_name ?? "-"}</TD>
                      <TD>{offering.notes ?? "-"}</TD>
                      {canManage && (
                        <TD>
                          {editingOfferingId === offering.id ? (
                            <div className="flex flex-col gap-2">
                              <form action={updateOffering} className="grid grid-cols-5 gap-2">
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
                                  name="service_name"
                                  defaultValue={offering.service_name ?? ""}
                                  className="h-8"
                                  placeholder={t("serviceName")}
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
                                <button
                                  type="button"
                                  className="text-xs text-muted-foreground underline"
                                  onClick={() => setEditingOfferingId(null)}
                                >
                                  {t("cancel")}
                                </button>
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
                          ) : (
                            <button
                              type="button"
                              className="text-xs font-semibold text-primary underline"
                              onClick={() => setEditingOfferingId(offering.id)}
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
            </div>
          ))}

          {generalOfferings.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("anonymousOfferings")}</h3>
                <span className="text-sm text-muted-foreground">
                  {generalOfferings
                    .reduce((sum, row) => sum + Number(row.amount || 0), 0)
                    .toLocaleString(undefined, {
                      style: "currency",
                      currency: "TZS",
                    })}
                </span>
              </div>
              <Table>
                <THead>
                  <tr>
                    <TH>{t("offeringType")}</TH>
                    <TH>{t("amount")}</TH>
                    <TH>{t("date")}</TH>
                    <TH>{t("cause")}</TH>
                  </tr>
                </THead>
                <TBody>
                  {generalOfferings.map((row) => (
                    <tr key={row.id}>
                      <TD>{row.offering_types?.name ?? "-"}</TD>
                      <TD>{row.amount.toFixed(2)}</TD>
                      <TD>{row.date}</TD>
                      <TD>{row.service_name ?? row.notes ?? "-"}</TD>
                    </tr>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
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
                  {canManage && <TH>{t("actions")}</TH>}
                </tr>
              </THead>
              <TBody>
                {offeringTypes.map((type) => (
                  <tr key={type.id}>
                    <TD>{type.name}</TD>
                    <TD>{type.description ?? "-"}</TD>
                    <TD>{type.requires_member ? t("yes") : t("no")}</TD>
                    {canManage && (
                      <TD>
                        <div className="flex flex-col gap-2">
                          <form action={updateOfferingType} className="grid grid-cols-4 gap-2">
                            <input type="hidden" name="type_id" value={type.id} />
                            <Input name="name" defaultValue={type.name} className="h-8" />
                            <Input name="description" defaultValue={type.description ?? ""} className="h-8" />
                            <label className="flex items-center gap-2 text-xs text-muted-foreground">
                              <input type="checkbox" name="requires_member" defaultChecked={type.requires_member} />
                              {t("requiresMember")}
                            </label>
                            <SubmitButton size="sm" variant="secondary" label={t("save")} pendingLabel="Saving..." />
                          </form>
                          <form action={deleteOfferingType}>
                            <input type="hidden" name="type_id" value={type.id} />
                            <SubmitButton size="sm" variant="destructive" label={t("delete")} pendingLabel="Deleting..." />
                          </form>
                          <p className="text-xs text-muted-foreground">
                            Types in use cannot be deleted.
                          </p>
                        </div>
                      </TD>
                    )}
                  </tr>
                ))}
              </TBody>
            </Table>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("exportCategory")}
              </span>
              {offeringTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted/60"
                  onClick={() => {
                    window.location.href = `/api/reports/offering-type/${type.id}`;
                  }}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>{t("pledges")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createPledge} className="grid gap-3 md:grid-cols-6">
              <Select name="member_id" defaultValue="">
                <option value="">{t("member")}</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name}
                  </option>
                ))}
              </Select>
              <Input name="pledger_name" placeholder={t("fullName")} />
              <Input name="amount" type="number" min="0" step="0.01" placeholder={t("amount")} required />
              <Input name="purpose" placeholder={t("purpose")} />
              <Input name="date" type="date" required />
              <Select name="status" defaultValue="open">
                <option value="open">{t("statusOpen")}</option>
                <option value="fulfilled">{t("statusFulfilled")}</option>
                <option value="cancelled">{t("statusCancelled")}</option>
              </Select>
              <Input name="notes" placeholder={t("notes")} />
              <div className="md:col-span-6">
                <SubmitButton label={t("addPledge")} pendingLabel="Saving..." />
              </div>
            </form>

            <Table>
              <THead>
                <tr>
                  <TH>{t("member")}</TH>
                  <TH>{t("amount")}</TH>
                  <TH>{t("purpose")}</TH>
                  <TH>{t("date")}</TH>
                  <TH>{t("status")}</TH>
                  <TH>{t("notes")}</TH>
                  {canManage && <TH>{t("actions")}</TH>}
                </tr>
              </THead>
              <TBody>
                {pledges.map((pledge) => (
                  <tr key={pledge.id}>
                    <TD>{pledge.members?.full_name ?? pledge.pledger_name ?? "-"}</TD>
                    <TD>{pledge.amount.toFixed(2)}</TD>
                    <TD>{pledge.purpose ?? "-"}</TD>
                    <TD>{pledge.date}</TD>
                    <TD>{pledge.status}</TD>
                    <TD>{pledge.notes ?? "-"}</TD>
                    {canManage && (
                      <TD>
                        {editingPledgeId === pledge.id ? (
                          <div className="flex flex-col gap-2">
                            <form action={updatePledge} className="grid grid-cols-6 gap-2">
                              <input type="hidden" name="pledge_id" value={pledge.id} />
                              <Select name="member_id" defaultValue={pledge.member_id ?? ""} className="h-8">
                                <option value="">{t("member")}</option>
                                {members.map((member) => (
                                  <option key={member.id} value={member.id}>
                                    {member.full_name}
                                  </option>
                                ))}
                              </Select>
                              <Input name="pledger_name" defaultValue={pledge.pledger_name ?? ""} className="h-8" />
                              <Input name="amount" type="number" min="0" step="0.01" defaultValue={pledge.amount} className="h-8" />
                              <Input name="purpose" defaultValue={pledge.purpose ?? ""} className="h-8" />
                              <Input name="date" type="date" defaultValue={pledge.date} className="h-8" />
                              <Select name="status" defaultValue={pledge.status} className="h-8">
                                <option value="open">{t("statusOpen")}</option>
                                <option value="fulfilled">{t("statusFulfilled")}</option>
                                <option value="cancelled">{t("statusCancelled")}</option>
                              </Select>
                              <Input name="notes" defaultValue={pledge.notes ?? ""} className="h-8" />
                              <SubmitButton size="sm" variant="secondary" label={t("save")} pendingLabel="Saving..." />
                              <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setEditingPledgeId(null)}>
                                {t("cancel")}
                              </button>
                            </form>
                            <form action={deletePledge}>
                              <input type="hidden" name="pledge_id" value={pledge.id} />
                              <SubmitButton size="sm" variant="destructive" label={t("delete")} pendingLabel="Deleting..." />
                            </form>
                          </div>
                        ) : (
                          <button type="button" className="text-xs font-semibold text-primary underline" onClick={() => setEditingPledgeId(pledge.id)}>
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
      )}
    </div>
  );
}
