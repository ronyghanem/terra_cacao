import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import ContentManager from "./ContentManager";

export default async function AdminContentPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return <ContentManager />;
}