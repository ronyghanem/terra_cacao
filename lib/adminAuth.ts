import { getCurrentUser } from "@/lib/rbac";

export async function isAdminAuthenticated() {
  const user = await getCurrentUser();

  return user?.role === "admin";
}