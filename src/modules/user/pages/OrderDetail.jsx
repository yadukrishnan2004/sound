import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../services/api";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import { ENDPOINTS } from "../../../services/endpoints";
import { ArrowLeft, Package } from "lucide-react";

const STATUS_STYLES = {
  Pending:   { bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-400" },
  Shipped:   { bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-400" },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-600",dot: "bg-emerald-400" },
  Cancelled: { bg: "bg-red-50",     text: "text-red-500",    dot: "bg-red-400" },
};

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && orderId) fetchOrderDetails();
  }, [user, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setError(null); setLoading(true);
      const res = await api.get(ENDPOINTS.ORDERS.DETAIL(orderId));
      setOrderDetails(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order details");
    } finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button onClick={() => navigate("/myorders")} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No items found in this order.</p>
          <button onClick={() => navigate("/myorders")} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const orderTotal = orderDetails.reduce((sum, item) => sum + (item?.Price || 0) * (item?.Quantity || 0), 0);
  const status = orderDetails[0]?.status || "Pending";
  const styleMap = STATUS_STYLES[status] || STATUS_STYLES.Pending;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Back */}
        <button
          onClick={() => navigate("/myorders")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft size={15} /> Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order #{orderId}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{orderDetails.length} item{orderDetails.length !== 1 ? "s" : ""}</p>
          </div>
          <span className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full ${styleMap.bg} ${styleMap.text}`}>
            <span className={`w-2 h-2 rounded-full ${styleMap.dot}`} /> {status}
          </span>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {orderDetails.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={item?.Image?.[0] || item?.images?.[0] || "/noimage.png"}
                    alt={item?.Name || item?.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item?.Name || item?.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">Qty: {item?.Quantity}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">₹{Number(item?.Price).toLocaleString("en-IN")}</p>
                  <p className="text-gray-400 text-xs">× {item?.Quantity} = ₹{(Number(item?.Price) * item?.Quantity).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-xl text-indigo-600">₹{orderTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetail;