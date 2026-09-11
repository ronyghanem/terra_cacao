"use client";

import { FormEvent, useEffect, useState } from "react";

type ContentItem = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  weight: string;
  cacao: string;
  style: string;
  ferment: string;
  notes: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

type FormData = {
  title: string;
  category: string;
  description: string;
  price: string;
  weight: string;
  cacao: string;
  style: string;
  ferment: string;
  notes: string;
  status: "draft" | "published";
};

const emptyForm: FormData = {
  title: "",
  category: "",
  description: "",
  price: "",
  weight: "",
  cacao: "",
  style: "",
  ferment: "",
  notes: "",
  status: "draft",
};

export default function ContentManagementPage() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchContent() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/content");

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load content."
        );
      }

      setContent(result.data);
    } catch (error) {
      console.error("Fetch content error:", error);

      setError("Unable to load content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContent();
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    const title = formData.title.trim();
    const category = formData.category.trim();
    const description = formData.description.trim();

    if (!title || !category || !description) {
      setError(
        "Title, category, and description are required."
      );
      return;
    }

    try {
      setSaving(true);

      const isEditing = Boolean(editingId);

      const url = isEditing
        ? `/api/content/${editingId}`
        : "/api/content";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
          description,
          price: formData.price.trim(),
          weight: formData.weight.trim(),
          cacao: formData.cacao.trim(),
          style: formData.style.trim(),
          ferment: formData.ferment.trim(),
          notes: formData.notes.trim(),
          status: formData.status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Something went wrong."
        );
      }

      setMessage(
        isEditing
          ? "Content updated successfully."
          : "Content created successfully."
      );

      resetForm();

      await fetchContent();
    } catch (error) {
      console.error("Save content error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(item: ContentItem) {
    setEditingId(item._id);

    setFormData({
      title: item.title,
      category: item.category,
      description: item.description,
      price: item.price || "",
      weight: item.weight || "",
      cacao: item.cacao || "",
      style: item.style || "",
      ferment: item.ferment || "",
      notes: item.notes || "",
      status: item.status,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this content item?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/content/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete content."
        );
      }

      setMessage("Content deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchContent();
    } catch (error) {
      console.error("Delete content error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete content."
      );
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">
              Terra Cacao
            </p>

            <h1>Content Management</h1>

            <p className="admin-subtitle">
              Manage website content without needing a developer.
            </p>
          </div>

          <a href="/" className="admin-back">
            ← Back to website
          </a>
        </header>

        <section className="admin-form-card">
          <div className="admin-card-header">
            <div>
              <h2>
                {editingId
                  ? "Edit Content"
                  : "Add New Content"}
              </h2>

              <p>
                {editingId
                  ? "Update the selected content item."
                  : "Create a new content item for the website."}
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

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            {/* Basic information */}
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="title">
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Ambanja, Madagascar"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="category">
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  type="text"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Products"
                />
              </div>
            </div>

            {/* Description */}
            <div className="admin-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write the product description..."
                rows={5}
              />
            </div>

            {/* Chocolate details */}
            <div className="admin-form-grid">
              <div className="admin-field">
                <label htmlFor="price">
                  Price
                </label>

                <input
                  id="price"
                  name="price"
                  type="text"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $9"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="weight">
                  Weight
                </label>

                <input
                  id="weight"
                  name="weight"
                  type="text"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="e.g. 70g"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="cacao">
                  Cacao
                </label>

                <input
                  id="cacao"
                  name="cacao"
                  type="text"
                  value={formData.cacao}
                  onChange={handleChange}
                  placeholder="e.g. 70%"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="style">
                  Style
                </label>

                <input
                  id="style"
                  name="style"
                  type="text"
                  value={formData.style}
                  onChange={handleChange}
                  placeholder="e.g. Dark"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="ferment">
                  Ferment
                </label>

                <input
                  id="ferment"
                  name="ferment"
                  type="text"
                  value={formData.ferment}
                  onChange={handleChange}
                  placeholder="e.g. 6 days"
                />
              </div>
            </div>

            {/* Tasting notes */}
            <div className="admin-field">
              <label htmlFor="notes">
                Tasting Notes
              </label>

              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Red berry, citrus peel, light tannin."
                rows={3}
              />
            </div>

            {/* Status */}
            <div className="admin-field">
              <label htmlFor="status">
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
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
                  ? "Update Content"
                  : "Add Content"}
            </button>

            {message && (
              <p className="admin-message success">
                {message}
              </p>
            )}

            {error && (
              <p className="admin-message error">
                {error}
              </p>
            )}
          </form>
        </section>

        {/* Existing content */}
        <section className="admin-list-section">
          <div className="admin-list-header">
            <div>
              <p className="admin-kicker">
                Database
              </p>

              <h2>Existing Content</h2>
            </div>

            <span className="admin-count">
              {content.length} item
              {content.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="admin-empty">
              Loading content...
            </div>
          ) : content.length === 0 ? (
            <div className="admin-empty">
              No content items yet.
            </div>
          ) : (
            <div className="admin-content-list">
              {content.map((item) => (
           <article
      key={item._id}
      className="admin-content-card"
    >
      {/* Header */}
      <div className="admin-content-card-header">
        <div className="admin-content-title">
          <span className="admin-category">
            {item.category}
          </span>

          <h3>{item.title}</h3>
        </div>

        <span
          className={`admin-status ${item.status}`}
        >
          <span className="admin-status-dot" />

          {item.status === "published"
            ? "Published"
            : "Draft"}
        </span>
      </div>

      {/* Description */}
      {item.description && (
        <p className="admin-content-description">
          {item.description}
        </p>
      )}

      {/* Details */}
      <div className="admin-product-info">
        {item.price && (
          <div className="admin-info-item">
            <span>Price</span>
            <strong>{item.price}</strong>
          </div>
        )}

        {item.weight && (
          <div className="admin-info-item">
            <span>Weight</span>
            <strong>{item.weight}</strong>
          </div>
        )}

        {item.cacao && (
          <div className="admin-info-item">
            <span>Cacao</span>
            <strong>{item.cacao}</strong>
          </div>
        )}

        {item.style && (
          <div className="admin-info-item">
            <span>Style</span>
            <strong>{item.style}</strong>
          </div>
        )}

        {item.ferment && (
          <div className="admin-info-item">
            <span>Fermentation</span>
            <strong>{item.ferment}</strong>
          </div>
        )}
      </div>

      {/* Tasting Notes */}
      {item.notes && (
        <div className="admin-tasting-notes">
          <span>Tasting Notes</span>
          <p>{item.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="admin-content-footer">
        <span className="admin-updated">
          Last updated{" "}
          {new Date(item.updatedAt).toLocaleString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }
          )}
        </span>

        <div className="admin-actions">
          <button
            type="button"
            className="admin-edit"
            onClick={() => handleEdit(item)}
          >
            Edit
          </button>

          <button
            type="button"
            className="admin-delete"
            onClick={() =>
              handleDelete(item._id)
            }
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