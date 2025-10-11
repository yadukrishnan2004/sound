import React, { useContext } from "react";
import { wish } from "../context/wishlist";
import { ApiContext } from "../context/ApiContext";
import { CartContext } from "../context/Cartcontext";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";

function Displaywish() {
  const { user, jbl } = useContext(ApiContext);
  const { removeWish } = useContext(wish);
  const { handleAddCart } = useContext(CartContext);
  const wishlistIds = user?.wishes || [];
  const wishlist = jbl.filter((p) => wishlistIds.includes(String(p.id)));

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-900 via-gray-800 to-gray-700 text-white ">
      <Navbar />
              <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-10 mt-24">
          My Wishlist ❤️
        </h2>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No items are added yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-gradient-to-r from-white via-gray-50 to-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row transition-transform hover:scale-[1.02]"
              >
                {/* Image Section */}
                <div className="flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 md:w-1/3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-36 h-36 object-contain"
                  />
                </div>

                {/* Details Section */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-gray-600">
                    Brand: <span className="font-medium">{product.brand}</span>
                  </p>
                  <p className="text-gray-600">Category: {product.category}</p>

                  <p className="text-lg font-bold text-green-600">
                    ₹{product.price.toLocaleString("en-IN")} {product.currency}
                  </p>

                  <p
                    className={`text-sm ${
                      product.stock > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock} available)`
                      : "Out of Stock"}
                  </p>

                  <p className="text-gray-700 text-sm">{product.description}</p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAddCart(product)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => removeWish(product)}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition"
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

      <div className="bottom-0 mt-100">
      <Footer/>
      </div>
    </div>
  );
}

export default Displaywish;