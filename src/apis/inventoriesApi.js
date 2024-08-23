import http from "../configs/http";

const inventoriesApi = {
  getAllInventories: (page = 1, limit = 5) => {
    return http.get(`inventories?page=${page}&limit=${limit}`);
  },
  findByProductDetailId: (id) =>
    http.get(`inventories/search?productDetailId=${id}`),
};

export default inventoriesApi;
