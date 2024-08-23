import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "./context/CartContext";
import productDetailsApi from "../../../apis/productDetailsApi";
import "./css/Cart.css";
import emptyCart from "../../../asset/img/empty_cart.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/contexts/AuthContext";

export default function CartList() {
  const { cartItems, incrementQuantity, decrementQuantity, removeItem } =
    useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext); // Get authentication status
  const [detailedProducts, setDetailedProducts] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [notification, setNotification] = useState(""); // Thêm trạng thái thông báo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      const details = {};
      for (const item of cartItems) {
        try {
          const response = await productDetailsApi.getByProductDetailId(
            item.productDetailId
          );
          details[item.productDetailId] = response.data.data;
        } catch (error) {
          console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        }
      }
      setDetailedProducts(details);
    };

    fetchProductDetails();
  }, [cartItems]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(cartItems.map((item) => item.productDetailId));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (productDetailId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productDetailId)
        ? prevSelectedItems.filter((id) => id !== productDetailId)
        : [...prevSelectedItems, productDetailId]
    );
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach((itemId) => {
      const index = cartItems.findIndex(
        (item) => item.productDetailId === itemId
      );
      if (index !== -1) {
        removeItem(index);
      }
    });
    setSelectedItems([]);
  };

  const calculateSelectedTotals = () => {
    let totalQuantity = 0;
    let totalAmount = 0;

    selectedItems.forEach((itemId) => {
      const item = cartItems.find((i) => i.productDetailId === itemId);
      if (item) {
        const productDetail = detailedProducts[item.productDetailId] || {};
        const itemPrice = item.price
          ? item.price.price_selling
          : productDetail.price
          ? productDetail.price.price_selling
          : 0;
        totalQuantity += item.quantity;
        totalAmount += itemPrice * item.quantity;
      }
    });

    return { totalQuantity, totalAmount };
  };

  const { totalQuantity, totalAmount } = calculateSelectedTotals();

  const handleBuy = () => {
    if (!isAuthenticated) {
      navigate("/login"); // Redirect to login page if not authenticated
      return;
    }

    if (selectedItems.length === 0) {
      setNotification("Vui lòng chọn ít nhất một sản phẩm để tiếp tục.");
      return;
    }

    const selectedItemsWithQuantity = selectedItems
      .map((itemId) => {
        const item = cartItems.find((i) => i.productDetailId === itemId);
        return item ? { ...item, quantity: item.quantity } : null;
      })
      .filter((item) => item !== null);

    if (selectedItemsWithQuantity.length > 0) {
      navigate("/orderPage", {
        state: { selectedItems: selectedItemsWithQuantity },
      });
    }
  };

  const handleProductNameClick = (productId) => {
    navigate(`/productDetails/product/${productId}`);
  };

  return (
    <div className="cart">
      <h2>Giỏ hàng</h2>
      {notification && <p className="notification-message">{notification}</p>}
      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <img
            src={emptyCart}
            alt="Giỏ hàng trống"
            className="empty-cart-image"
          />
          <p className="empty-cart-message">Giỏ hàng của bạn trống.</p>
        </div>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === cartItems.length}
                    className="check-box"
                  />
                </th>
                <th>Hình ảnh</th>
                <th style={{ width: "300px" }}>Sản phẩm</th>
                <th>Phân loại</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Tổng tiền</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => {
                const productDetail =
                  detailedProducts[item.productDetailId] || {};
                const itemPrice = item.price
                  ? item.price.price_selling
                  : productDetail.price
                  ? productDetail.price.price_selling
                  : 0;
                const totalPrice = itemPrice * item.quantity;

                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.productDetailId)}
                        onChange={() => handleSelectItem(item.productDetailId)}
                        className="check-box"
                      />
                    </td>
                    <td>
                      <img
                        src={`http://localhost:8080/uploads/${
                          productDetail.images ? productDetail.images[0] : ""
                        }`}
                        alt={productDetail.version_name}
                        className="cart-item-image"
                      />
                    </td>
                    <td>
                      <span
                        className="product-name-link"
                        onClick={() =>
                          handleProductNameClick(productDetail.product_id)
                        }
                      >
                        {productDetail.product_name}
                      </span>
                    </td>
                    <td>
                      {productDetail.size_name},{productDetail.color_name}
                    </td>
                    <td>{itemPrice.toLocaleString()}đ</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          onClick={() => decrementQuantity(index)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">
                          {item.quantity}
                        </span>
                        <button onClick={() => incrementQuantity(index)}>
                          +
                        </button>
                      </div>
                    </td>
                    <td className="total-price">
                      {totalPrice.toLocaleString()}đ
                    </td>
                    <td>
                      <button
                        className="remove-button"
                        onClick={() => {
                          removeItem(index);
                          setSelectedItems((prev) =>
                            prev.filter((id) => id !== item.productDetailId)
                          );
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {cartItems.length > 0 && (
            <div className="selected-actions">
              <div className="selected-buy">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedItems.length === cartItems.length}
                  className="check-box"
                />
                <span>Chọn tất cả ({totalQuantity})</span>
                <button
                  className="remove-selected-button"
                  onClick={handleRemoveSelected}
                >
                  Xóa
                </button>
              </div>

              <div className="selected-summary">
                <div className="me-3">
                  <p>Số lượng: ({totalQuantity} sản phẩm)</p>
                  <p className="total-prices">
                    Tổng tiền: {totalAmount.toLocaleString()}đ
                  </p>
                </div>

                <button className="buy-button" onClick={handleBuy}>
                  Mua hàng
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
