"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TBody, TD, TH, THead } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type Role } from "@/lib/types";
import { normalizeUsername } from "@/lib/username";
import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/components/language-provider";

type UserRow = {
  id: string;
  role: Role;
  created_at: string;
  full_name: string | null;
  username: string | null;
  phone: string | null;
  email: string | null;
};

const roles: Role[] = ["admin", "pastor", "secretary", "treasurer", "member"];

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    role: "member" as Role,
    phone: "",
  });

  async function loadUsers() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users");
      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Unable to load users.");
        return;
      }

      setUsers(json.data || []);
    } catch {
      setError("Unable to load users.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          username: normalizeUsername(form.username),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error || "Unable to create user.");
        return;
      }

      setForm({
        full_name: "",
        username: "",
        password: "",
        role: "member",
        phone: "",
      });

      await loadUsers();
    } catch {
      setError("Unable to create user.");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("userManagement")}
        description="Create staff and member accounts with assigned roles."
      />
      <Card>
        <CardHeader>
          <CardTitle>Admin User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-5">
            <Input
              value={form.full_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, full_name: event.target.value }))
              }
              placeholder={t("fullName")}
              required
            />
            <Input
              value={form.username}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, username: event.target.value }))
              }
              placeholder={t("username")}
              required
            />
            <Input
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              placeholder={t("temporaryPassword")}
              type="password"
              required
            />
            <Select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  role: event.target.value as Role,
                }))
              }
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
            <Input
              value={form.phone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, phone: event.target.value }))
              }
              placeholder={t("phone")}
            />
            <div className="md:col-span-5">
              <Button type="submit">{t("createUser")}</Button>
            </div>
          </form>

          {error && (
            <div className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </div>
          )}

          <div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : (
              <Table>
                <THead>
                  <tr>
                    <TH>{t("fullName")}</TH>
                    <TH>{t("username")}</TH>
                    <TH>{t("role")}</TH>
                    <TH>{t("phone")}</TH>
                    <TH>{t("created")}</TH>
                  </tr>
                </THead>
                <TBody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <TD>{user.full_name ?? "-"}</TD>
                      <TD>{user.username ?? "-"}</TD>
                      <TD>
                        <Badge>{user.role}</Badge>
                      </TD>
                      <TD>{user.phone ?? "-"}</TD>
                      <TD>{new Date(user.created_at).toLocaleDateString()}</TD>
                    </tr>
                  ))}
                </TBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
