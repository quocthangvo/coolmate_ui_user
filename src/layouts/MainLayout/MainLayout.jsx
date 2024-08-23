import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./css/Main.css";
export default function MainLayout({ children }) {
  return (
    <div className="">
      <Header />

      <div className="main">{children}</div>
      <Footer />
    </div>
  );
}
