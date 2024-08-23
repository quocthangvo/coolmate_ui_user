import http from "../configs/http";

const usersApi = {
  login: (phone_number, password) => {
    return http.post(`users/login`, { phone_number, password });
  },
  register: (phone_number, password, fullname, role_id = 1) => {
    return http.post(`users/register`, {
      phone_number,
      password,
      fullname,
      role_id,
    });
  },
  getUserById: (id) => http.get(`users/${id}`),
  updateUser: (id, data) => http.put(`users/update/${id}`, data),
};

export default usersApi;
