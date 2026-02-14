import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../config/baseUrl";

import { WishlistContext } from "../context/wishlist";
import { CartContext } from "../context/Cartcontext";

import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";

function Displaywish() {
  const { removeWish, clearWishlist } = useContext(WishlistContext);
  const { handleAddCart } = useContext(CartContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
        FETCH WISHLIST
  ==========================*/
  const fetchWishlist = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/wishlist`, {
        withCredentials: true,
      });

      // 🔥 IMPORTANT FIX
      setWishlist(res.data.data?.item || []);
    } catch (err) {
      console.error("Wishlist fetch failed:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* =========================
        ACTIONS
  ==========================*/

  const handleRemove = async (product) => {
    await removeWish(product);
    fetchWishlist();
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      await clearWishlist();
      fetchWishlist();
    }
  };

  /* =========================
          UI
  ==========================*/

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <Navbar />

      <div className="hidden md:flex sticky top-[64px] z-50 justify-center font-semibold">
        <Navbarsub />
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-10 mt-24">
          <h2 className="text-3xl font-bold text-purple-400">
            My Wishlist ❤️
          </h2>

          {wishlist.length > 0 && (
            <button
              onClick={handleClear}
              className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
            >
              🧹 Clear Wishlist
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No items are added yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wishlist.map((product, index) => (
              <div
                key={`wish-${product.product_id}-${index}`}
                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row hover:scale-[1.02] transition"
              >
                <div className="flex justify-center items-center bg-gray-100 p-4 md:w-1/3">
                  <img
                    src={product?.Images?.[0]}
                    alt={product?.name}
                    className="w-36 h-36 object-contain"
                  />
                </div>

                <div className="p-5 flex flex-col gap-2 flex-1 text-gray-800">
                  <h3 className="text-xl font-semibold">{product?.name}</h3>

                  <p className="text-gray-600">
                    ₹{Number(product?.price).toLocaleString("en-IN")}
                  </p>

                  <p
                    className={`text-sm ${product?.stock > 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {product?.stock > 0
                      ? `In Stock (${product?.stock})`
                      : "Out of Stock"}
                  </p>

                  <p className="text-sm text-gray-700">
                    {product?.description}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        handleAddCart({
                          id: product.product_id,
                          name: product.name,
                          price: product.price,
                          images: product.Images,
                        })
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(product)}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Displaywish;
