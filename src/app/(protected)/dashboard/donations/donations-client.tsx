"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { useLanguage } from "@/components/language-provider";
import { createDonation, deleteDonation, updateDonation } from "./actions";

export type MemberOption = { id: string; full_name: string };
export type DonationRow = {
  id: string;
  amount: number;
  type: string;
  payment_method: string | null;
  date: string;
  members: { full_name: string } | null;
};

export function DonationsClient({
  members,
  donations,
  canManage,
}: {
  members: MemberOption[];
  donations: DonationRow[];
  canManage: boolean;
}) {
  const { t } = useLanguage();

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
              <form action={createDonation} className="mt-3 grid gap-3 md:grid-cols-5">
                <Select name="member_id" required defaultValue="">
                  <option value="" disabled>
                    {t("member")}
                  </option>
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
                <Input name="type" placeholder={t("type")} required />
                <Input name="payment_method" placeholder={t("paymentMethod")} />
                <Input name="date" type="date" required />
                <div className="md:col-span-5">
                  <Button type="submit">{t("addDonation")}</Button>
                </div>
              </form>
            </div>
          )}

          <Table>
            <THead>
              <tr>
                <TH>{t("member")}</TH>
                <TH>{t("amount")}</TH>
                <TH>{t("type")}</TH>
                <TH>{t("paymentMethod")}</TH>
                <TH>{t("date")}</TH>
                {canManage && <TH>{t("actions")}</TH>}
              </tr>
            </THead>
            <TBody>
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <TD>{donation.members?.full_name ?? "Unknown"}</TD>
                  <TD>{donation.amount.toFixed(2)}</TD>
                  <TD>{donation.type}</TD>
                  <TD>{donation.payment_method ?? "-"}</TD>
                  <TD>{donation.date}</TD>
                  {canManage && (
                    <TD>
                      <div className="flex flex-col gap-2">
                        <form action={updateDonation} className="grid grid-cols-4 gap-2">
                          <input type="hidden" name="donation_id" value={donation.id} />
                          <Input
                            name="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            defaultValue={donation.amount}
                            className="h-8"
                            required
                          />
                          <Input
                            name="type"
                            defaultValue={donation.type}
                            className="h-8"
                            required
                          />
                          <Input
                            name="payment_method"
                            defaultValue={donation.payment_method ?? ""}
                            className="h-8"
                          />
                          <Input
                            name="date"
                            type="date"
                            defaultValue={donation.date}
                            className="h-8"
                            required
                          />
                          <Button size="sm" type="submit" variant="secondary">
                            {t("save")}
                          </Button>
                        </form>
                        <form action={deleteDonation}>
                          <input type="hidden" name="donation_id" value={donation.id} />
                          <Button size="sm" type="submit" variant="destructive">
                            {t("delete")}
                          </Button>
                        </form>
                      </div>
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
