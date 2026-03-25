 "use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useLanguage } from "@/components/language-provider";

export default function MemberPortal() {
  const { t } = useLanguage();
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="space-y-6">
        <PageHeader
          title={t("memberPortal")}
          description={t("memberPortalBody")}
        />
        <Card>
          <CardHeader>
            <CardTitle>{t("whatNext")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t("memberPortalBody")}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
