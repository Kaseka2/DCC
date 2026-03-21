"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { Sermon } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/format";

export function SermonsClient() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [title, setTitle] = useState("");
  const [preacher, setPreacher] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    async function fetchSermons() {
      const supabase = createClient();
      const { data } = await supabase.from("sermons").select("*").order("date", { ascending: false });
      setSermons(data ?? []);
    }

    void fetchSermons();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = createClient();
    await supabase.from("sermons").insert({ title, preacher, media_url: mediaUrl, date });
    const { data } = await supabase.from("sermons").select("*").order("date", { ascending: false });
    setSermons(data ?? []);
    setTitle("");
    setPreacher("");
    setMediaUrl("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Upload sermon</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="sermon-title">Title</Label>
              <Input id="sermon-title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon-preacher">Preacher</Label>
              <Input id="sermon-preacher" value={preacher} onChange={(event) => setPreacher(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon-url">Media URL</Label>
              <Input id="sermon-url" value={mediaUrl} onChange={(event) => setMediaUrl(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sermon-date">Date</Label>
              <Input id="sermon-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            </div>
            <Button type="submit">Save sermon</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sermon library</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Preacher</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sermons.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium">{sermon.title}</TableCell>
                  <TableCell>{sermon.preacher}</TableCell>
                  <TableCell>{formatDate(sermon.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
