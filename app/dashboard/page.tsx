import { redirect } from "next/navigation";

import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserSession } from "@/lib/userAuth";

export default async function DashboardPage() {
  const userId = await getUserSession();

  if (!userId) {
    redirect("/login");
  }

  await connectToDatabase();

  const user = await User.findById(userId).select(
    "name email"
  );

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-card">
        <p className="dashboard-kicker">
          Terra Cacao
        </p>

        <h1>Welcome, {user.name}</h1>

        <p className="dashboard-description">
          You are successfully authenticated.
        </p>

        <div className="dashboard-user">
          <div>
            <span>Name</span>
            <strong>{user.name}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <form
          action="/api/auth/logout"
          method="POST"
        >
          <button
            type="submit"
            className="dashboard-logout"
          >
            Log out
          </button>
        </form>

        <a
          href="/"
          className="dashboard-back"
        >
          ← Back to website
        </a>
      </div>
    </main>
  );
}