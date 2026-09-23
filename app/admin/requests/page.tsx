import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/adminAuth";
import RequestManager from "./RequestManager";

export default async function AdminRequestsPage() {
  const isAdmin = await isAdminAuthenticated();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <p className="admin-kicker">
              Customer Support
            </p>

            <h1>Customer Requests</h1>

            <p className="admin-subtitle">
              Review customer requests and manage their
              current status.
            </p>
          </div>

          <div className="admin-header-links">
            <a
              href="/admin/services"
              className="admin-back"
            >
              Services
            </a>

            <a
              href="/admin/content"
              className="admin-back"
            >
              Content
            </a>

            <a
              href="/"
              className="admin-back"
            >
              Back to site
            </a>
          </div>
        </div>

        <RequestManager />
      </div>
    </main>
  );
}