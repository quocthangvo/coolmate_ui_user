import React, { useState, useEffect } from "react";
import sizesApi from "../../../../../apis/sizesApi";

export default function Size({ onSizeSelect }) {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await sizesApi.getAllSizes();
        setSizes(response.data.data); // Adjust based on actual API response structure
      } catch (error) {
        console.error("Failed to fetch sizes", error);
      }
    };

    fetchSizes();
  }, []);

  return (
    <div className="card">
      <div className="card-heading">
        <button
          className="accordion-button"
          data-toggle="collapse"
          data-target="#collapseFour"
        >
          Size
        </button>
      </div>
      <div
        id="collapseFour"
        className="collapse show"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <div className="shop__sidebar__size">
            {sizes.map((size) => (
              <label key={size.id} htmlFor={size.id}>
                {size.name}
                <input
                  type="radio"
                  id={size.id}
                  name="size"
                  onChange={() => onSizeSelect(size.id)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
