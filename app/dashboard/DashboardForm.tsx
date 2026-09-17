"use client";

import { FormEvent, useState } from "react";

type UserData = {
  name: string;
  email: string;
  createdAt: string;
};

type Props = {
  user: UserData;
};

export default function DashboardForm({
  user,
}: Props) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const [isEditing, setIsEditing] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [isSuccess, setIsSuccess] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(
        "/api/customer",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setMessage(
          result.message ||
            "Failed to update your account."
        );
        return;
      }

      setName(result.user.name);
      setEmail(result.user.email);

      setIsSuccess(true);
      setMessage(
        result.message ||
          "Your account has been updated successfully."
      );

      setIsEditing(false);
    } catch (error) {
      console.error(
        "Dashboard update error:",
        error
      );

      setIsSuccess(false);
      setMessage(
        "Unable to update your account. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function cancelEditing() {
    setName(user.name);
    setEmail(user.email);
    setMessage("");
    setIsEditing(false);
  }

  return (
    <div className="dashboard-card">
      <p className="dashboard-kicker">
        Terra Cacao
      </p>

      <h1>
        Welcome, {name}
      </h1>

      <p className="dashboard-description">
        Manage your account information.
      </p>

      {!isEditing ? (
        <>
          <div className="dashboard-user">
            <div>
              <span>Name</span>
              <strong>{name}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{email}</strong>
            </div>

            <div>
              <span>Member since</span>
              <strong>
                {new Date(
                  user.createdAt
                ).toLocaleDateString()}
              </strong>
            </div>
          </div>

          {message && (
            <p
              className={
                isSuccess
                  ? "dashboard-message success"
                  : "dashboard-message error"
              }
              role="status"
            >
              {message}
            </p>
          )}

          <button
            type="button"
            className="dashboard-edit"
            onClick={() => {
              setMessage("");
              setIsEditing(true);
            }}
          >
            Edit account
          </button>
        </>
      ) : (
        <form
          className="dashboard-edit-form"
          onSubmit={handleSubmit}
        >
          <div className="dashboard-field">
            <label htmlFor="dashboard-name">
              Name
            </label>

            <input
              id="dashboard-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <div className="dashboard-field">
            <label htmlFor="dashboard-email">
              Email
            </label>

            <input
              id="dashboard-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          {message && (
            <p
              className={
                isSuccess
                  ? "dashboard-message success"
                  : "dashboard-message error"
              }
              role="alert"
            >
              {message}
            </p>
          )}

          <div className="dashboard-actions">
            <button
              type="submit"
              className="dashboard-save"
              disabled={isSaving}
            >
              {isSaving
                ? "Saving..."
                : "Save changes"}
            </button>

            <button
              type="button"
              className="dashboard-cancel"
              onClick={cancelEditing}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="dashboard-footer">
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
    </div>
  );
}