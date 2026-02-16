import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext/authcontext";
import BASE_URL from "../../config/baseUrl";
import Navbar from "../Parts/Navbar";

function OrderDetail() {
    const { orderId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && orderId) {
            fetchOrderDetails();
        }
    }, [user, orderId]);

    const fetchOrderDetails = async () => {
        try {
            setError(null);
            setLoading(true);

            console.log("🔍 Fetching order details:", `${BASE_URL}/users/${orderId}/orders`);

            const res = await axios.get(
                `${BASE_URL}/users/${orderId}/orders`,
                { withCredentials: true }
            );

            console.log("✅ Order details response:", res.data);

            // Assuming response structure: { status, message, data: [...orderItems] }
            setOrderDetails(res.data?.data || []);
        } catch (err) {
            console.error("❌ Error fetching order details:", err);
            setError(err.response?.data?.message || "Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <h2 className="text-xl font-semibold">Please log in to view order details.</h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <Navbar />
                <div className="flex justify-center items-center h-[80vh] text-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold">Loading order details...</h2>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">⚠️ Error Loading Order</h2>
                        <p className="text-gray-300 mb-4">{error}</p>
                        <button
                            onClick={() => navigate("/myorders")}
                            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition text-white"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!orderDetails || orderDetails.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-12 text-white">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">No items found in this order</h2>
                        <button
                            onClick={() => navigate("/myorders")}
                            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                        >
                            Back to Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate order total
    const orderTotal = orderDetails.reduce((sum, item) => {
        return sum + (item?.Price || 0) * (item?.Quantity || 0);
    }, 0);

    // Get order info from first item
    const order = orderDetails[0]?.Order || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/myorders")}
                        className="mb-4 text-emerald-400 hover:text-emerald-300 flex items-center gap-2"
                    >
                        ← Back to Orders
                    </button>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                        <div className="flex flex-wrap justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Order #{orderId}
                                </h1>
                                <p className="text-gray-400">
                                    Status: <span className={`font-semibold ${order?.status === 'delivered' ? 'text-green-400' :
                                            order?.status === 'pending' ? 'text-yellow-400' :
                                                'text-blue-400'
                                        }`}>{order?.status || 'Pending'}</span>
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-gray-400 text-sm">Total Amount</p>
                                <p className="text-3xl font-bold text-amber-400">
                                    ₹{orderTotal.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                    <h2 className="text-2xl font-bold mb-6">Order Items</h2>

                    <div className="space-y-4">
                        {orderDetails.map((item, index) => {
                            const product = item?.Product || {};
                            const itemImage = item?.Image || product?.images?.[0] || product?.image;
                            const productName = product?.name || "Unknown Product";
                            const productBrand = product?.brand || "";
                            const itemPrice = item?.Price || 0;
                            const itemQuantity = item?.Quantity || 1;
                            const itemTotal = itemPrice * itemQuantity;

                            return (
                                <div
                                    key={index}
                                    className="bg-gray-800/50 rounded-lg p-4 flex flex-col sm:flex-row gap-4 border border-gray-700 hover:border-emerald-400 transition"
                                >
                                    {/* Product Image */}
                                    <div className="flex-shrink-0">
                                        {itemImage ? (
                                            <img
                                                src={itemImage}
                                                alt={productName}
                                                className="w-24 h-24 object-contain rounded-lg bg-white/10"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/100?text=No+Image";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-gray-700 flex items-center justify-center rounded-lg">
                                                <span className="text-gray-500 text-xs">No Image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {productName}
                                        </h3>
                                        {productBrand && (
                                            <p className="text-gray-400 text-sm mb-2">{productBrand}</p>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-400">Price: </span>
                                                <span className="text-amber-400 font-semibold">
                                                    ₹{itemPrice.toFixed(2)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Quantity: </span>
                                                <span className="text-white font-semibold">{itemQuantity}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Subtotal: </span>
                                                <span className="text-emerald-400 font-semibold">
                                                    ₹{itemTotal.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* View Product Button */}
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => navigate(`/Product/${product?.id || product?.ID}`)}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm font-semibold transition"
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total ({orderDetails.length} items)</span>
                            <span className="text-amber-400">₹{orderTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
