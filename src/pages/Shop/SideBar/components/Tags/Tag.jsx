export default function Tag() {
  return (
    <div className="card">
      <div className="card-heading">
        <button
          className="accordion-button"
          data-toggle="collapse"
          data-target="#collapseSix"
        >
          Tags
        </button>
      </div>
      <div
        id="collapseSix"
        className="collapse show"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <div className="shop__sidebar__tags">
            <a href="/tags/product">Product</a>
            <a href="/tags/bags">Bags</a>
            <a href="/tags/shoes">Shoes</a>
            <a href="/tags/fashion">Fashion</a>
            <a href="/tags/clothing">Clothing</a>
            <a href="/tags/hats">Hats</a>
            <a href="/tags/accessories">Accessories</a>
          </div>
        </div>
      </div>
    </div>
  );
}
