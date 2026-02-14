import axios from "axios";
import { createContext, useCallback, useMemo } from "react";
import { useAuth } from "../../AuthContext/authcontext";
import BASE_URL from "../../config/baseUrl";

export const WishlistContext = createContext();

export function Wishlist({ children }) {
  const { user, fetchUserProfile } = useAuth();

  /* ======================
        ADD TO WISHLIST
     ====================== */
  const handleAddWish = useCallback(
    async (product) => {
      if (!user) {
        console.warn("User not logged in");
        return;
      }

      // 🔥 support both id and ProductID
      const productId = product?.id || product?.product_id;

      try {
        await axios.post(
          `${BASE_URL}/wishlist/${productId}`,
          {},
          { withCredentials: true }
        );

        await fetchUserProfile(); // refresh profile
        console.log("✅ Added to wishlist");
      } catch (err) {
        console.error("❌ Add wishlist error:", err.response?.data);
      }
    },
    [user, fetchUserProfile]
  );

  /* ======================
        REMOVE FROM WISHLIST
     ====================== */
  const removeWish = useCallback(
    async (product) => {
      if (!user) {
        console.warn("User not logged in");
        return;
      }

      console.log("productsss",product);
      
      const productId = product.product_id;

      try {
        await axios.delete(`${BASE_URL}/wishlist/${productId}`, {
          withCredentials: true,
        });

        await fetchUserProfile();
        console.log("✅ Removed from wishlist");
      } catch (err) {
        console.error("❌ Remove wishlist error:", err.response?.data);
      }
    },
    [user, fetchUserProfile]
  );

  /* ======================
        CLEAR WISHLIST
     ====================== */
  const clearWishlist = useCallback(async () => {
    if (!user) return;

    try {
      await axios.delete(`${BASE_URL}/wishlist`, {
        withCredentials: true,
      });

      await fetchUserProfile();
      console.log("🧹 Wishlist cleared");
    } catch (err) {
      console.error("❌ Clear wishlist error:", err.response?.data);
    }
  }, [user, fetchUserProfile]);

  /* ======================
        CONTEXT VALUE
     ====================== */
  const contextValue = useMemo(
    () => ({
      removeWish,
      handleAddWish,
      clearWishlist,
    }),
    [removeWish, handleAddWish, clearWishlist]
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}
