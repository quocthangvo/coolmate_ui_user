import React from "react";

import In1 from "../../../asset/img/instagram/instagram-1.jpg";
import In2 from "../../../asset/img/instagram/instagram-2.jpg";
import In3 from "../../../asset/img/instagram/instagram-3.jpg";
import In4 from "../../../asset/img/instagram/instagram-4.jpg";
import In5 from "../../../asset/img/instagram/instagram-5.jpg";
import In6 from "../../../asset/img/instagram/instagram-6.jpg";

export default function Instagram() {
  return (
    <section className="instagram spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="instagram__pic">
              <div
                className="instagram__pic__item set-bg"
                style={{ backgroundImage: `url(${In1})` }}
              ></div>
              <div
                className="instagram__pic__item set-bg"
                style={{ backgroundImage: `url(${In2})` }}
              ></div>
              <div
                className="instagram__pic__item set-bg"
                style={{ backgroundImage: `url(${In3})` }}
              ></div>
              <div
                className="instagram__pic__item set-bg"
                style={{ backgroundImage: `url(${In4})` }}
              ></div>
              <div
                className="instagram__pic__item set-bg"
                style={{ backgroundImage: `url(${In5})` }}
              ></div>
              <div
                className="instagram__pic__item set-bg"
                style={{ backgroundImage: `url(${In6})` }} // Thay đổi nếu có thêm hình ảnh
              ></div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="instagram__text">
              <h2>Instagram</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <h3>#Male_Fashion</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
