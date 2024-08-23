import * as yup from "yup";

const orderPageSchema = yup.object().shape({
  name: yup.string().required("Họ và tên là bắt buộc"),
  phone: yup.string().required("Số điện thoại là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
});

export default orderPageSchema;
