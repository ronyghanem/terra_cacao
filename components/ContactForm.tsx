"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("");
    setIsSuccess(false);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    // Frontend validation
    if (!name || !email || !subject || !message) {
      setStatus("Please complete all fields.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus(
          result.message ||
            "Something went wrong. Please try again."
        );
        return;
      }

      setIsSuccess(true);
      setStatus(
        result.message ||
          "Your inquiry has been submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact form error:", error);

      setStatus(
        "Unable to send your inquiry. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="contact-form-row">
        <div className="contact-field">
          <label htmlFor="contact-name">Name</label>

          <input
            id="contact-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="contact-email">Email</label>

          <input
            id="contact-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="contact-subject">Subject</label>

        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What would you like to ask?"
          required
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message">Message</label>

        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write your message..."
          rows={6}
          required
        />
      </div>

      <button
        type="submit"
        className="btn btn-solid"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send inquiry"}
      </button>

      {status && (
        <p
          className={`contact-status ${
            isSuccess ? "success" : "error"
          }`}
          role="status"
          aria-live="polite"
        >
          {status}
        </p>
      )}
    </form>
  );
}