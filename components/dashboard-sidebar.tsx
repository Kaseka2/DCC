"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";

import { dashboardLinks } from "@/lib/constants";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  role: Role;
}

export function DashboardSidebar({ role }: DashboardSidebarProps) {
  const pathname = usePathname();
  const visibleLinks = dashboardLinks.filter((link) => link.roles.includes(role));

  return (
    <aside className="w-full rounded-3xl border bg-card p-4 shadow-panel lg:w-72">
      <div className="mb-6 border-b pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">ChurchFlow</p>
        <h2 className="mt-2 text-xl font-semibold">Admin Dashboard</h2>
      </div>
      <nav className="space-y-1">
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href as Route}
            className={cn(
              "flex rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === link.href && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
