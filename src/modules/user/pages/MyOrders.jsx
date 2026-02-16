import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../services/api";

function MyOrders() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setError(null);
            const res = await api.get('/orders');
            const ordersData = res.data?.data?.Items || [];
            setOrders(ordersData);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen text-white bg-black">
                <h2 className="text-xl font-semibold">
                    Please log in to view your orders.
                </h2>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-white bg-black">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-400 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold">Loading your orders...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 text-center">
                        <h2 className="text-2xl font-bold mb-2">⚠️ Error Loading Orders</h2>
                        <p className="text-gray-300">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center mb-10">🛍️ My Orders</h1>

                {!orders || orders.length === 0 ? (
                    <div className="text-center text-gray-400 text-lg mt-20">
                        <p className="mb-4">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate("/allproducts")}
                            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {orders.map((order, index) => {

                            const orderId = order?.ID;
                            const orderStatus = order?.status;
                            const orderTotal = order?.total || 0;
                            const orderQty = order?.Quantity || 0;

                            return (
                                <div
                                    key={orderId || index}
                                    className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6"
                                >
                                    <div className="flex justify-between items-center border-b border-gray-600 pb-3 mb-4">
                                        <h2 className="text-2xl font-semibold text-white">
                                            Order ID:
                                            <span className="text-emerald-400 font-mono ml-2">
                                                {orderId}
                                            </span>
                                        </h2>

                                        <span className={`font-semibold ${orderStatus === "pending"
                                            ? "text-yellow-400"
                                            : "text-green-400"
                                            }`}>
                                            {orderStatus}
                                        </span>
                                    </div>

                                    <p className="text-gray-300">
                                        Quantity: {orderQty}
                                    </p>

                                    <p className="text-lg text-amber-400 font-bold mt-2">
                                        Total: ₹{Number(orderTotal).toFixed(2)}
                                    </p>

                                    <button
                                        onClick={() => navigate(`/myorders/${orderId}`)}
                                        className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold transition"
                                    >
                                        View Details →
                                    </button>

                                </div>
                            );
                        })}
                    </div>

                )}
            </div>
        </div>
    );
}

export default MyOrders;
