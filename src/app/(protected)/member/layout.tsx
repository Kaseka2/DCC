import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getCurrentRole();

  if (!role) {
    redirect("/auth/login");
  }

  if (role !== "member") {
    redirect("/dashboard");
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
