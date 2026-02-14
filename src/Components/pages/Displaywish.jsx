import React, { useContext } from "react";
import { WishlistContext } from "../context/wishlist";
import { useAuth } from "../../AuthContext/authcontext";
import { CartContext } from "../context/Cartcontext";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";

function Displaywish() {
  const { user } = useAuth(); // ✅ get profile from auth
  const { removeWish, clearWishlist } = useContext(WishlistContext);
  const { handleAddCart } = useContext(CartContext);

  // 🔥 backend wishlist directly
  const wishlist = user?.wishlist || [];

  // Clear wishlist with confirmation
  const handleClearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      await clearWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <Navbar />

      <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center font-semibold">
        <Navbarsub />
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* HEADER WITH CLEAR BUTTON */}
        <div className="flex justify-between items-center mb-10 mt-24">
          <h2 className="text-3xl font-bold text-purple-400">
            My Wishlist ❤️
          </h2>

          {wishlist.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              🧹 Clear Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No items are added yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wishlist.map((product, index) => (
              <div
                key={`wish-${product.ProductID}-${index}`}
                className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row hover:scale-[1.02] transition"
              >
                {/* IMAGE */}
                <div className="flex justify-center items-center bg-gray-100 p-4 md:w-1/3">
                  <img
                    src={product?.Images?.[0]}
                    alt={product?.Name}
                    className="w-36 h-36 object-contain"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-5 flex flex-col gap-2 flex-1 text-gray-800">
                  <h3 className="text-xl font-semibold">
                    {product?.Name}
                  </h3>

                  <p className="text-gray-600">
                    ₹{Number(product?.Price).toLocaleString("en-IN")}
                  </p>

                  <p
                    className={`text-sm ${product?.Stock > 0
                        ? "text-green-500"
                        : "text-red-500"
                      }`}
                  >
                    {product?.Stock > 0
                      ? `In Stock (${product?.Stock})`
                      : "Out of Stock"}
                  </p>

                  <p className="text-sm text-gray-700">
                    {product?.Description}
                  </p>

                  {/* ACTIONS */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() =>
                        handleAddCart({
                          id: product.ProductID,
                          name: product.Name,
                          price: product.Price,
                          images: product.Images,
                        })
                      }
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() =>
                        removeWish({
                          ProductID: product.ProductID,
                        })
                      }
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
