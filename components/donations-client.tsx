"use client";

import { Trash2 } from "lucide-react";

import { DonationFormDialog } from "@/components/donation-form-dialog";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDonations } from "@/hooks/use-donations";
import type { Member } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

interface DonationsClientProps {
  members: Member[];
}

export function DonationsClient({ members }: DonationsClientProps) {
  const { donations, loading, error, createDonation, updateDonation, deleteDonation } = useDonations();

  if (loading) {
    return <Card><CardContent className="p-6">Loading donations...</CardContent></Card>;
  }

  if (error) {
    return <Card><CardContent className="p-6 text-sm text-destructive">{error}</CardContent></Card>;
  }

  if (donations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <DonationFormDialog members={members} onSubmit={createDonation} />
        </div>
        <EmptyState title="No donations yet" description="Stewardship records will appear here once contributions are added." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Donations</CardTitle>
        <DonationFormDialog members={members} onSubmit={createDonation} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations.map((donation) => {
              const member = members.find((item) => item.id === donation.member_id);
              return (
                <TableRow key={donation.id}>
                  <TableCell>{member?.full_name ?? "Unknown member"}</TableCell>
                  <TableCell>{formatCurrency(donation.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{donation.type}</Badge>
                  </TableCell>
                  <TableCell>{donation.payment_method}</TableCell>
                  <TableCell>{formatDate(donation.date)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <DonationFormDialog
                        members={members}
                        donation={donation}
                        triggerLabel="Edit"
                        onSubmit={(payload) => updateDonation(donation.id, payload)}
                      />
                      <Button variant="outline" size="icon" onClick={() => deleteDonation(donation.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
