import React, { createContext, useCallback, useMemo } from "react";
import { useAuth } from "../../AuthContext/authcontext";
import axios from "axios";
import BASE_URL from "../../config/baseUrl";

export const CartContext = createContext();

export const ContextProvider = ({ children }) => {
  const { user, fetchUserProfile } = useAuth();

  const handleremove = useCallback(
    async (productId) => {
      if (!user) return;

      try {
        await axios.delete(`${BASE_URL}/cart/${productId}`, {
          withCredentials: true,
        });
        await fetchUserProfile(); // Refresh user data
        console.log("✅ Item removed from cart");
      } catch (err) {
        console.error("❌ Error removing item from cart:", err);
      }
    },
    [user, fetchUserProfile]
  );

  const updateQuantity = useCallback(
    async (productId, newQty) => {
      if (!user) return;

      try {
        await axios.put(
          `${BASE_URL}/cart/${productId}`,
          { quantity: newQty },
          { withCredentials: true }
        );
        await fetchUserProfile(); // Refresh user data
        console.log("✅ Quantity updated");
      } catch (err) {
        console.error("❌ Error updating quantity:", err);
      }
    },
    [user, fetchUserProfile]
  );

  const clearCart = useCallback(
    async () => {
      if (!user) return;

      try {
        await axios.delete(`${BASE_URL}/cart/clear`, {
          withCredentials: true,
        });
        await fetchUserProfile(); // Refresh user data
        console.log("✅ Cart cleared!");
      } catch (error) {
        console.error("❌ Error clearing cart:", error);
      }
    },
    [user, fetchUserProfile]
  );

  const handleAddCart = useCallback(
    async (product) => {
      if (!user) return;

      try {
        await axios.post(
          `${BASE_URL}/cart/add`,
          {
            product_id: product.id,
            quantity: 1,
          },
          { withCredentials: true }
        );
        await fetchUserProfile(); // Refresh user data
        console.log("✅ Product added to cart");
      } catch (err) {
        console.error("❌ Error adding to cart:", err);
      }
    },
    [user, fetchUserProfile]
  );

  const contextValue = useMemo(
    () => ({
      handleAddCart,
      handleremove,
      updateQuantity,
      clearCart,
    }),
    [handleAddCart, handleremove, updateQuantity, clearCart]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default ContextProvider;
