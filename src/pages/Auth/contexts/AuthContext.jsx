import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import usersApi from "../../../apis/usersApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const isTokenValid = () => {
    const token = localStorage.getItem("accessToken");
    const expirationTime = localStorage.getItem("tokenExpiration");

    if (!token || !expirationTime) return false;

    const currentTime = new Date().getTime();
    return currentTime < parseInt(expirationTime, 10);
  };

  const login = async (phone_number, password) => {
    try {
      const response = await usersApi.login(phone_number, password);

      if (response.status === 200) {
        const { token, user } = response.data.data;

        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 1 day

        localStorage.setItem("accessToken", token);
        localStorage.setItem("tokenExpiration", expirationTime.toString());
        localStorage.setItem("user", JSON.stringify(user));

        setUser(user);
        setIsAuthenticated(true);

        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      throw error;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);

    navigate("/");
  }, []);

  useEffect(() => {
    if (isTokenValid()) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } else {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
