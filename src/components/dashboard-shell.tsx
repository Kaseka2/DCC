"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { type Role } from "@/lib/types";
import { useLanguage } from "@/components/language-provider";

const SIDEBAR_KEY = "churchcms-sidebar-collapsed";

export function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(SIDEBAR_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-background">
      <div
        className={`grid min-h-screen grid-cols-1 ${
          collapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[240px_1fr]"
        }`}
      >
        <Sidebar
          role={role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          className="hidden lg:block"
        />
        <div className="flex flex-col">
          <header className="border-b border-border bg-[var(--surface)]/95 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border bg-[var(--surface-muted)]">
                  <Image
                    src="/logo.png"
                    alt="TAG DCC"
                    fill
                    className="object-cover"
                    sizes="40px"
                    priority
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    TAG DCC
                  </p>
                  <h1 className="text-2xl font-semibold">{t("welcomeBack")}</h1>
                  <p className="text-sm text-muted-foreground">
                    {t("accessLevel")}: {role}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
                <LogoutButton />
              </div>
            </div>
          </header>
          <Sidebar
            role={role}
            collapsed={false}
            className="border-b border-border lg:hidden"
          />
          <main className="flex-1 px-6 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
