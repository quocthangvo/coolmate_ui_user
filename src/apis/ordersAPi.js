import http from "../configs/http";

const ordersApi = {
  getOrdersByUserId: (userId) => http.get(`orders/user/${userId}`),
  createOrder: (data) => http.post("orders", data),
  getOrderById: (id) => http.get(`orders/${id}`),
  updateOrder: (id, data) => http.put(`orders/update/${id}`, data),
};

export default ordersApi;
