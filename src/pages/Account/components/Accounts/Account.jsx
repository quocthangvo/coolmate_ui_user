import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Auth/contexts/AuthContext";
import usersApi from "../../../../apis/usersApi";
import "../../css/Account.css";
import errorImage from "../../../../asset/img/error_image.png";
import AccountLayout from "../../AccountLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Account() {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    phoneNumber: "",
    status: "",
    role: "",
    createdAt: "",
    updatedAt: "",
    profilePicture: "",
    selectedFile: null,
    password: "",
  });

  useEffect(() => {
    if (user?.id) {
      usersApi
        .getUserById(user.id)
        .then((response) => {
          const { data } = response.data;
          setUserData({
            fullName: data.full_name || "",
            phoneNumber: data.phone_number || "",
            status: data.status || "",
            role: data.role.name || "",
            createdAt: new Date(data.created_at).toLocaleDateString() || "",
            updatedAt: new Date(data.updated_at).toLocaleDateString() || "",
            profilePicture: data.profile_picture || "",
            selectedFile: null,
            password: "",
          });
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData({ ...userData, selectedFile: file });
      const fileURL = URL.createObjectURL(file);
      setUserData({ ...userData, profilePicture: fileURL });
    }
  };

  const handleSave = async () => {
    try {
      let profilePictureUrl = userData.profilePicture;

      if (userData.selectedFile) {
        profilePictureUrl = await uploadImage(userData.selectedFile);
      }

      const updateData = {
        fullName: userData.fullName,
        phoneNumber: userData.phoneNumber,
        profilePicture: profilePictureUrl,
        ...(userData.password && { password: userData.password }),
      };

      console.log("Updating user with data:", updateData);
      toast.success("cập nhật thành công");
      const response = await usersApi.updateUser(user.id, updateData);
      console.log("API response:", response);

      // Optionally, you could re-fetch the user data to reflect the latest updates
      const userResponse = await usersApi.getUserById(user.id);
      const { data } = userResponse.data;
      setUserData({
        fullName: data.full_name || "",
        phoneNumber: data.phone_number || "",
        status: data.status || "",
        role: data.role.name || "",
        createdAt: new Date(data.created_at).toLocaleDateString() || "",
        updatedAt: new Date(data.updated_at).toLocaleDateString() || "",
        profilePicture: data.profile_picture || "",
        selectedFile: null,
        password: "",
      });

      setEditing(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
      // Optionally, you could display an error message to the user
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/upload", {
      // Adjust the endpoint as necessary
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.url;
  };

  return (
    <div className="container profiles">
      <AccountLayout userData={userData} />
      <div className="user-profile">
        <h1>Thông tin tài khoản</h1>
        <div className="profile-info">
          <div className="profile-details">
            <div className="profile-item">
              <label htmlFor="fullName">Họ và tên</label>
              {editing ? (
                <input
                  type="text"
                  value={userData.fullName}
                  onChange={handleChange}
                  name="fullName"
                />
              ) : (
                <p>{userData.fullName}</p>
              )}
            </div>
            <div className="profile-item">
              <label htmlFor="phoneNumber">Số điện thoại</label>
              {editing ? (
                <input
                  type="text"
                  value={userData.phoneNumber}
                  onChange={handleChange}
                  name="phoneNumber"
                />
              ) : (
                <p>{userData.phoneNumber}</p>
              )}
            </div>
            <div className="profile-item">
              <label htmlFor="createdAt">Ngày tạo</label>
              <p>{userData.createdAt}</p>
            </div>
          </div>
          <div className="profile-picture">
            <label htmlFor="profilePicture">Ảnh đại diện</label>
            {editing ? (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="profilePicture"
                />
                {userData.selectedFile && (
                  <img
                    src={URL.createObjectURL(userData.selectedFile)}
                    alt="Selected Profile"
                    className="profile-picture-preview"
                  />
                )}
              </>
            ) : (
              <>
                {userData.profilePicture ? (
                  <img
                    src={userData.profilePicture}
                    alt="Profile"
                    className="profile-picture-preview"
                  />
                ) : (
                  <img
                    src={errorImage}
                    alt="Error"
                    className="profile-picture-preview"
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="cancel">
                Hủy
              </button>
              <button onClick={handleSave} className="save">
                Lưu
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="edit">
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
