import React, { useState, useContext } from "react";
import { BiSearchAlt, BiUser } from "react-icons/bi";
import { RiHeartLine, RiShoppingCartLine } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import logo from "../../../../asset/img/logo.png";
import { CartContext } from "../../../../pages/Shop/Cart/context/CartContext";
import { AuthContext } from "../../../../pages/Auth/contexts/AuthContext";
import "./css/Header.css";
import emptyCart from "../../../../asset/img/empty_cart.png";

export default function Header() {
  const [showCart, setShowCart] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartItems } = useContext(CartContext);
  const { user, logout, isAuthenticated } = useContext(AuthContext);

  const handleMouseEnter = () => setShowCart(true);
  const handleMouseLeave = () => setShowCart(false);

  const handleDropdownMouseEnter = () => setShowDropdown(true);
  const handleDropdownMouseLeave = () => setShowDropdown(false);

  const calculateTotalProducts = () => {
    return cartItems.length;
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <header className="header">
      <div className="header__top">
        <div className="container">
          <div className="row">
            <div className="header__top__links">
              {isAuthenticated ? (
                <div
                  className="user-info"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <BiUser />
                  <span>Hi, {user?.full_name || "User"}</span>
                  {showDropdown && (
                    <div className="user-dropdown">
                      <Link to="/account" className="user-dropdown-item">
                        Tài khoản của tôi
                      </Link>
                      <Link to="/orderHistory" className="user-dropdown-item">
                        Đơn hàng
                      </Link>
                      <button onClick={handleLogout}>Đăng xuất</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{ color: "white" }}>
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container header__end">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <div className="header__logo">
              <NavLink to="/">
                <img src={logo} alt="Logo" />
              </NavLink>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <nav className="header__menu mobile-menu">
              <ul>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Trang chủ
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/shop"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Sản phẩm
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="/pages"
                    className={({ isActive }) => (isActive ? "active" : "")}
                  >
                    Pages
                  </NavLink>
                  <ul className="dropdown">
                    <li>
                      <NavLink to="/about">About Us</NavLink>
                    </li>
                    <li>
                      <NavLink to="/shop-details">Shop Details</NavLink>
                    </li>
                    <li>
                      <NavLink to="/shopping-cart">Shopping Cart</NavLink>
                    </li>
                    <li>
                      <NavLink to="/checkout">Check Out</NavLink>
                    </li>
                    <li>
                      <NavLink to="/blog-details">Blog Details</NavLink>
                    </li>
                  </ul>
                </li> */}
              </ul>
            </nav>
          </div>
          <div className="col-lg-3 col-md-3">
            <div className="header__nav__option">
              <BiSearchAlt style={{ fontSize: "24px", marginRight: "15px" }} />
              <RiHeartLine style={{ fontSize: "24px", marginRight: "15px" }} />
              <div
                className="cart-icon-wrapper"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/cart" className="me-3 cart-icon-link">
                  <RiShoppingCartLine
                    style={{
                      fontSize: "24px",
                      color: "#111111",
                      marginRight: "15px",
                    }}
                  />
                  {cartItems.length > 0 && (
                    <span className="cart-quantity-badge">
                      {calculateTotalProducts()}
                    </span>
                  )}
                </Link>
                <div className="mb-2"></div>
                {showCart && (
                  <div className="cart-dropdown">
                    {cartItems.length > 0 ? (
                      <>
                        <div className="new-product-header">
                          <span>Sản phẩm mới thêm</span>
                        </div>
                        {cartItems.map((item, index) => (
                          <div className="cart-item" key={index}>
                            <img
                              src={`http://localhost:8080/uploads/${
                                item.productDetails?.images[0] ||
                                "default-image.png"
                              }`}
                              alt={item.productDetails?.version_name}
                              className="cart-item-image"
                            />
                            <div className="cart-item-info">
                              <p className="product-name">
                                {item.productDetails?.version_name}
                              </p>
                              <p>
                                {(
                                  item.productDetails?.price?.price_selling *
                                  item.quantity
                                ).toLocaleString()}{" "}
                                đ
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="cart-total">
                          <p>Số lượng: {calculateTotalProducts()}</p>
                          <Link to="/cart" className="cart-title">
                            Xem giỏ hàng
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="empty-cart-container">
                        <img
                          src={emptyCart}
                          alt="Empty Cart"
                          className="empty-cart-image"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="canvas__open">
          <i className="fa fa-bars" />
        </div>
      </div>
    </header>
  );
}
