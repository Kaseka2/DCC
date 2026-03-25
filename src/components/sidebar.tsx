 "use client";

import Link from "next/link";
import {
  Calendar,
  ClipboardList,
  FileText,
  HandCoins,
  LayoutDashboard,
  UserCog,
  Users,
  BookOpen,
} from "lucide-react";
import { type Role } from "@/lib/types";
import { cn } from "@/lib/utils";
import { type DictionaryKey, useLanguage } from "@/components/language-provider";

const baseLinks: { href: string; key: DictionaryKey; icon: typeof LayoutDashboard }[] =
  [
    { href: "/dashboard", key: "overview", icon: LayoutDashboard },
    { href: "/dashboard/members", key: "members", icon: Users },
    { href: "/dashboard/donations", key: "donations", icon: HandCoins },
    { href: "/dashboard/attendance", key: "attendance", icon: ClipboardList },
    { href: "/dashboard/events", key: "events", icon: Calendar },
    { href: "/dashboard/sermons", key: "sermons", icon: BookOpen },
    { href: "/dashboard/reports", key: "reports", icon: FileText },
  ];

export function Sidebar({
  role,
  collapsed,
  className,
}: {
  role: Role;
  collapsed: boolean;
  className?: string;
}) {
  const { t } = useLanguage();
  const links = [
    ...baseLinks,
    ...(role === "admin"
      ? [
          {
            href: "/dashboard/admin/users",
            key: "userManagement" as DictionaryKey,
            icon: UserCog,
          },
        ]
      : []),
  ];

  return (
    <aside
      className={cn(
        "bg-[var(--surface)] border-r border-border px-4 py-6 transition-all",
        collapsed ? "w-[88px]" : "w-full",
        className
      )}
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {collapsed ? "CMS" : "Church CMS"}
        </p>
        {!collapsed && (
          <h2 className="text-lg font-semibold">{t("dashboard")}</h2>
        )}
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60",
              collapsed && "justify-center"
            )}
          >
            <link.icon className="h-4 w-4 text-muted-foreground" />
            {!collapsed && t(link.key)}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
