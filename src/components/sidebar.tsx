import Link from "next/link";
import { type Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const baseLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/members", label: "Members" },
  { href: "/dashboard/donations", label: "Donations" },
];

export function Sidebar({ role, className }: { role: Role; className?: string }) {
  const links = [
    ...baseLinks,
    ...(role === "admin"
      ? [{ href: "/dashboard/admin/users", label: "User Management" }]
      : []),
  ];

  return (
    <aside
      className={cn(
        "h-full bg-white border-r border-border px-4 py-6",
        className
      )}
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Church CMS
        </p>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/60"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
