import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../Auth/contexts/AuthContext";
import { Link } from "react-router-dom";
import { BiBox, BiUser } from "react-icons/bi";
import errorImage from "../../asset/img/error_image.png";
import usersApi from "../../apis/usersApi";
import "./css/AccountLayout.css";

export default function AccountLayout() {
  const { user } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    fullName: "",
    profilePicture: "",
  });
  useEffect(() => {
    if (user?.id) {
      usersApi
        .getUserById(user.id)
        .then((response) => {
          const { data } = response.data;
          setUserData({
            fullName: data.full_name || "",
            profilePicture: data.profile_picture || "",
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [user]);

  return (
    <div className="link-profile">
      <div className="link-profile-account">
        {userData.profilePicture ? (
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="profile-picture-item"
          />
        ) : (
          <img src={errorImage} alt="Error" className="profile-picture-item" />
        )}

        <p>{userData.fullName}</p>
      </div>
      <div className="link-profile-item">
        <div>
          <BiUser className="icon" />
          Tài khoản
        </div>
        <div className="item-link">
          <Link to="/account" className="ms-4 ">
            Hồ sơ
          </Link>
          <Link to="/account" className="ms-4 ">
            Đổi mật khẩu
          </Link>
        </div>
      </div>

      <div className="link-profile-item">
        <BiBox className="icon" />
        <Link to="/orderHistory">Đơn hàng</Link>
      </div>
    </div>
  );
}
