import type { Route } from "next";
import type { Role } from "@/lib/types";

export const roles: Role[] = ["admin", "pastor", "treasurer", "secretary", "member"];

export const donationTypes = ["tithe", "offering", "pledge"] as const;
export const attendanceStatuses = ["present", "absent"] as const;

export const dashboardLinks = [
  { href: "/dashboard" as Route, label: "Overview", roles: ["admin", "pastor", "treasurer", "secretary"] as Role[] },
  { href: "/dashboard/users" as Route, label: "Users", roles: ["admin"] as Role[] },
  { href: "/dashboard/members" as Route, label: "Members", roles: ["admin", "pastor", "secretary"] as Role[] },
  { href: "/dashboard/donations" as Route, label: "Donations", roles: ["admin", "treasurer"] as Role[] },
  { href: "/dashboard/events" as Route, label: "Events", roles: ["admin", "secretary"] as Role[] },
  { href: "/dashboard/attendance" as Route, label: "Attendance", roles: ["admin", "secretary"] as Role[] },
  { href: "/dashboard/sermons" as Route, label: "Sermons", roles: ["admin", "pastor"] as Role[] },
  { href: "/portal" as Route, label: "Member Portal", roles: ["admin", "pastor", "treasurer", "secretary", "member"] as Role[] },
];
