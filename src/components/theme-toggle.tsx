"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {theme === "light" ? (
        <>
          <Moon className="mr-2 h-4 w-4" />
          {t("dark")}
        </>
      ) : (
        <>
          <Sun className="mr-2 h-4 w-4" />
          {t("light")}
        </>
      )}
    </Button>
  );
}
