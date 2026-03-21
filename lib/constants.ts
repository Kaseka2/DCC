import type { Role } from "@/lib/types";

export const roles: Role[] = ["admin", "pastor", "treasurer", "secretary", "member"];

export const donationTypes = ["tithe", "offering", "pledge"] as const;
export const attendanceStatuses = ["present", "absent"] as const;

export const dashboardLinks = [
  { href: "/dashboard", label: "Overview", roles: ["admin", "pastor", "treasurer", "secretary"] as Role[] },
  { href: "/dashboard/members", label: "Members", roles: ["admin", "pastor", "secretary"] as Role[] },
  { href: "/dashboard/donations", label: "Donations", roles: ["admin", "treasurer"] as Role[] },
  { href: "/dashboard/events", label: "Events", roles: ["admin", "secretary"] as Role[] },
  { href: "/dashboard/attendance", label: "Attendance", roles: ["admin", "secretary"] as Role[] },
  { href: "/dashboard/sermons", label: "Sermons", roles: ["admin", "pastor"] as Role[] },
  { href: "/portal", label: "Member Portal", roles: ["admin", "pastor", "treasurer", "secretary", "member"] as Role[] },
];
