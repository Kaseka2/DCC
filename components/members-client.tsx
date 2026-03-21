"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { MemberFormDialog } from "@/components/member-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMembers } from "@/hooks/use-members";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/types";

type Ministry = Database["public"]["Tables"]["ministries"]["Row"];

interface MembersClientProps {
  canManage: boolean;
}

export function MembersClient({ canManage }: MembersClientProps) {
  const { members, loading, error, createMember, updateMember, deleteMember } = useMembers();
  const [ministries, setMinistries] = useState<Ministry[]>([]);

  useEffect(() => {
    async function loadMinistries() {
      const supabase = createClient();
      const { data } = await supabase.from("ministries").select("*").order("name");
      setMinistries(data ?? []);
    }

    void loadMinistries();
  }, []);

  if (loading) {
    return <Card><CardContent className="p-6">Loading members...</CardContent></Card>;
  }

  if (error) {
    return <Card><CardContent className="p-6 text-sm text-destructive">{error}</CardContent></Card>;
  }

  if (members.length === 0) {
    return (
      <div className="space-y-4">
        {canManage ? (
          <div className="flex justify-end">
            <MemberFormDialog ministries={ministries} onSubmit={createMember} />
          </div>
        ) : null}
        <EmptyState title="No members yet" description="Your congregation directory will appear here." />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Members</CardTitle>
        {canManage ? <MemberFormDialog ministries={ministries} onSubmit={createMember} /> : null}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Ministry</TableHead>
              <TableHead>Baptism</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => {
              const ministry = ministries.find((item) => item.id === member.ministry_id);
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.full_name}</TableCell>
                  <TableCell>{member.email ?? member.phone ?? "N/A"}</TableCell>
                  <TableCell>{member.gender ?? "N/A"}</TableCell>
                  <TableCell>{ministry?.name ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.baptism_status ?? "Unknown"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {canManage ? (
                      <div className="flex justify-end gap-2">
                        <MemberFormDialog
                          ministries={ministries}
                          member={member}
                          triggerLabel="Edit"
                          onSubmit={(payload) => updateMember(member.id, payload)}
                        />
                        <Button variant="outline" size="icon" onClick={() => deleteMember(member.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Read only</span>
                    )}
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
