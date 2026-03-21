"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { donationTypes } from "@/lib/constants";
import type { Database, Donation, Member } from "@/lib/types";

type DonationInsert = Database["public"]["Tables"]["donations"]["Insert"];

interface DonationFormDialogProps {
  members: Member[];
  donation?: Donation;
  onSubmit: (payload: DonationInsert) => Promise<void>;
  triggerLabel?: string;
}

export function DonationFormDialog({
  members,
  donation,
  onSubmit,
  triggerLabel = "Add donation",
}: DonationFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<DonationInsert>({
    member_id: donation?.member_id ?? members[0]?.id ?? "",
    amount: donation?.amount ?? 0,
    type: donation?.type ?? "tithe",
    payment_method: donation?.payment_method ?? "cash",
    date: donation?.date ?? new Date().toISOString().slice(0, 10),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{donation ? "Edit donation" : "Record donation"}</DialogTitle>
          <DialogDescription>Capture tithes, offerings, and pledges for stewardship reporting.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Member</Label>
            <Select value={form.member_id} onValueChange={(value) => setForm((current) => ({ ...current, member_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={String(form.amount)}
                onChange={(event) => setForm((current) => ({ ...current, amount: Number(event.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => setForm((current) => ({ ...current, type: value as DonationInsert["type"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose type" />
                </SelectTrigger>
                <SelectContent>
                  {donationTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment method</Label>
              <Input
                id="payment_method"
                value={form.payment_method}
                onChange={(event) => setForm((current) => ({ ...current, payment_method: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : donation ? "Save changes" : "Create donation"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
