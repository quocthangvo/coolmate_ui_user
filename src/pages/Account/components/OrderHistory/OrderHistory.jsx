import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/OrderHistory.css";
import AccountLayout from "../../AccountLayout";
import { AuthContext } from "../../../Auth/contexts/AuthContext";
import ordersApi from "../../../../apis/ordersAPi";
import emptyCart from "../../../../asset/img/empty-cart-1.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "../../../../components/Confirm/ConfirmModal";
import { CartContext } from "../../../Shop/Cart/context/CartContext";

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext); // Use CartContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user && user.id) {
          const response = await ordersApi.getOrdersByUserId(user.id);
          console.log("Fetched orders:", response.data.data);

          const sortedOrders = response.data.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const statusMap = {
    "Tất cả": ["PENDING", "PROCESSING", "SHIPPING", "DELIVERED"],
    "Chờ xử lý": ["PENDING"],
    "Đã xác nhận": ["PROCESSING"],
    "Đang giao hàng": ["SHIPPING"],
    "Đã giao hàng": ["DELIVERED"],
    Hủy: ["CANCELLED"],
  };

  const statusTranslation = {
    PENDING: "Chờ xử lý",
    PROCESSING: "Đã xác nhận",
    SHIPPING: "Đang giao hàng",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Hủy",
  };

  const categorizedOrders = (status) => {
    const statuses = statusMap[status];
    return orders.filter((order) => statuses.includes(order.status));
  };

  const currentOrders = categorizedOrders(activeTab);

  const handleCancelOrder = (orderId) => {
    setOrderToCancel(orderId);
    setShowModal(true);
  };

  const confirmCancelOrder = async () => {
    try {
      if (!orderToCancel) {
        throw new Error("Order ID is required");
      }

      const response = await ordersApi.updateOrder(orderToCancel, {
        status: "CANCELLED",
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderToCancel ? { ...order, status: "CANCELLED" } : order
        )
      );

      toast.success(
        response.data.message || "Đơn hàng đã được hủy thành công!"
      );

      setShowModal(false);
      setOrderToCancel(null);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  const handleViewOrderDetail = (orderId) => {
    navigate(`/orderDetail/${orderId}`);
  };

  const handleBuyAgain = async (order) => {
    try {
      for (const item of order.orderDetails) {
        await addToCart({
          productDetailId: item.product_detail_id.id,
          color: item.product_detail_id.color_name,
          size: item.product_detail_id.size_name,
          quantity: item.quantity,
        });
      }
      toast.success("Đơn hàng đã được thêm vào giỏ hàng!");
      navigate("/cart");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm đơn hàng vào giỏ hàng.");
    }
  };

  return (
    <div className="container orders">
      <AccountLayout />
      <div className="order-form">
        <div className="tabs">
          {Object.keys(statusMap).map((status) => (
            <button
              key={status}
              className={
                activeTab === status ? "tab-button active" : "tab-button"
              }
              onClick={() => setActiveTab(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="order-list">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order.created_at} className="order-card">
                <div className="order-items">
                  {order.orderDetails.length > 0 ? (
                    order.orderDetails.map((item) => (
                      <div
                        key={item.id}
                        className="order-item-card"
                        onClick={() => handleViewOrderDetail(order.id)}
                      >
                        <img
                          src={`http://localhost:8080/uploads/${item.product_detail_id.images[0]}`}
                          alt={item.product_detail_id.version_name}
                          className="order-item-image"
                        />
                        <div className="order-item-details">
                          <h4>
                            {item.product_detail_id.product_name} (
                            {item.product_detail_id.version_name})
                          </h4>
                          <p>
                            Phân loại: {item.product_detail_id.size_name},{" "}
                            {item.product_detail_id.color_name}
                          </p>
                          <p>X {item.quantity}</p>
                        </div>
                        <div className="order-item-prices">
                          {item.product_detail_id.price.promotion_price > 0 ? (
                            <>
                              <p className="price-selling">
                                {item.product_detail_id.price.price_selling.toLocaleString(
                                  "vi-VN",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                              </p>
                              <p className="price-promotion">
                                {item.product_detail_id.price.promotion_price.toLocaleString(
                                  "vi-VN",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                              </p>
                            </>
                          ) : (
                            <p className="price-selling">
                              {item.product_detail_id.price.price_selling.toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "VND",
                                }
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No items</p>
                  )}
                </div>
                <div className="order-actions">
                  <div>
                    Thành tiền:
                    <p>
                      {order.orderDetails
                        .reduce(
                          (total, item) =>
                            total +
                            (item.product_detail_id.price.promotion_price ||
                              item.product_detail_id.price.price_selling) *
                              item.quantity,
                          0
                        )
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="orders">
                      <div className="order-date">
                        Ngày đặt hàng:{" "}
                        {new Date(order.order_date).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </div>
                      <div className="order-status">
                        Trạng thái: {statusTranslation[order.status]}
                      </div>
                    </div>

                    {order.status === "DELIVERED" && (
                      <button
                        onClick={() => handleBuyAgain(order)}
                        className="item-button"
                      >
                        Mua lại
                      </button>
                    )}
                    {order.status === "PENDING" && (
                      <button
                        className="item-button"
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">
              <img src={emptyCart} alt="Empty cart" />
              <p>Không có đơn hàng nào.</p>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <ConfirmModal
          title="Xác nhận hủy đơn hàng"
          message="Bạn có chắc chắn muốn hủy đơn hàng này?"
          onCancel={() => setShowModal(false)}
          onConfirm={confirmCancelOrder}
        />
      )}
    </div>
  );
}
