import Link from "next/link";
import type { Route } from "next";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/" as Route, label: "Home" },
  { href: "/about" as Route, label: "About" },
  { href: "/events" as Route, label: "Events" },
  { href: "/sermons" as Route, label: "Sermons" },
  { href: "/contact" as Route, label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
