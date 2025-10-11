import axios from "axios";
import {ApiContext } from "./ApiContext";
import { createContext, useContext } from "react";

export const wish =createContext();
export function Wishlist({ children }) {
  const { user, setRefresh } = useContext(ApiContext);

  const handleAddWish = async (product) => {
    const currentWishes = user?.wishes || [];
    const updatedWishes = [...currentWishes, String(product.id)];

    try {
      await axios.patch(`http://localhost:5001/user/${user.id}`, {
        wishes: updatedWishes,
      });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error adding to wishlist", err);
    }
  };

  const removeWish = async (product) => {
    const currentWishes = user?.wishes || [];
    const updatedWishes = currentWishes.filter((id) => id !== String(product.id));

    try {
      await axios.patch(`http://localhost:5001/user/${user.id}`, {
        wishes: updatedWishes,
      });
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("Error removing from wishlist", err);
    }
  };
  console.log('this is wish list ' ,user)

  return (
    <wish.Provider value={{ removeWish, handleAddWish }}>
      {children}
    </wish.Provider>
  )
  
}
