"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { roles } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ManagedUser {
  id: string;
  full_name: string;
  username: string;
  role: Role;
  email: string | null;
  created_at: string;
}

interface AdminUsersClientProps {
  users: ManagedUser[];
}

const assignableRoles = roles.filter((role) => role !== "admin");

export function AdminUsersClient({ users }: AdminUsersClientProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        username,
        password,
        role,
      }),
    });

    const payload = (await response.json()) as { message?: string };

    if (!response.ok) {
      setMessage(payload.message ?? "Unable to create user.");
      setLoading(false);
      return;
    }

    setMessage("User created successfully.");
    setFullName("");
    setUsername("");
    setPassword("");
    setRole("member");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <Card>
        <CardHeader>
          <CardTitle>Create user credentials</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="full-name">Full name</Label>
              <Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="e.g. secretary.jane"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Temporary password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create user"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Provisioned users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>{user.email ?? "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
