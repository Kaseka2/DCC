"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export function LogoutButton() {
  const router = useRouter();
  const { t } = useLanguage();

  async function handleLogout() {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.replace("/auth/login");
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      {t("signOut")}
    </Button>
  );
}
