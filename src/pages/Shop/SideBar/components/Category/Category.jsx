import React, { useEffect, useState } from "react";
import categoriesApi from "../../../../../apis/categoriesApi";
import "./css/Category.css";

export default function Category({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAllCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.log("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCheckboxChange = (categoryId) => {
    const newSelectedCategory =
      categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newSelectedCategory);
    onCategorySelect(newSelectedCategory);
  };

  return (
    <div className="card">
      <div className="card-heading">
        <button
          className="accordion-buttons"
          data-toggle="collapse"
          data-target="#collapseOne"
        >
          Danh mục
        </button>
      </div>
      <div
        id="collapseOne"
        className="collapse show"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <div>
            <ul
              className="nice-scroll"
              tabIndex={1}
              style={{
                overflowY: "auto",
                outline: "none",
                listStyle: "none",
              }}
            >
              {categories.map((category) => (
                <li key={category.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategory === category.id}
                      onChange={() => handleCheckboxChange(category.id)}
                      className="me-2"
                    />
                    <span>{category.name}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
