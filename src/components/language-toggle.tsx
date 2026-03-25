"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function LanguageToggle() {
  const { toggleLanguage, t } = useLanguage();

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage}>
      <Languages className="mr-2 h-4 w-4" />
      {t("language")}
    </Button>
  );
}
