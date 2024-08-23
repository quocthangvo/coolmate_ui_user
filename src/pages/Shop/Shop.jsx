import React, { useState } from "react";
import ProductList from "./Product/ProductList";
import Sidebar from "./SideBar";
import Slider from "./Slider";

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  return (
    <div>
      <div className="container">
        <Slider />
        <div className="row">
          <div className="col-lg-3">
            <Sidebar onCategorySelect={handleCategorySelect} />
          </div>
          <div className="col-lg-9">
            <div className="row">
              <ProductList categoryId={selectedCategory} />
            </div>
            <div className="row">{/* Hiển thị danh sách sản phẩm */}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
