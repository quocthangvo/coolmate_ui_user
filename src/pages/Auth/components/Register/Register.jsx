import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Auth.css";
import { toast } from "react-toastify";
import usersApi from "../../../../apis/usersApi";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      fullName === "" ||
      phoneNumber === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      setError("Tất cả các trường đều bắt buộc");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      // Call the API to register the user with role_id set to 1 by default
      const response = await usersApi.register(phoneNumber, password, fullName);
      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        setError(response.data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      setError("Có lỗi xảy ra trong quá trình đăng ký");
    }
  };

  return (
    <div className="auth-container">
      <h3>Đăng Ký</h3>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="full-name">Họ và tên</label>
          <input
            type="text"
            id="full-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone-number">Số điện thoại</label>
          <input
            type="tel"
            id="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mật khẩu</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="auth-button">
          Đăng Ký
        </button>
        <div className="form-footer">
          <p>Bạn đã có tài khoản?</p>
          <Link to="/login" className="auth-link">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}
