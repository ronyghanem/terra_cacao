"use client";

import { useEffect, useState } from "react";

type RequestStatus =
  | "Pending"
  | "In Progress"
  | "Resolved"
  | "Rejected";

type CustomerRequest = {
  _id: string;
  subject: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};

export default function MyRequests() {
  const [requests, setRequests] = useState<
    CustomerRequest[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setError("");

      const response = await fetch(
        "/api/requests",
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load your requests."
        );
      }

      setRequests(result.data || []);
    } catch (error) {
      console.error(
        "Load customer requests error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your requests."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();

    const interval = setInterval(
      loadRequests,
      15000
    );

    return () => clearInterval(interval);
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  function getStatusClass(
    status: RequestStatus
  ) {
    switch (status) {
      case "Pending":
        return "customer-request-status pending";

      case "In Progress":
        return "customer-request-status progress";

      case "Resolved":
        return "customer-request-status resolved";

      case "Rejected":
        return "customer-request-status rejected";

      default:
        return "customer-request-status";
    }
  }

  if (isLoading) {
    return (
      <section className="my-requests-card">
        <div className="my-requests-header">
          <p className="dashboard-kicker">
            Request History
          </p>

          <h2>My Requests</h2>
        </div>

        <p className="my-requests-loading">
          Loading your requests...
        </p>
      </section>
    );
  }

  return (
    <section className="my-requests-card">
      <div className="my-requests-header">
        <div>
          <p className="dashboard-kicker">
            Request History
          </p>

          <h2>My Requests</h2>

          <p>
            Track the progress of your submitted
            requests.
          </p>
        </div>

        <button
          type="button"
          className="my-requests-refresh"
          onClick={loadRequests}
        >
          Refresh
        </button>
      </div>

      {error && (
        <p
          className="dashboard-message error"
          role="alert"
        >
          {error}
        </p>
      )}

      {requests.length === 0 ? (
        <div className="my-requests-empty">
          <h3>No requests yet</h3>

          <p>
            Your submitted requests will appear here.
          </p>
        </div>
      ) : (
        <div className="my-requests-list">
          {requests.map((request) => (
            <article
              className="my-request-item"
              key={request._id}
            >
              <div className="my-request-top">
                <div>
                  <h3>{request.subject}</h3>

                  <p>
                    Submitted{" "}
                    {formatDate(
                      request.createdAt
                    )}
                  </p>
                </div>

                <span
                  className={getStatusClass(
                    request.status
                  )}
                >
                  {request.status}
                </span>
              </div>

              <p className="my-request-message">
                {request.message}
              </p>

              <div className="my-request-footer">
                <span>
                  Last updated{" "}
                  {formatDate(
                    request.updatedAt
                  )}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}