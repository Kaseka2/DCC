import { NextRequest, NextResponse } from "next/server";
import { getCurrentRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type Role } from "@/lib/types";

const allowed: Record<string, Role[]> = {
  members: ["admin", "secretary"],
  donations: ["admin", "treasurer"],
  attendance: ["admin", "secretary", "pastor"],
  events: ["admin", "secretary"],
  sermons: ["admin", "pastor"],
};

function toCsv(rows: Record<string, string | number | null>[]) {
  if (!rows.length) {
    return "";
  }
  const headers = Object.keys(rows[0]);
  const escape = (value: string | number | null) => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
      return `"${str.replace(/"/g, "\"\"")}"`;
    }
    return str;
  };
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => escape(row[key])).join(",")),
  ];
  return lines.join("\n");
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ type: string }> }
) {
  const { type } = await context.params;
  const role = await getCurrentRole();

  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowedRoles = allowed[type];
  if (!allowedRoles || !allowedRoles.includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient(true);

  if (type === "members") {
    const { data } = await supabase
      .from("members")
      .select("full_name, username, phone, gender, email, created_at")
      .order("created_at", { ascending: false });
    const csv = toCsv(
      (data ?? []).map((row) => ({
        full_name: row.full_name,
        username: row.username,
        phone: row.phone,
        gender: row.gender,
        email: row.email,
        created_at: row.created_at,
      }))
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=members.csv",
      },
    });
  }

  if (type === "donations") {
    const { data } = await supabase
      .from("offerings")
      .select("amount, date, notes, offering_types(name), members(full_name)")
      .order("date", { ascending: false });
    const rows =
      (data as
        | {
          amount: number;
          date: string;
          notes: string | null;
          offering_types: { name: string } | null;
          members: { full_name: string } | null;
        }[]
        | null) ?? [];
    const csv = toCsv(
      rows.map((row) => ({
        member: row.members?.full_name ?? "",
        amount: row.amount,
        type: row.offering_types?.name ?? "",
        date: row.date,
        notes: row.notes ?? "",
      }))
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=donations.csv",
      },
    });
  }

  if (type === "attendance") {
    const { data } = await supabase
      .from("attendance")
      .select("date, status, notes, members(full_name), events(title)")
      .order("date", { ascending: false });
    const rows =
      (data as
        | {
            date: string;
            status: string;
            notes: string | null;
            members: { full_name: string } | null;
            events: { title: string } | null;
          }[]
        | null) ?? [];
    const csv = toCsv(
      rows.map((row) => ({
        member: row.members?.full_name ?? "",
        event: row.events?.title ?? "Service",
        date: row.date,
        status: row.status,
        notes: row.notes,
      }))
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=attendance.csv",
      },
    });
  }

  if (type === "events") {
    const { data } = await supabase
      .from("events")
      .select("title, location, description, start_date, end_date, created_at")
      .order("start_date", { ascending: false });
    const csv = toCsv(
      (data ?? []).map((row) => ({
        title: row.title,
        location: row.location,
        description: row.description,
        start_date: row.start_date,
        end_date: row.end_date,
        created_at: row.created_at,
      }))
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=events.csv",
      },
    });
  }

  if (type === "sermons") {
    const { data } = await supabase
      .from("sermons")
      .select("title, preacher, date, summary, created_at")
      .order("date", { ascending: false });
    const csv = toCsv(
      (data ?? []).map((row) => ({
        title: row.title,
        preacher: row.preacher,
        date: row.date,
        summary: row.summary,
        created_at: row.created_at,
      }))
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=sermons.csv",
      },
    });
  }

  return NextResponse.json({ error: "Unknown report type." }, { status: 400 });
}
