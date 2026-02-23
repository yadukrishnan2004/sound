import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCartQuantity, removeFromCart, clearCart } from "../../../features/cart/cartSlice";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

function CartDisplay() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const cart = cartItems.length > 0 ? cartItems : user?.cart || [];

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-28 px-4 text-center">
          <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="text-indigo-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 text-sm mb-8">Add some products to get started</p>
          <button
            onClick={() => navigate("/allproducts")}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition"
          >
            Continue Shopping <ArrowRight size={16} />
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cart.reduce((acc, i) => acc + Number(i.Price) * i.Quantity, 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Shopping Cart
          <span className="ml-2 text-sm font-normal text-gray-400">({cart.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((product) => (
              <div
                key={product.CartID}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
              >
                {/* Image */}
                <div
                  className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer shrink-0"
                  onClick={() => navigate(`/Product/${product.ProductID}`)}
                >
                  <img
                    src={product?.Image?.[0] || "/noimage.png"}
                    alt={product.Name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-indigo-600 transition"
                    onClick={() => navigate(`/Product/${product.ProductID}`)}
                  >
                    {product.Name}
                  </h3>
                  <p className="text-indigo-600 font-bold text-lg mt-0.5">
                    ₹{Number(product.Price).toLocaleString("en-IN")}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          dispatch(updateCartQuantity({
                            cartId: product.CartID,
                            productId: product.ProductID,
                            quantity: Math.max(1, product.Quantity - 1),
                          }))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">
                        {product.Quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(updateCartQuantity({
                            cartId: product.CartID,
                            productId: product.ProductID,
                            quantity: product.Quantity + 1,
                          }))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition text-sm"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal & Delete */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-700">
                        ₹{(Number(product.Price) * product.Quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => dispatch(removeFromCart(product.CartID))}
                        className="text-gray-300 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={() => dispatch(clearCart())}
                className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 transition"
              >
                <Trash2 size={14} /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : "text-gray-900"}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium text-gray-900">₹{tax.toFixed(0)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                    🎉 You get free shipping!
                  </p>
                )}
                {shipping > 0 && (
                  <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">
                    Add ₹{(999 - subtotal).toFixed(0)} more for free shipping
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/allproducts")}
                className="w-full mt-2 py-3 text-indigo-600 font-medium text-sm hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CartDisplay;