import React, { createContext, useContext, useMemo, useState } from "react";
import {ApiContext} from "./ApiContext";
import axios from "axios";

export const CartContext = createContext();

export const ContextProvider = ({ children }) => {
  const { user, setRefresh, refresh } = useContext(ApiContext);

  if (!user) return;




  const handleremove = async (productId) => {

      
      const currentCart = user.cart || []

    const updatedCart = currentCart.filter((c) => c.id !== productId);

    try {
      await axios.patch(`http://localhost:5001/user/${user.id}`, {
        cart: updatedCart,
      });
      setRefresh(prev => !prev);

    } catch (err) {
      console.error("Error removing item from cart", err);
    }

  };

  const updateQuantity = async (productId, newQty) => {
    const updatedCart = (user.cart || []).map((item) =>
      item.id === productId ? { ...item, quantity: newQty } : item
    );

    try {
      await axios.patch(`http://localhost:5001/user/${user.id}`, {
        cart: updatedCart,
      });
      setRefresh(prev=>!prev)

    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

const clearCart = async (user) => {
  try {
    await axios.patch(`http://localhost:5001/user/${user.id}`, {
      cart: [] 
    });
    setRefresh(prev=>!prev)
    console.log("✅ Order placed and cart cleared!");
  } catch (error) {
    console.error("❌ Error placing order:", error);
  }
};


  const handleAddCart = async (product) => {

    
    const currentCart = user.cart || []
    const exist = currentCart.find((c) => c.id === product.id);

    if (exist) {
      const updatedCart = currentCart.map((c) =>
        c.id === product.id ? { ...exist, quantity: exist.quantity + 1 } : c
      );

      try {
        await axios.patch(`http://localhost:5001/user/${user.id}`, {
          cart: updatedCart,
          quantity: 1
        });
        setRefresh(prev=>!prev)

      } catch (err) {
        console.error("Error updating cart", err);
      }
    } else {

      const updatedCart = [...currentCart, { ...product, quantity: 1 }];

      try {
        await axios.patch(`http://localhost:5001/user/${user.id}`, {
          cart: updatedCart,
        });
         setRefresh(prev=>!prev)


      } catch (err) {
        console.error("Error adding to cart", err);
      }
    }
  
  };

const contextValue = useMemo(
  () => ({
    handleAddCart,
    handleremove,
    updateQuantity,
    clearCart
  }),
  [user, refresh, setRefresh]
);

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default ContextProvider;
