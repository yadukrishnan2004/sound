import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cartcontext";
import { useAuth } from "../../AuthContext/authcontext";
import Navbar from "../Parts/Navbar";
import { WishlistContext } from "../context/wishlist";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import BASE_URL from "../../config/baseUrl";

function ProductDetail() {
  const { removeWish, handleAddWish } = useContext(WishlistContext);
  const { handleAddCart } = useContext(CartContext);
  const { user } = useAuth();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  /* ===========================
        FETCH PRODUCT FROM API
     =========================== */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${BASE_URL}/users/products/${id}`
        );

        // 🔥 backend structure assumed:
        // { status:200, data:{...product} }

        const backendProduct = res.data?.data;

        setProduct(backendProduct);

        if (backendProduct?.images?.length > 0) {
          setMainImage(backendProduct.images[0]);
        }
      } catch (err) {
        console.error("Product fetch failed:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================== */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-400"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <h2>Product not found</h2>
      </div>
    );
  }

  const productImages = product?.images || [];

  // 🔥 check if product is in wishlist - support multiple property names
  const like = user?.wishlist?.some(
    (item) => {
      const wishlistProductId = item?.product_id || item?.ProductID || item?.id;
      const currentProductId = product?.id || product?.ID;
      return String(wishlistProductId) === String(currentProductId);
    }
  );

  async function toggle() {
    console.log("🔄 Toggle clicked. Current like state:", like);
    console.log("📦 Product:", product);
    console.log("👤 User wishlist:", user?.wishlist);

    if (like) {
      console.log("➖ Removing from wishlist...");
      await removeWish(product);
    } else {
      console.log("➕ Adding to wishlist...");
      await handleAddWish(product);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/10 backdrop-blur-lg rounded-2xl p-10">

          {/* IMAGE */}
          <div className="flex flex-col items-center">
            <img
              src={mainImage || productImages[0]}
              alt={product.name}
              className="w-full max-w-md object-contain"
            />

            {productImages.length > 1 && (
              <div className="flex gap-3 mt-6">
                {productImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={`w-20 h-20 cursor-pointer border ${mainImage === img ? "border-amber-400" : ""
                      }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold">{product.name}</h1>

            <p className="text-white/70">
              Category: {product.category}
            </p>

            <p className="text-3xl font-bold text-amber-400">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </p>

            <p
              className={`${product.stock > 0
                ? "text-green-400"
                : "text-red-400"
                }`}
            >
              {product.stock > 0
                ? `In Stock (${product.stock})`
                : "Out of Stock"}
            </p>

            <p className="text-white/80">{product.desc}</p>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleAddCart(product)}
                className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl text-black font-semibold transition"
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={toggle}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition ${like
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                  }`}
              >
                {like ? (
                  <AiFillHeart className="text-2xl" />
                ) : (
                  <AiOutlineHeart className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
