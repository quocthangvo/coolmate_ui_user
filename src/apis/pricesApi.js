import http from "../configs/http";

const pricesApi = {
  getAllPrices: (page = 1, limit = 5) => {
    return http.get(`prices?page=${page}&limit=${limit}`);
  },
  getPriceByProductDetailId: (id) => http.get(`prices/product_detail/${id}`),
};

export default pricesApi;
