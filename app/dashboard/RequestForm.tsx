"use client";

import { FormEvent, useState } from "react";

export default function RequestForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFeedback("");
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFeedback(
          result.message ||
            "Unable to submit your request."
        );
        return;
      }

      setIsSuccess(true);
      setFeedback(
        result.message ||
          "Your request has been submitted successfully."
      );

      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Request submission error:", error);

      setFeedback(
        "Unable to submit your request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="request-card">
      <div className="request-card-header">
        <p className="dashboard-kicker">
          Customer Support
        </p>

        <h2>Submit a Request</h2>

        <p>
          Tell us how we can help. Your request will be
          reviewed by our team.
        </p>
      </div>

      <form
        className="request-form"
        onSubmit={handleSubmit}
      >
        <div className="dashboard-field">
          <label htmlFor="request-subject">
            Subject
          </label>

          <input
            id="request-subject"
            type="text"
            value={subject}
            onChange={(event) =>
              setSubject(event.target.value)
            }
            placeholder="What do you need help with?"
            minLength={3}
            maxLength={150}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="dashboard-field">
          <label htmlFor="request-message">
            Request details
          </label>

          <textarea
            id="request-message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Describe your request in detail..."
            minLength={10}
            maxLength={5000}
            rows={7}
            required
            disabled={isSubmitting}
          />
        </div>

        {feedback && (
          <p
            className={
              isSuccess
                ? "dashboard-message success"
                : "dashboard-message error"
            }
            role="status"
          >
            {feedback}
          </p>
        )}

        <button
          type="submit"
          className="dashboard-save request-submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Submitting..."
            : "Submit Request"}
        </button>
      </form>
    </section>
  );
}