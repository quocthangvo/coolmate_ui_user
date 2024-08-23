import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ordersApi from "../../../../apis/ordersAPi";
import "../../css/OrderDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheck,
  faTruck,
  faBox,
  faBan,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import AccountLayout from "../../AccountLayout";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Mã đơn hàng không có.");
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        const response = await ordersApi.getOrderById(id);
        setOrder(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        setError("Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const handleProductClick = (productId) => {
    navigate(`/productDetails/product/${productId}`);
  };

  const handleReorderClick = () => {
    const products = order.orderDetails.map((item) => ({
      productDetailId: item.product_detail_id.id,
      quantity: item.quantity,
    }));

    navigate("/orderPage", { state: { selectedItems: products } });
  };

  const statusTranslation = {
    PENDING: { text: "Chờ xử lý", icon: faClock, className: "status-pending" },
    PROCESSING: {
      text: "Đã xác nhận",
      icon: faCheck,
      className: "status-processing",
    },
    SHIPPING: {
      text: "Đang giao hàng",
      icon: faTruck,
      className: "status-shipping",
    },
    DELIVERED: {
      text: "Đã giao hàng",
      icon: faBox,
      className: "status-delivered",
    },
    CANCELLED: { text: "Đã hủy", icon: faBan, className: "status-cancelled" },
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (!order) return <div>Đơn hàng không tìm thấy.</div>;

  return (
    <div className="container d-flex">
      <AccountLayout />
      <div className="order-detail-container container">
        <div className="tabs">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Trở về
          </button>
        </div>

        <div className="order-summary">
          <h3>Đơn hàng</h3>
          <p>
            <strong>Mã đơn hàng:</strong> {order.order_code || "Không có"}
          </p>
          <p>
            <strong>Ngày đặt hàng:</strong>{" "}
            {order.order_date
              ? new Date(order.order_date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Không có"}
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            <span
              className={`status-icon ${
                statusTranslation[order.status]?.className || "status-unknown"
              }`}
            >
              <FontAwesomeIcon
                icon={statusTranslation[order.status]?.icon || faBan}
              />
              {statusTranslation[order.status]?.text || "Không xác định"}
            </span>
          </p>
          <div className="d-flex justify-content-between">
            <p>
              <strong>Tổng số tiền:</strong>{" "}
              <strong style={{ color: "red", fontSize: "20px" }}>
                {order.total_money
                  ? order.total_money.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "Không có"}
              </strong>
            </p>
            <div className="sale-button">
              <button onClick={handleReorderClick}>Mua lại</button>
            </div>
          </div>
        </div>

        <div className="order-items">
          <h3>Sản phẩm</h3>
          {order.orderDetails.length > 0 ? (
            order.orderDetails.map((item) => {
              const priceDetails = item.product_detail_id?.price || [];
              const priceSelling = priceDetails?.price_selling || 0;
              const promotionPrice = priceDetails?.promotion_price || 0;

              return (
                <div
                  key={item.id}
                  className="order-item"
                  onClick={() =>
                    handleProductClick(item.product_detail_id.product_id)
                  }
                >
                  <img
                    src={`http://localhost:8080/uploads/${
                      item.product_detail_id?.images
                        ? item.product_detail_id.images[0]
                        : "default-image.png"
                    }`}
                    alt={item.product_detail_id?.version_name || "Sản phẩm"}
                    className="order-item-image"
                  />
                  <div className="order-item-info">
                    <p>
                      {item.product_detail_id?.product_name || "Không có tên"}
                    </p>
                    <p>
                      Phân loại: {item.product_detail_id?.size_name},{" "}
                      {item.product_detail_id?.color_name}
                    </p>
                    <p>Số lượng: {item.quantity || 0}</p>
                    <p>
                      Giá:{" "}
                      {promotionPrice > 0 ? (
                        <>
                          <span className="price-selling price-strikethrough">
                            {priceSelling.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                          <span className="price-promotion">
                            {promotionPrice.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </span>
                        </>
                      ) : (
                        <span className="price-selling price-highlight">
                          {priceSelling.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>Không có sản phẩm nào.</p>
          )}
        </div>

        <div className="order-shipping">
          <h3>Thông tin giao hàng</h3>
          <p>
            <strong>Địa chỉ:</strong> {order.address || "Không có"}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {order.phone_number || "Không có"}
          </p>
          <p>
            <strong>Ngày giao hàng:</strong>{" "}
            {order.shipping_date
              ? new Date(order.shipping_date).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : "Không có"}
          </p>
          <p>
            <strong>Phương thức giao hàng:</strong>{" "}
            {order.shipping_method || "Thanh toán khi nhận hàng"}
          </p>
        </div>
      </div>
    </div>
  );
}
