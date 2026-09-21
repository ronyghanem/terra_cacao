 "use client";

import { useEffect, useState } from "react";

type ServiceItem = {
  _id: string;
  title: string;
  category: string;
  description: string;
  price: string;
  duration: string;
};

export default function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("/api/services/published", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load services.");
        }

        const result = await response.json();

        if (result.success) {
          setServices(result.data);
        }
      } catch (error) {
        console.error("Failed to load homepage services:", error);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="service-grid">
        <p>Loading our services...</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="service-grid">
        <p>No services are currently available.</p>
      </div>
    );
  }

  return (
    <div className="service-grid">
      {services.map((service) => (
        <article className="service-card" key={service._id}>
          <div className="service-card-top">
            <div>
              <span className="service-category">
                {service.category || "Service"}
              </span>
              <h3>{service.title}</h3>
            </div>

            {service.price && (
              <span className="service-price">{service.price}</span>
            )}
          </div>

          <p>{service.description}</p>

          {service.duration && (
            <div className="service-duration">
              <span>Duration</span>
              <strong>{service.duration}</strong>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
