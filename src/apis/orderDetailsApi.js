import http from "../configs/http";

const orderDetailsApi = {
  getOrderDetailByOrderId: (id) => http.get(`order_details/order/${id}`),
  updateOrderDetail: (id, data) => http.put(`order_details/update/${id}`, data),
};

export default orderDetailsApi;
