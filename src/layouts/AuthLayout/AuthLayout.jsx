import React from "react";
import "./css/AuthLayout.css";
import Footer from "../MainLayout/components/Footer";
import { Link } from "react-router-dom";
import logo from "../../asset/img/logo.png";
import Login from "../../asset/img/Login.png";

export default function AuthLayout({ children }) {
  return (
    <div className="auth">
      <div className="header">
        <div className="header__top"></div>
        <div className="container header__end">
          <div className="row">
            <div className="col-lg-3 col-md-3">
              <div className="header__logo">
                <Link to="/">
                  <img src={logo} alt="Logo" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="form-auth">
        <img src={Login} alt="Login" />
        <div className="">{children}</div>
      </div>

      <Footer />
    </div>
  );
}
