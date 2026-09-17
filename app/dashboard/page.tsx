import { redirect } from "next/navigation";

import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserSession } from "@/lib/userAuth";
import DashboardForm from "./DashboardForm";

export default async function DashboardPage() {
  const userId = await getUserSession();

  if (!userId) {
    redirect("/login");
  }

  await connectToDatabase();

  const user = await User.findById(userId).select(
    "name email createdAt"
  );

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-page">
      <DashboardForm
        user={{
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        }}
      />
    </main>
  );
}