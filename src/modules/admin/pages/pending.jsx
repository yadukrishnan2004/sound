import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";

const STATUS_OPTIONS = ["Pending", "Shipped", "Delivered", "Cancelled"];

function Pending({ status }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    // ✅ Moved OUTSIDE useEffect so handleStatusChange can access it
    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(ENDPOINTS.ADMIN.ORDERS);
            const orderList =
                res.data?.data?.Items ||
                res.data?.Items ||
                res.data?.data ||
                res.data ||
                [];

            const filtered = orderList.filter(
                (o) => o.status?.toLowerCase() === status.toLowerCase()
            );
            setOrders(filtered);
        } catch {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ✅ Fixed: fetchOrders is now in scope, removed conflicting setOrders filter
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            await api.put(ENDPOINTS.ADMIN.UPDATE_ORDER_STATUS(orderId), { status: newStatus });
            toast.success("Order status updated!");
            await fetchOrders(); // re-fetch to reflect real backend state
        } catch (err) {
            console.error("Failed to update status:", err);
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-600 my-10">Loading orders...</p>;
    }

    if (orders.length === 0) {
        return (
            <p className="text-center text-gray-500 my-10">
                No {status.toLowerCase()} orders found.
            </p>
        );
    }

    return (
        <div className="space-y-6 mt-4">
            {orders.map((order) => (
                <div key={order.ID} className="border p-5 rounded-xl shadow-sm bg-white">
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Order #{order.ID}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {order.user?.name || "Unknown User"} •{" "}
                                {order.user?.email || "No Email"}
                            </p>
                        </div>

                        <div className="text-right flex flex-col gap-2">
                            <span className="font-bold text-lg text-green-700">
                                ₹{Number(order.total).toLocaleString()}
                            </span>

                            {/* ✅ Disabled while this specific order is updating */}
                            <select
                                value={
                                    order.status?.charAt(0).toUpperCase() +
                                    order.status?.slice(1).toLowerCase()
                                }
                                onChange={(e) => handleStatusChange(order.ID, e.target.value)}
                                disabled={updatingId === order.ID}
                                className="border border-gray-300 px-3 py-1.5 rounded-lg bg-white text-sm font-semibold shadow-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            {updatingId === order.ID && (
                                <span className="text-xs text-blue-500 animate-pulse">
                                    Updating…
                                </span>
                            )}
                        </div>
                    </div>

                    <hr className="mb-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Status Info */}
                        <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 flex flex-col justify-center">
                            <h4 className="font-semibold mb-1 text-gray-800">Current Status:</h4>
                            <p className="text-gray-900 font-medium capitalize">
                                {order.status}
                            </p>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700 flex flex-col justify-center">
                            <h4 className="font-semibold mb-1 text-gray-800">Order Summary:</h4>
                            <p className="text-gray-900">
                                Total Items:{" "}
                                <span className="font-medium">{order.Quantity || 0}</span>
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Pending;