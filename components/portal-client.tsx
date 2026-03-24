"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Donation, Member, PrayerRequest } from "@/lib/types";

interface PortalClientProps {
  member: Member | null;
}

export function PortalClient({ member }: PortalClientProps) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!member) return;
      const supabase = createClient();
      const [{ data: donationData }, { data: prayerData }] = await Promise.all([
        supabase.from("donations").select("*").eq("member_id", member.id).order("date", { ascending: false }),
        supabase.from("prayer_requests").select("*").eq("member_id", member.id).order("created_at", { ascending: false }),
      ]);
      setDonations(donationData ?? []);
      setPrayerRequests(prayerData ?? []);
    }

    void loadData();
  }, [member]);

  async function submitPrayerRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!member) return;
    const supabase = createClient();
    await supabase.from("prayer_requests").insert({ member_id: member.id, message });
    const { data } = await supabase.from("prayer_requests").select("*").eq("member_id", member.id);
    setPrayerRequests(data ?? []);
    setMessage("");
  }

  if (!member) {
    return <Card><CardContent className="p-6">No member profile is linked to this account yet.</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><span className="font-medium">Name:</span> {member.full_name}</p>
            <p><span className="font-medium">Email:</span> {member.email ?? "N/A"}</p>
            <p><span className="font-medium">Phone:</span> {member.phone ?? "N/A"}</p>
            <p><span className="font-medium">Address:</span> {member.address ?? "N/A"}</p>
            <p><span className="font-medium">Baptism:</span> {member.baptism_status ?? "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Prayer request</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitPrayerRequest}>
              <div className="space-y-2">
                <Label htmlFor="prayer-message">Message</Label>
                <Textarea
                  id="prayer-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Share your prayer need"
                  required
                />
              </div>
              <Button type="submit">Submit request</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Giving history</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{formatDate(donation.date)}</TableCell>
                  <TableCell className="capitalize">{donation.type}</TableCell>
                  <TableCell>{formatCurrency(donation.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Your prayer requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prayerRequests.map((request) => (
            <div key={request.id} className="rounded-2xl border p-4 text-sm">
              <p>{request.message}</p>
              <p className="mt-2 text-muted-foreground">
                {request.status} • {formatDate(request.created_at)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
