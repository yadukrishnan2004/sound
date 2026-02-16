import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCartQuantity, removeFromCart, clearCart } from "../../../features/cart/cartSlice";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";

function CartDisplay() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    // Fallback
    const cart = cartItems.length > 0 ? cartItems : (user?.cart || []);

    const handleRemove = (cartId) => {
        dispatch(removeFromCart(cartId));
    };

    const handleUpdateQuantity = (cartId, qty) => {
        dispatch(updateCartQuantity({ cartId, quantity: qty }));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    /* ======================
          EMPTY CART
    ====================== */

    if (!cart.length) {
        return (
            <>
                <Navbar color={"black"} />
                <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
                    <div>
                        <p className="text-xl text-gray-600">🛒 Your cart is empty...</p>

                        <button
                            onClick={() => navigate("/allproducts")}
                            className="mt-6 w-50 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    /* ======================
          CALCULATIONS
    ====================== */

    const subtotal = cart.reduce(
        (acc, item) => acc + Number(item.Price) * item.Quantity,
        0
    );

    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    /* ======================
            UI
    ====================== */

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
            <Navbar />
            <div className="h-16" />

            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-center text-purple-400 mb-12">
                    🛍️ Shopping Cart
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CART ITEMS */}
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((product) => (
                            <div
                                key={`cart-${product.CartID}`}
                                className="flex justify-between bg-white rounded-xl shadow-md p-4"
                            >
                                {/* LEFT SIDE */}
                                <div
                                    className="flex items-center space-x-4 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/Product/${product.ProductID}`)
                                    }
                                >
                                    <img
                                        src={product?.Image?.[0] || "/noimage.png"}
                                        alt={product.Name}
                                        className="w-24 h-24 object-cover rounded-md border"
                                    />

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            {product.Name}
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            ₹{Number(product.Price)}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="flex items-center space-x-4">
                                    <select
                                        className="border rounded px-2 py-1 text-black"
                                        value={product.Quantity}
                                        onChange={(e) =>
                                            handleUpdateQuantity(product.CartID, Number(e.target.value))
                                        }
                                    >
                                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                                            <option key={n}>{n}</option>
                                        ))}
                                    </select>

                                    <p className="text-lg font-medium text-gray-700">
                                        ₹{(product.Price * product.Quantity).toFixed(2)}
                                    </p>

                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleRemove(product.CartID)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SUMMARY */}
                    <div className="bg-white p-6 rounded-xl shadow-lg text-gray-800">
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>

                            <div className="border-t pt-4 flex justify-between font-semibold">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded-lg"
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            onClick={handleClearCart}
                            className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg"
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

export default CartDisplay;
