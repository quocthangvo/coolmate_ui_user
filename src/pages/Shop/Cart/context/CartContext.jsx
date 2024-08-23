import React, { createContext, useState, useEffect, useContext } from "react";
import productDetailsApi from "../../../../apis/productDetailsApi";
import { AuthContext } from "../../../Auth/contexts/AuthContext";

const EXPIRATION_TIME = 3 * 24 * 60 * 60 * 1000; // 3 ngày tính bằng mili giây

const getCartFromLocalStorage = (userId) => {
  if (!userId) return [];

  const cartData = localStorage.getItem(`cartItems_${userId}`);
  const timestamp = localStorage.getItem(`cartItems_${userId}_timestamp`);

  if (cartData && timestamp) {
    const now = new Date().getTime();
    if (now - parseInt(timestamp, 10) < EXPIRATION_TIME) {
      return JSON.parse(cartData);
    } else {
      localStorage.removeItem(`cartItems_${userId}`);
      localStorage.removeItem(`cartItems_${userId}_timestamp`);
    }
  }

  return [];
};

const setCartToLocalStorage = (userId, cartItems) => {
  if (!userId) return;

  localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
  localStorage.setItem(
    `cartItems_${userId}_timestamp`,
    new Date().getTime().toString()
  );
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [cartItems, setCartItems] = useState(getCartFromLocalStorage(userId));

  useEffect(() => {
    if (userId) {
      setCartItems(getCartFromLocalStorage(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      setCartToLocalStorage(userId, cartItems);
    }
  }, [cartItems, userId]);

  const fetchProductDetails = async (productDetailId) => {
    try {
      const response = await productDetailsApi.getByProductDetailId(
        productDetailId
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      return null;
    }
  };

  const addToCart = async (item) => {
    const productDetails = await fetchProductDetails(item.productDetailId);

    if (productDetails) {
      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (i) =>
            i.productDetailId === item.productDetailId &&
            i.color === item.color &&
            i.size === item.size
        );

        if (existingItemIndex !== -1) {
          // Item already exists, update quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += item.quantity;
          return updatedItems;
        } else {
          // Item does not exist, add new item with product details
          return [...prevItems, { ...item, productDetails }];
        }
      });
    }
  };

  const incrementQuantity = (index) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index].quantity += 1;
      return newItems;
    });
  };

  const decrementQuantity = (index) => {
    setCartItems((prevItems) => {
      const newItems = [...prevItems];
      if (newItems[index].quantity > 1) {
        newItems[index].quantity -= 1;
      }
      return newItems;
    });
  };

  const removeItem = (index) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
