export default function Price() {
  return (
    <div className="card">
      <div className="card-heading">
        <button
          className="accordion-button"
          data-toggle="collapse"
          data-target="#collapseThree"
        >
          Filter Price
        </button>
      </div>
      <div
        id="collapseThree"
        className="collapse show"
        data-parent="#accordionExample"
      >
        <div className="card-body">
          <div className="shop__sidebar__price">
            <ul>
              <li>
                <a href="/filter?price=0-50">$0.00 - $50.00</a>
              </li>
              <li>
                <a href="/filter?price=50-100">$50.00 - $100.00</a>
              </li>
              <li>
                <a href="/filter?price=100-150">$100.00 - $150.00</a>
              </li>
              <li>
                <a href="/filter?price=150-200">$150.00 - $200.00</a>
              </li>
              <li>
                <a href="/filter?price=200-250">$200.00 - $250.00</a>
              </li>
              <li>
                <a href="/filter?price=250-plus">$250.00+</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
