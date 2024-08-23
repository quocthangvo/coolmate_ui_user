import "./css/Breadcrumb.css";

export default function Breadcrumb({ productName }) {
  return (
    <section className="breadcrumb-option">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="breadcrumb__text">
              <div className="breadcrumb__links">
                <a href="/">Trang chủ</a>
                <a href="/shop">Sản Phẩm</a>
                <span>{productName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
