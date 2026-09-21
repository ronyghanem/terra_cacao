import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import ServiceManager from "./ServiceManager";

export default async function AdminServicesPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return <ServiceManager />;
}
