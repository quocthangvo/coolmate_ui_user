import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Auth.css";
import { loginSchema } from "../../../../validations/loginSchema";
import { AuthContext } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.phone_number, data.password);
      toast.success("Đăng nhập thành công!");
      navigate("/"); // Redirect to the home page or another protected route
    } catch (error) {
      console.error("Đăng nhập lỗi:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại sau.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="auth-container">
      <h3>Đăng Nhập</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="login-form">
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            type="tel"
            id="phone"
            {...register("phone_number")}
            className={errors.phone_number ? "error" : ""}
            placeholder="Nhập số điện thoại"
          />
          {errors.phone_number && (
            <p className="error-message">{errors.phone_number.message}</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className={errors.password ? "error" : ""}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="auth-button">
          Đăng Nhập
        </button>
        <div className="form-footer">
          <p>Chưa có tài khoản?</p>
          <Link to="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </div>
  );
}
