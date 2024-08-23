import http from "../configs/http";

const categoriesApi = {
  getAllCategories: (page = 1, limit = 5) => {
    return http.get(`categories?page=${page}&limit=${limit}`);
  },
  getCategoyById: (id) => http.get(`categories/${id}`),
};

export default categoriesApi;
