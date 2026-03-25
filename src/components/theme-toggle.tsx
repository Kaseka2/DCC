"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      {theme === "light" ? (
        <>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </>
      ) : (
        <>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </>
      )}
    </Button>
  );
}
