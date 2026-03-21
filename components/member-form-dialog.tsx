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
import type { Database, Member } from "@/lib/types";

type MemberInsert = Database["public"]["Tables"]["members"]["Insert"];

interface MemberFormDialogProps {
  ministries: { id: string; name: string }[];
  member?: Member;
  onSubmit: (payload: MemberInsert) => Promise<void>;
  triggerLabel?: string;
}

export function MemberFormDialog({
  ministries,
  member,
  onSubmit,
  triggerLabel = "Add member",
}: MemberFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<MemberInsert>({
    full_name: member?.full_name ?? "",
    gender: member?.gender ?? "",
    phone: member?.phone ?? "",
    email: member?.email ?? "",
    address: member?.address ?? "",
    ministry_id: member?.ministry_id ?? null,
    baptism_status: member?.baptism_status ?? "",
    user_id: member?.user_id ?? null,
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
          <DialogTitle>{member ? "Edit member" : "Create member"}</DialogTitle>
          <DialogDescription>Capture core member records for ministry care and administration.</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                value={form.gender ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email ?? ""}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address ?? ""}
              onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Ministry</Label>
              <Select
                value={form.ministry_id ?? "none"}
                onValueChange={(value) => setForm((current) => ({ ...current, ministry_id: value === "none" ? null : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose ministry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No ministry</SelectItem>
                  {ministries.map((ministry) => (
                    <SelectItem key={ministry.id} value={ministry.id}>
                      {ministry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baptism_status">Baptism status</Label>
              <Input
                id="baptism_status"
                value={form.baptism_status ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, baptism_status: event.target.value }))}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : member ? "Save changes" : "Create member"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
