 "use client";

import { FormEvent, useEffect, useState } from "react";

type ServiceItem = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

type ServiceForm = {
  title: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  status: "draft" | "published";
};

const emptyForm: ServiceForm = {
  title: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  status: "draft",
};

export default function ServiceManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [formData, setFormData] = useState<ServiceForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/services", {
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services.");
      }

      setServices(result.data);
    } catch (error) {
      console.error("Fetch services error:", error);
      setError(
        error instanceof Error ? error.message : "Unable to load services."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setFormData(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    const title = formData.title.trim();
    const description = formData.description.trim();

    if (!title || !description) {
      setError("Title and description are required.");
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingId);
      const response = await fetch(
        isEditing ? `/api/services/${editingId}` : "/api/services",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category: formData.category.trim(),
            description,
            price: formData.price.trim(),
            duration: formData.duration.trim(),
            status: formData.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      setMessage(
        isEditing
          ? "Service updated successfully."
          : "Service created successfully."
      );

      resetForm();
      await fetchServices();
    } catch (error) {
      console.error("Save service error:", error);
      setError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(service: ServiceItem) {
    setEditingId(service._id);
    setFormData({
      title: service.title,
      category: service.category || "",
      description: service.description,
      price: service.price || "",
      duration: service.duration || "",
      status: service.status,
    });
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete service.");
      }

      setMessage("Service deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchServices();
    } catch (error) {
      console.error("Delete service error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete service."
      );
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">Terra Cacao</p>
            <h1>Service Management</h1>
            <p className="admin-subtitle">
              Create, update, publish, and remove company services.
            </p>
          </div>

          <div className="admin-header-links">
            <a href="/admin/content" className="admin-back">
              Manage content
            </a>
            <a href="/" className="admin-back">
              ← Back to website
            </a>
          </div>
        </header>

        <section className="admin-form-card">
          <div className="admin-card-header">
            <div>
              <h2>{editingId ? "Edit Service" : "Add New Service"}</h2>
              <p>
                {editingId
                  ? "Update the selected service."
                  : "Create a service that can be published on the website."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                className="admin-cancel"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="service-title">Service name</label>
                <input
                  id="service-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Private Chocolate Tasting"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="service-category">Category</label>
                <input
                  id="service-category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Experiences"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="service-price">Price</label>
                <input
                  id="service-price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $35 per person"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="service-duration">Duration</label>
                <input
                  id="service-duration"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g. 60 minutes"
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="service-description">Description</label>
              <textarea
                id="service-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what the service includes..."
                rows={5}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="service-status">Status</label>
              <select
                id="service-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <button
              type="submit"
              className="admin-submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Create Service"}
            </button>

            {message && <p className="admin-message success">{message}</p>}
            {error && <p className="admin-message error">{error}</p>}
          </form>
        </section>

        <section className="admin-list-section">
          <div className="admin-list-header">
            <div>
              <p className="admin-kicker">Database</p>
              <h2>All Services</h2>
            </div>
            <span className="admin-count">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="admin-empty">
              No services yet. Create your first service above.
            </div>
          ) : (
            <div className="admin-content-list">
              {services.map((service) => (
                <article key={service._id} className="admin-content-card">
                  <div className="admin-content-card-header">
                    <div className="admin-content-title">
                      <span className="admin-category">
                        {service.category || "Service"}
                      </span>
                      <h3>{service.title}</h3>
                    </div>

                    <span className={`admin-status ${service.status}`}>
                      <span className="admin-status-dot" />
                      {service.status === "published"
                        ? "Published"
                        : "Draft"}
                    </span>
                  </div>

                  <p className="admin-content-description">
                    {service.description}
                  </p>

                  <div className="admin-product-info">
                    {service.price && (
                      <div className="admin-info-item">
                        <span>Price</span>
                        <strong>{service.price}</strong>
                      </div>
                    )}
                    {service.duration && (
                      <div className="admin-info-item">
                        <span>Duration</span>
                        <strong>{service.duration}</strong>
                      </div>
                    )}
                  </div>

                  <div className="admin-content-footer">
                    <span className="admin-updated">
                      Last updated{" "}
                      {new Date(service.updatedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>

                    <div className="admin-actions">
                      <button
                        type="button"
                        className="admin-edit"
                        onClick={() => handleEdit(service)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-delete"
                        onClick={() => handleDelete(service._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
