import { redirect } from "next/navigation";
import { getCurrentRole } from "@/lib/auth";
import UserManagement from "./user-management";

export default async function UserManagementPage() {
  const role = await getCurrentRole();

  if (role !== "admin") {
    redirect("/dashboard");
  }

  return <UserManagement />;
}
