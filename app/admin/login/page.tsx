"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Invalid login credentials."
        );
        return;
      }

      router.push("/admin/content");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <p className="admin-kicker">
          Terra Cacao
        </p>

        <h1>Content Management</h1>

        <p className="admin-login-description">
          Sign in to manage website content.
        </p>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-field">
            <label htmlFor="admin-email">
              Email
            </label>

            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="admin-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {error && (
            <p className="admin-message error">
              {error}
            </p>
          )}
        </form>

        <a
          href="/"
          className="admin-login-back"
        >
          ← Back to website
        </a>
      </div>
    </main>
  );
}