import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";

const STATUS_OPTIONS = ["Pending", "Shipped", "Delivered", "Cancelled"];

function Pending({ status }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);

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

    const handleViewDetails = async (orderId) => {
        setSelectedOrderId(orderId);
        setDetailsLoading(true);
        try {
            const res = await api.get(ENDPOINTS.ADMIN.ORDER_DETAIL(orderId));
            setOrderDetails(res.data?.data || []);
        } catch (err) {
            toast.error("Failed to fetch order details");
            setSelectedOrderId(null);
        } finally {
            setDetailsLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedOrderId(null);
        setOrderDetails(null);
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
                            <p className="text-gray-900">
                                Payment:{" "}
                                <span className="font-medium">{order.payment_method || 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => handleViewDetails(order.ID)}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            ))}

            {/* Modal */}
            {selectedOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">
                                Order Details #{selectedOrderId}
                            </h2>

                            {detailsLoading ? (
                                <div className="py-20 flex justify-center items-center">
                                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : !orderDetails || orderDetails.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No items found for this order.</p>
                            ) : (
                                <div className="space-y-8">
                                    {/* Generic info about the order is taken from the first order item since they share the same Order object */}
                                    {(() => {
                                        const firstItem = orderDetails[0];
                                        const orderObj = firstItem?.Order || {};
                                        const address = orderObj?.address || {};
                                        const user = orderObj?.user || {};

                                        return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                                <div>
                                                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Customer Info</h3>
                                                    <div className="space-y-1 text-gray-600">
                                                        <p><span className="font-medium text-gray-700">Name:</span> {user.name || 'N/A'}</p>
                                                        <p><span className="font-medium text-gray-700">Email:</span> {user.email || 'N/A'}</p>
                                                        <p><span className="font-medium text-gray-700">Phone:</span> {address.phone || 'N/A'}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Shipping Address</h3>
                                                    {address.street ? (
                                                        <div className="space-y-1 text-gray-600">
                                                            <p className="font-medium text-gray-800">{address.name}</p>
                                                            <p>{address.house_name}, {address.street}</p>
                                                            <p>{address.city}, {address.state} - {address.pin_code}</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-red-500 text-sm italic">Address not stored during checkout</p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800">Payment Details</h4>
                                                        <p className="text-gray-600">Method: <span className="font-medium">{orderObj.payment_method || 'N/A'}</span></p>
                                                        {orderObj.payment_method === 'Razorpay' && (
                                                            <div className="mt-1 text-xs font-mono text-gray-500 space-y-1 bg-white p-2 rounded border">
                                                                <p className="truncate">Order ID: {orderObj.razorpay_order_id}</p>
                                                                {orderObj.razorpay_payment_id && <p className="truncate">Pay ID: {orderObj.razorpay_payment_id}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="sm:text-right flex flex-col justify-end">
                                                        <span className="text-gray-500 text-sm">Grand Total</span>
                                                        <span className="text-2xl font-bold text-green-700">₹{Number(orderObj.total).toLocaleString()}</span>
                                                        <span className="text-xs text-gray-400">Status: {orderObj.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <div className="mt-6">
                                        <h3 className="font-bold text-gray-800 mb-4 text-xl">Order Items</h3>
                                        <div className="space-y-4">
                                            {orderDetails.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow bg-white items-center">
                                                    <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                        <img
                                                            src={item.Image || '/placeholder.png'}
                                                            alt={item.Product?.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = '/placeholder.png' }}
                                                        />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <h4 className="font-semibold text-lg text-gray-800 line-clamp-1">{item.Product?.name || 'Unknown Product'}</h4>
                                                        <p className="text-sm text-gray-500 line-clamp-1">{item.Product?.desc}</p>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm font-medium">Qty: {item.Quantity}</span>
                                                            <span className="font-bold text-gray-900 border-b border-gray-300">₹{Number(item.Price).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pending;