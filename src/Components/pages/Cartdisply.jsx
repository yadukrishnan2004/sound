import React, { useContext } from "react";
import { CartContext } from "../context/Cartcontext";
import { ApiContext } from "../context/ApiContext";
import Navbar from "../Parts/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../Parts/footer";

function Cartdisply() {
  const { handleremove, updateQuantity, clearCart } = useContext(CartContext);
  const { user } = useContext(ApiContext);
  const navigate = useNavigate();

  if (!user || !user.cart || user.cart.length === 0) {
    return (
      <>
        <Navbar  color={"black"}/>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">

        <div>

        <p className="text-xl text-gray-600">🛒 Your cart is empty...</p>
         <button
              onClick={() => {
                navigate("/allproducts");
              }}
              className="mt-6  w-50 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition"
            >
              Countinue Shopping
            </button>
        </div>

      </div>
      <Footer />
      </>
    );
  }

  const subtotal = user.cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <Navbar />
      <div className="h-16" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-12">
          🛍️ Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {user.cart.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              >
                {/* Left section with image and details */}
                <div
                  className="flex items-center space-x-4 cursor-pointer"
                  onClick={() => navigate(`/Product/${product.id}`)}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h2>
                    <p className="text-sm text-gray-500">₹{product.price}</p>
                    <p
                      className={`text-sm mt-1 ${
                        product.inStock ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {product.inStock ? "In stock" : "Ships in 3-4 weeks"}
                    </p>
                  </div>
                </div>

                {/* Right section with quantity and actions */}
                <div className="flex items-center space-x-4">
                  <select
                    className="border rounded px-2 py-1 text-black bg-gray-50"
                    value={product.quantity}
                    onChange={(e) =>
                      updateQuantity(product.id, parseInt(e.target.value))
                    }
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>

                  <p className="text-lg font-medium text-gray-700">
                    ₹{(product.price * product.quantity).toFixed(2)}
                  </p>
                  <button
                    className="text-red-500 hover:text-red-600 hover:underline"
                    onClick={() => handleremove(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping estimate</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax estimate</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to Checkout */}
            <button
              onClick={() => {
                navigate("/checkout");
              }}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-700 transition"
            >
              Proceed to Checkout
            </button>

            {/* Clear Cart */}
            <button
              onClick={() => clearCart(user)}
              className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
            >
              🧹 Clear Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Cartdisply;
