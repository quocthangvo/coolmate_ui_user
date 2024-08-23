import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import productDetailsApi from "../../apis/productDetailsApi";
import ordersApi from "../../apis/ordersAPi";
import "./css/OrderPage.css";
import { AuthContext } from "../Auth/contexts/AuthContext";
import { toast } from "react-toastify";
import orderPageSchema from "../../validations/orderPageSchema";

export default function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const selectedItems = location.state?.selectedItems || [];

      try {
        const details = await Promise.all(
          selectedItems.map(async (item) => {
            if (!item.productDetailId || item.productDetailId <= 0) {
              return null;
            }

            try {
              const response = await productDetailsApi.getByProductDetailId(
                item.productDetailId
              );
              return {
                ...response.data.data,
                quantity: item.quantity,
                productDetailId: response.data.data.price.product_detail_id.id,
              };
            } catch (error) {
              console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
              return null;
            }
          })
        );

        setProductDetails(details.filter((detail) => detail !== null));
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };

    fetchProductDetails();
  }, [location.state?.selectedItems]);

  const handleOrder = async (values) => {
    if (!user || !user.id) {
      console.error("Người dùng không được xác thực");
      return;
    }

    const orderData = {
      user_id: user.id,
      full_name: values.name,
      email: user.email,
      phone_number: values.phone,
      address: values.address,
      order_details: productDetails.map((product) => ({
        product_detail_id: product.productDetailId,
        quantity: product.quantity,
      })),
    };

    try {
      const response = await ordersApi.createOrder(orderData);
      toast.success(response.data.message);
      navigate("/shop");
    } catch (error) {
      toast.error("Đặt hàng không thành công. Vui lòng thử lại.");
    }
  };

  const totalAmount = productDetails.reduce(
    (sum, product) => sum + product.price.price_selling * product.quantity,
    0
  );
  const shippingFee = 30000;
  const grandTotal = totalAmount + shippingFee;

  return (
    <div className="order-page">
      <h2>Thông tin đặt hàng</h2>
      <Formik
        initialValues={{
          name: "",
          phone: "",
          address: "",
          paymentMethod: "cod",
        }}
        validationSchema={orderPageSchema}
        onSubmit={(values) => handleOrder(values)}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="address-form">
              <h3>Địa chỉ giao hàng</h3>
              <div className="address-item">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <Field type="text" name="name" />
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="error-message"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <Field type="text" name="phone" />
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="error-message"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <Field as="textarea" name="address" />
                <ErrorMessage
                  name="address"
                  component="p"
                  className="error-message"
                />
              </div>
            </div>

            <div className="selected-products">
              <h3>Sản phẩm</h3>
              <table>
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Phân loại</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {productDetails.map((product, index) => {
                    const itemPrice = product.price.price_selling;
                    const totalPrice = itemPrice * product.quantity;

                    return (
                      <tr key={index}>
                        <td>
                          <img
                            src={`http://localhost:8080/uploads/${
                              product.images ? product.images[0] : ""
                            }`}
                            alt={product.version_name}
                            className="product-image"
                          />
                        </td>
                        <td>{product.product_name}</td>
                        <td>
                          {product.size_name},{product.color_name}
                        </td>
                        <td>{itemPrice.toLocaleString()}đ</td>
                        <td>{product.quantity}</td>
                        <td>{totalPrice.toLocaleString()}đ</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="payment-and-total-form">
              <h3>Phương thức thanh toán</h3>
              <div className="form-group">
                <label>
                  <Field type="radio" name="paymentMethod" value="cod" />
                  Thanh toán khi nhận hàng
                </label>
                <label>
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="online_payment"
                  />
                  Thanh toán trực tuyến
                </label>

                <label>
                  <Field
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                  />
                  Chuyển khoản ngân hàng
                </label>

                <ErrorMessage
                  name="paymentMethod"
                  component="p"
                  className="error-message"
                />
              </div>

              <div className="total-amount">
                <div className="total-amount-item">
                  <p>Tổng tiền hàng</p>
                  <p className="amount-item">
                    {totalAmount.toLocaleString()} đ
                  </p>
                </div>
                <div className="total-amount-item">
                  <p>Phí vận chuyển</p>
                  <p className="amount-item">
                    {shippingFee.toLocaleString()} đ
                  </p>
                </div>
                <div className="total-amount-item">
                  <p>Tổng thanh toán</p>
                  <p className="amount-item">
                    <strong>{grandTotal.toLocaleString()} đ</strong>
                  </p>
                </div>
              </div>

              <div className="order-button">
                <button type="submit" disabled={isSubmitting}>
                  Đặt hàng
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
