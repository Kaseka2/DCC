import { NextRequest, NextResponse } from "next/server";
import { getCurrentRole } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function toCsv(rows: Record<string, string | number | null>[]) {
  if (!rows.length) return "";
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const role = await getCurrentRole();

  if (!role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["admin", "treasurer", "secretary"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = await createSupabaseServerClient(true);

  const { data: offeringType } = await supabase
    .from("offering_types")
    .select("name")
    .eq("id", id)
    .maybeSingle();

  const { data } = await supabase
    .from("offerings")
    .select("amount, date, service_name, notes, members(full_name)")
    .eq("offering_type_id", id)
    .order("date", { ascending: false });

  const rows =
    (data as
      | {
          amount: number;
          date: string;
          service_name: string | null;
          notes: string | null;
          members: { full_name: string } | null;
        }[]
      | null) ?? [];

  const csv = toCsv(
    rows.map((row) => ({
      member: row.members?.full_name ?? "",
      amount: row.amount,
      date: row.date,
      service: row.service_name ?? "",
      notes: row.notes ?? "",
    }))
  );

  const filename = (offeringType?.name ?? "offering-type")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename=${filename}.csv`,
    },
  });
}
