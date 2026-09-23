"use client";

import { useEffect, useState } from "react";

type RequestStatus =
  | "Pending"
  | "In Progress"
  | "Resolved"
  | "Rejected";

type CustomerRequest = {
  _id: string;
  customer: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};

const statuses: RequestStatus[] = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
];

export default function RequestManager() {
  const [requests, setRequests] = useState<
    CustomerRequest[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] =
    useState<CustomerRequest | null>(null);

  async function fetchRequests() {
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
            "Unable to load customer requests."
        );
      }

      setRequests(result.data || []);
    } catch (error) {
      console.error(
        "Fetch requests error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load customer requests."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function updateStatus(
    id: string,
    status: RequestStatus
  ) {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `/api/requests/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update request status."
        );
      }

      const updatedRequest =
        result.data as CustomerRequest;

      setRequests((currentRequests) =>
        currentRequests.map((request) =>
          request._id === id
            ? updatedRequest
            : request
        )
      );

      setSelectedRequest((currentRequest) =>
        currentRequest?._id === id
          ? updatedRequest
          : currentRequest
      );
    } catch (error) {
      console.error(
        "Update request status error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update request status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

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
        return "request-status pending";

      case "In Progress":
        return "request-status progress";

      case "Resolved":
        return "request-status resolved";

      case "Rejected":
        return "request-status rejected";

      default:
        return "request-status";
    }
  }

  if (isLoading) {
    return (
      <section className="admin-card">
        <p>Loading customer requests...</p>
      </section>
    );
  }

  return (
    <>
      <section className="admin-card request-manager">
        <div className="request-manager-header">
          <div>
            <h2>Requests</h2>

            <p>
              {requests.length} customer{" "}
              {requests.length === 1
                ? "request"
                : "requests"}{" "}
              received.
            </p>
          </div>

          <button
            type="button"
            className="admin-button secondary"
            onClick={fetchRequests}
          >
            Refresh
          </button>
        </div>

        {error && (
          <div
            className="admin-alert error"
            role="alert"
          >
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="request-empty">
            <h3>No requests yet</h3>

            <p>
              Customer requests will appear here when
              they are submitted.
            </p>
          </div>
        ) : (
          <div className="request-table-wrapper">
            <table className="request-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td>
                      <div className="request-customer">
                        <strong>
                          {request.customerName}
                        </strong>

                        <span>
                          {request.customerEmail}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="request-subject">
                        {request.subject}
                      </span>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          request.status
                        )}
                      >
                        {request.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(
                        request.createdAt
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="admin-button small"
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedRequest && (
        <div
          className="request-modal-backdrop"
          onClick={() =>
            setSelectedRequest(null)
          }
        >
          <section
            className="request-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="request-modal-header">
              <div>
                <p className="admin-kicker">
                  Customer Request
                </p>

                <h2>
                  {selectedRequest.subject}
                </h2>
              </div>

              <button
                type="button"
                className="request-modal-close"
                onClick={() =>
                  setSelectedRequest(null)
                }
                aria-label="Close request details"
              >
                ×
              </button>
            </div>

            <div className="request-details">
              <div className="request-detail">
                <span>Customer</span>

                <strong>
                  {selectedRequest.customerName}
                </strong>
              </div>

              <div className="request-detail">
                <span>Email</span>

                <strong>
                  {selectedRequest.customerEmail}
                </strong>
              </div>

              <div className="request-detail">
                <span>Submitted</span>

                <strong>
                  {formatDate(
                    selectedRequest.createdAt
                  )}
                </strong>
              </div>

              <div className="request-detail">
                <span>Last updated</span>

                <strong>
                  {formatDate(
                    selectedRequest.updatedAt
                  )}
                </strong>
              </div>
            </div>

            <div className="request-message">
              <span>Request details</span>

              <p>
                {selectedRequest.message}
              </p>
            </div>

            <div className="request-status-editor">
              <label htmlFor="request-status">
                Update status
              </label>

              <select
                id="request-status"
                value={selectedRequest.status}
                onChange={(event) =>
                  updateStatus(
                    selectedRequest._id,
                    event.target
                      .value as RequestStatus
                  )
                }
                disabled={
                  updatingId ===
                  selectedRequest._id
                }
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

              {updatingId ===
                selectedRequest._id && (
                <small>
                  Updating status...
                </small>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}