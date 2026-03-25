import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { createDonation, deleteDonation, updateDonation } from "./actions";

type DonationRow = {
  id: string;
  amount: number;
  type: string;
  payment_method: string | null;
  date: string;
  members: { full_name: string } | null;
};

export default async function DonationsPage() {
  const supabase = await createSupabaseServerClient();
  const role = await getCurrentRole();
  const canManage = role === "admin" || role === "treasurer";

  const { data: members } = await supabase
    .from("members")
    .select("id, full_name")
    .order("full_name");

  const { data: donations } = await supabase
    .from("donations")
    .select("id, amount, type, payment_method, date, members(full_name)")
    .order("date", { ascending: false });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Donations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {canManage && (
            <form action={createDonation} className="grid gap-3 md:grid-cols-5">
              <Select name="member_id" required defaultValue="">
                <option value="" disabled>
                  Member
                </option>
                {members?.map((member) => (
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
                placeholder="Amount"
                required
              />
              <Input name="type" placeholder="Type (tithe, offering)" required />
              <Input
                name="payment_method"
                placeholder="Payment method"
              />
              <Input name="date" type="date" required />
              <div className="md:col-span-5">
                <Button type="submit">Add Donation</Button>
              </div>
            </form>
          )}

          <Table>
            <THead>
              <tr>
                <TH>Member</TH>
                <TH>Amount</TH>
                <TH>Type</TH>
                <TH>Payment</TH>
                <TH>Date</TH>
                {canManage && <TH>Actions</TH>}
              </tr>
            </THead>
            <TBody>
              {(donations as DonationRow[] | null)?.map((donation) => (
                <tr key={donation.id}>
                  <TD>{donation.members?.full_name ?? "Unknown"}</TD>
                  <TD>{donation.amount.toFixed(2)}</TD>
                  <TD>{donation.type}</TD>
                  <TD>{donation.payment_method ?? "-"}</TD>
                  <TD>{donation.date}</TD>
                  {canManage && (
                    <TD>
                      <div className="flex flex-col gap-2">
                        <form
                          action={updateDonation}
                          className="grid grid-cols-4 gap-2"
                        >
                          <input
                            type="hidden"
                            name="donation_id"
                            value={donation.id}
                          />
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
                            Save
                          </Button>
                        </form>
                        <form action={deleteDonation}>
                          <input
                            type="hidden"
                            name="donation_id"
                            value={donation.id}
                          />
                          <Button size="sm" type="submit" variant="destructive">
                            Delete
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
