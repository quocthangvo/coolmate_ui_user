import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Shop from "../pages/Shop";

import Home from "../pages/Home/Home";
import ProductDetail from "../pages/Shop/ProductDetail";
import CartList from "../pages/Shop/Cart/CartList";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Auth/components/Login/Login";
import Register from "../pages/Auth/components/Register/Register";
import Accounts from "../pages/Account/components/Accounts";
import OrderPage from "../pages/Order/OrderPage";
import OrderHistory from "../pages/Account/components/OrderHistory/OrderHistory";
import OrderDetail from "../pages/Account/components/OrderDetail/OrderDetail";

export default function useRouterElement() {
  return useRoutes([
    {
      path: "/",
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },
    {
      path: "/shop",
      element: (
        <MainLayout>
          <Shop />
        </MainLayout>
      ),
    },
    {
      path: "productDetails/product/:id",
      element: (
        <MainLayout>
          <ProductDetail />
        </MainLayout>
      ),
    },
    {
      path: "/cart",
      element: (
        <MainLayout>
          <CartList />
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <AuthLayout>
          <Login />
        </AuthLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <AuthLayout>
          <Register />
        </AuthLayout>
      ),
    },

    {
      path: "/account",
      element: (
        <MainLayout>
          <Accounts />
        </MainLayout>
      ),
    },
    {
      path: "/orderHistory",
      element: (
        <MainLayout>
          <OrderHistory />
        </MainLayout>
      ),
    },
    {
      path: "/orderPage",
      element: (
        <MainLayout>
          <OrderPage />
        </MainLayout>
      ),
    },
    {
      path: "/orderDetail/:id",
      element: (
        <MainLayout>
          <OrderDetail />
        </MainLayout>
      ),
    },
  ]);
}
