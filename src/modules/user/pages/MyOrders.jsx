import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import { Package, ChevronRight, RefreshCw, ArrowRight } from "lucide-react";

const STATUS_STYLES = {
  Pending:   { bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-400" },
  Shipped:   { bg: "bg-blue-50",    text: "text-blue-600",   dot: "bg-blue-400" },
  Delivered: { bg: "bg-emerald-50", text: "text-emerald-600",dot: "bg-emerald-400" },
  Cancelled: { bg: "bg-red-50",     text: "text-red-500",    dot: "bg-red-400" },
};

function MyOrders() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchOrders();
    else setLoading(false);
  }, [user]);

  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await api.get(ENDPOINTS.ORDERS.LIST);
      setOrders(res.data?.data?.Items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {!loading && `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-sm text-indigo-600 font-medium hover:text-indigo-700 transition"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button onClick={fetchOrders} className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600">
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Package className="text-indigo-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm mb-8">Your order history will appear here</p>
            <button
              onClick={() => navigate("/allproducts")}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition"
            >
              Start Shopping <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => {
              const orderId = order?.ID;
              const status = order?.status || "Pending";
              const total = order?.total || 0;
              const qty = order?.Quantity || 0;
              const styleMap = STATUS_STYLES[status] || STATUS_STYLES.Pending;

              return (
                <div
                  key={orderId || idx}
                  onClick={() => navigate(`/myorders/${orderId}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-indigo-100 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                      <Package className="text-indigo-500" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        Order #{orderId}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">{qty} item{qty !== 1 ? "s" : ""}</p>
                      <p className="font-bold text-gray-900 text-sm mt-1">
                        ₹{Number(total).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${styleMap.bg} ${styleMap.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${styleMap.dot}`} />
                      {status}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default MyOrders;