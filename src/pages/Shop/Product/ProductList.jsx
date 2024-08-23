import React, { Fragment, useCallback, useEffect, useState } from "react";
import { BiFilter, BiSearch } from "react-icons/bi";
import productsApi from "../../../apis/productsApi";
import errorImage from "../../../asset/img/error_image.png";
import "./css/Product.css";
import "./css/Pagination.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaFilter, FaRegHeart, FaStar } from "react-icons/fa";

export default function ProductList({ categoryId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch products based on the current search term and page
  const fetchProducts = useCallback(
    async (page = 1, searchTerm = "") => {
      setLoading(true);
      try {
        const response = categoryId
          ? await productsApi.findByCategoryId(categoryId, page, 8, searchTerm)
          : await productsApi.getAllProducts(page, 8, searchTerm);

        const productsData = response.data.data.content || [];

        setFilteredProducts(
          searchTerm.trim() === ""
            ? productsData
            : productsData.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
        );

        setTotalPages(response.data.data.totalPages || 1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [categoryId]
  );

  // Retrieve search term from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search") || "";
    setSearchTerm(query);
    fetchProducts(currentPage, query);
  }, [location.search, currentPage, fetchProducts]);

  // Update URL
  const updateURL = (searchTerm) => {
    const params = new URLSearchParams(location.search);
    params.set("search", searchTerm);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  // Clear search term and reload products
  const clearFilter = () => {
    setSearchTerm("");
    updateURL("");
    fetchProducts(currentPage, "");
  };

  const handleSearch = () => {
    updateURL(searchTerm);
    fetchProducts(currentPage, searchTerm);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={
            currentPage === i
              ? "pagination__button active"
              : "pagination__button"
          }
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <Fragment>
      <div className="product__search">
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch}>
          <BiSearch />
        </button>
        <button onClick={clearFilter} className="clear-filter-btn">
          <BiFilter />
          Xóa bộ lọc
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <Fragment>
          <div className="row">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="col-lg-3" key={product.id}>
                  <Link
                    to={`/productDetails/product/${product.id}`}
                    className="product__item"
                  >
                    <div className="product__item form-product">
                      <div className="product__item__pic set-bg h300">
                        <img
                          src={
                            product.productImages &&
                            product.productImages.length > 0
                              ? `http://localhost:8080/uploads/${product.productImages[0]?.imageUrl}`
                              : errorImage
                          }
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          alt="images"
                        />
                        <ul className="product__hover">
                          <li>
                            <FaRegHeart />
                          </li>
                        </ul>
                      </div>

                      <div className="product__item__text">
                        <h6 className="tilte_product">{product.name}</h6>
                        <Link className="add-cart ">+Thêm giỏ hàng</Link>
                        <div className="rating d-flex gap-1">
                          <FaStar color="#ffc107" size="13px" />
                          <FaStar color="#ffc107" size="13px" />
                          <FaStar color="#ffc107" size="13px" />
                          <FaStar color="#ffc107" size="13px" />
                          <FaStar color="#ffc107" size="13px" />
                        </div>
                        <div className="d-flex justify-content-between">
                          {product.productDetails &&
                            product.productDetails.length > 0 &&
                            product.productDetails[0].prices &&
                            product.productDetails[0].prices.length > 0 && (
                              <h5 className="price mt-3">
                                {(
                                  product.productDetails[0].prices[0]
                                    .promotionPrice ||
                                  product.productDetails[0].prices[0]
                                    .priceSelling
                                ).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}
                              </h5>
                            )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="align-content-center">
                Không tìm thấy sản phẩm
              </div>
            )}
          </div>

          <div className="pagination">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="pagination__button"
            >
              &laquo;
            </button>

            {renderPageNumbers()}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="pagination__button"
            >
              &raquo;
            </button>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
}
