import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const role = await getCurrentRole();

  if (!role) {
    redirect("/auth/login");
  }

  if (role === "member") {
    redirect("/member");
  }

  redirect("/dashboard");
}
