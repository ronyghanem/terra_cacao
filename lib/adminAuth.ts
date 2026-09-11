import { cookies } from "next/headers";

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const adminCookie = cookieStore.get("terra_admin");

  return adminCookie?.value === "authenticated";
}