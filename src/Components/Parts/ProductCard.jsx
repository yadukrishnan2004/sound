import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cartcontext";
import { wish } from "../context/wishlist";
import { ApiContext } from "../context/ApiContext";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function ProductCard({ data }) {
  const { handleAddCart } = useContext(CartContext);
  const { user } = useContext(ApiContext);
  const { removeWish, handleAddWish } = useContext(wish);
  const navigate = useNavigate();

  const like = user?.wishes?.includes(String(data.id));

  async function toggle() {
    if (like) await removeWish(data);
    else await handleAddWish(data);
  }

  function gotoDetail() {
    navigate(`/Product/${data.id}`);
  }

  return (
    <div
      className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg 
                 hover:shadow-xl transition-all duration-300 rounded-2xl 
                 flex flex-col items-center text-center p-5 w-full max-w-sm"
    >
      {/* Image Section */}
      <div
        className="w-full h-56 flex items-center justify-center bg-white/20 rounded-xl mb-4 overflow-hidden cursor-pointer"
        onClick={gotoDetail}
      >
        <img
          src={data.images[0]}
          alt={data.name}
          className="max-h-48 object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <h3 className="text-xl font-bold text-white mb-2">{data.name}</h3>
      <p className="text-white/70 text-sm mb-4">
        {data.description?.substring(0, 50)}...
      </p>
      <span className="text-2xl font-extrabold text-amber-400 mb-4">
        ₹{data.price}
      </span>

      {/* Action Buttons */}
      <div className="flex gap-4 w-full">
        <button
          className="flex-1 bg-amber-500 text-black py-2 rounded-full font-semibold 
                     hover:bg-amber-600 transition"
          onClick={() => handleAddCart(data)}
        >
          Add to Cart
        </button>

        <button
          className={`w-12 h-12 flex items-center justify-center border rounded-full transition 
            ${like ? "bg-red-500 border-red-500" : "border-white/30 hover:bg-white/10"}`}
          aria-label={like ? "Remove from favorites" : "Add to favorites"}
          onClick={toggle}
        >
          {like ? (
            <AiFillHeart className="text-white text-xl" />
          ) : (
            <AiOutlineHeart className="text-white text-xl" />
          )}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;