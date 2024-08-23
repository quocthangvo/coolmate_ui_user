import Category from "./components/Category/Category";
import Price from "./components/Price";

import "./css/SideBar.css";

export default function Sidebar({ onCategorySelect }) {
  return (
    <div>
      <div className="shop__sidebar">
        <div className="shop__sidebar__accordion">
          <div className="accordion" id="accordionExample">
            <Category onCategorySelect={onCategorySelect} />
            <Price />
            {/* <Size /> */}
            {/* <Tags /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
