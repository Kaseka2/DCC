"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";

export function LanguageToggle() {
  const { toggleLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" aria-hidden="true">
        Language
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage}>
      <Languages className="mr-2 h-4 w-4" />
      {t("language")}
    </Button>
  );
}
