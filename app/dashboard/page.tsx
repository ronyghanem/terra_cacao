import { redirect } from "next/navigation";

import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/rbac";
import DashboardForm from "./DashboardForm";
import RequestForm from "./RequestForm";
import MyRequests from "./MyRequests";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  await connectToDatabase();

  const user = await User.findById(currentUser.id).select(
    "name email createdAt role"
  );

  if (!user) {
    redirect("/login");
  }

  const isEmployee = user.role === "employee";

  return (
    <main className="dashboard-page">
      <DashboardForm
        user={{
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        }}
      />

      {isEmployee && (
        <>
          <RequestForm />
          <MyRequests />
        </>
      )}
    </main>
  );
}
