"use client";

import { useEffect, useState } from "react";

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

export default function ContentBars() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      try {
        const response = await fetch(
          "/api/content/published"
        );

        if (!response.ok) {
          throw new Error("Failed to load content.");
        }

        const result = await response.json();

        if (result.success) {
          setContent(result.data);
        }
      } catch (error) {
        console.error(
          "Failed to load homepage content:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, []);

  if (loading) {
    return (
      <div className="bar-grid-cards">
        <p>Loading our latest bars...</p>
      </div>
    );
  }

  if (content.length === 0) {
    return (
      <div className="bar-grid-cards">
        <p>No bars are currently available.</p>
      </div>
    );
  }

  return (
    <div className="bar-grid-cards">
      {content.map((item) => (
        <article
          className="bar-card"
          key={item._id}
        >
          <div className="bar-card-top">
            <h3>{item.title}</h3>

            {item.price && (
              <span className="bar-price">
                {item.price}
                {item.weight
                  ? ` / ${item.weight}`
                  : ""}
              </span>
            )}
          </div>

          <ul className="bar-meta">
            {item.cacao && (
              <li>
                <span>Cacao</span>
                {item.cacao}
              </li>
            )}

            {item.style && (
              <li>
                <span>Style</span>
                {item.style}
              </li>
            )}

            {item.ferment && (
              <li>
                <span>Ferment</span>
                {item.ferment}
              </li>
            )}
          </ul>

          <p className="bar-notes">
            {item.notes || item.description}
          </p>
        </article>
      ))}
    </div>
  );
}