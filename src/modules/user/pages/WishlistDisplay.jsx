import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../../features/cart/cartSlice";
import { removeFromWishlist, clearWishlist } from "../../../features/wishlist/wishlistSlice";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";

function WishlistDisplay() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const wishlist = wishlistItems.length > 0 ? wishlistItems : user?.wishlist || [];

  const handleRemove = (product) => { dispatch(removeFromWishlist(product)); toast.success("Removed from wishlist"); };
  const handleAddCart = (product) => { dispatch(addToCart(product)); toast.success("Added to cart!"); };
  const handleClear = () => {
    if (!window.confirm("Clear your entire wishlist?")) return;
    dispatch(clearWishlist()).unwrap()
      .then(() => toast.success("Wishlist cleared"))
      .catch(() => toast.error("Failed to clear wishlist"));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="text-rose-500" size={22} fill="currentColor" />
              My Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{wishlist.length} saved items</p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="text-rose-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm mb-8">Save products you love to your wishlist</p>
            <button
              onClick={() => navigate("/allproducts")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map((product, idx) => {
              const pid = product?.product_id || product?.id;
              const images = product?.Images || product?.images || [];
              const price = product?.Price || product?.price || product?.offerprice;
              const name = product?.Name || product?.name;

              return (
                <div
                  key={`wish-${pid || idx}`}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  {/* Image */}
                  <div
                    className="bg-gray-50 h-48 flex items-center justify-center p-6 cursor-pointer"
                    onClick={() => pid && navigate(`/Product/${pid}`)}
                  >
                    <img
                      src={images[0] || "/noimage.png"}
                      alt={name}
                      className="max-h-36 object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-indigo-600 transition"
                      onClick={() => pid && navigate(`/Product/${pid}`)}
                    >
                      {name}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      ₹{Number(price).toLocaleString("en-IN")}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAddCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition"
                      >
                        <ShoppingCart size={15} /> Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product)}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-300 transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default WishlistDisplay;