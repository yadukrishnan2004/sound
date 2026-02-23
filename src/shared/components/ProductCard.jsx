import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../features/wishlist/wishlistSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ShoppingCart } from "lucide-react";

function ProductCard({ data }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { wishlistItems } = useSelector((s) => s.wishlist);

  const currentWishlist =
    wishlistItems.length > 0 ? wishlistItems : user?.wishlist || [];

  const like = currentWishlist.some((item) => {
    const wid = item?.product_id || item?.ProductID || item?.id;
    const cid = data?.id || data?.ID;
    return String(wid) === String(cid);
  });

  function toggle(e) {
    e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    if (like) {
      dispatch(removeFromWishlist(data));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(data.id));
      toast.success("Added to wishlist");
    }
  }

  function handleAddCart(e) {
    e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    dispatch(addToCart(data));
    toast.success("Added to cart!");
  }

  const hasOffer = data?.offerprice && Number(data.offerprice) < Number(data.price);
  const discount = hasOffer
    ? Math.round(((data.price - data.offerprice) / data.price) * 100)
    : 0;

  return (
    <div
      onClick={() => navigate(`/Product/${data.id}`)}
      className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Area */}
      <div className="relative bg-gray-50 flex items-center justify-center h-52 overflow-hidden">
        <img
          src={data?.images?.[0] || "/noimage.png"}
          alt={data?.name}
          className="max-h-44 object-contain group-hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist Button */}
        <button
          onClick={toggle}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border transition
            ${like
              ? "bg-rose-500 border-rose-500 text-white"
              : "bg-white border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-300"
            }`}
        >
          {like ? <AiFillHeart size={18} /> : <AiOutlineHeart size={18} />}
        </button>
        {/* Discount Badge */}
        {hasOffer && (
          <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {/* Out of Stock */}
        {data?.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-gray-500 font-semibold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
          {data?.category || data?.mainCategory}
        </p>
        <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug mb-2">
          {data?.name}
        </h3>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto mb-3">
          <span className="text-xl font-extrabold text-gray-900">
            ₹{Number(hasOffer ? data.offerprice : data.price).toLocaleString("en-IN")}
          </span>
          {hasOffer && (
            <span className="text-sm text-gray-400 line-through">
              ₹{Number(data.price).toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddCart}
          disabled={data?.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold text-sm transition"
        >
          <ShoppingCart size={16} />
          {data?.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;