import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cartcontext";
import Navbar from "../Parts/Navbar";
import { wish } from "../context/wishlist";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function ProductDetail() {
  const { removeWish, handleAddWish } = useContext(wish);
  const { handleAddCart } = useContext(CartContext);
  const { jbl, user } = useContext(ApiContext);
  const { id } = useParams();
  const product = jbl.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <h2 className="text-xl font-semibold">Product not found!</h2>
      </div>
    );
  }

  const like = user?.wishes?.includes(String(product.id));
  async function toggle() {
    if (like) await removeWish(product);
    else await handleAddWish(product);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-25">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-2xl">
          {/* Product Image */}
          <div className="flex flex-col items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full max-w-md object-contain rounded-xl shadow-lg"
            />
            <div className="flex gap-3 mt-6">
              {product.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`thumb-${i}`}
                  className="w-20 h-20 border border-white/30 rounded-lg object-contain cursor-pointer hover:scale-105 transition"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <h1 className="text-4xl font-extrabold">{product.name}</h1>
            <p className="text-white/70">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
            <p className="text-white/70">
              Category: <span className="capitalize">{product.category}</span>
            </p>

            <p className="text-3xl font-bold text-amber-400">
              ₹{product.price.toLocaleString("en-IN")}{" "}
              <span className="text-sm font-normal text-white/60">
                {product.currency}
              </span>
            </p>

            <p
              className={`text-sm font-medium ${
                product.stock > 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock} available)`
                : "Out of Stock"}
            </p>

            <p className="text-white/80 leading-relaxed">
              {product.description}
            </p>

            {/* Service Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {[
                { icon: "↩️", label: "7-Day Return Policy" },
                { icon: "🛡️", label: "1 Year Warranty" },
                { icon: "🚚", label: "Free Delivery Available" },
                { icon: "💳", label: "Secure Payment" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-white/10 border border-white/20 p-3 rounded-lg"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-sm font-medium text-white/80">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleAddCart(product)}
                className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-xl shadow-md transition text-lg font-semibold"
              >
                🛒 Add to Cart
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition text-lg font-semibold ${
                  like
                    ? "bg-red-500 text-white"
                    : "border border-white/30 text-white hover:bg-white/10"
                }`}
                aria-label={like ? "Remove from favorites" : "Add to favorites"}
                onClick={toggle}
              >
                {like ? (
                  <AiFillHeart className="text-xl" />
                ) : (
                  <AiOutlineHeart className="text-xl" />
                )}
                {like ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Extra Info */}
            <div className="mt-6 text-sm text-white/60 border-t border-white/20 pt-4">
              <p>
                <strong>Delivery:</strong> Usually delivered in 3–5 business
                days.
              </p>
              <p>
                <strong>Payment Options:</strong> UPI, Netbanking, Credit/Debit
                Card, Cash on Delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;