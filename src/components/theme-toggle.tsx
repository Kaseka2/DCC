"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" aria-hidden="true">
        Theme
      </Button>
    );
  }

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
