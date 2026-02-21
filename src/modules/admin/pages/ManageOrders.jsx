import React, { useState } from "react";
import Pending from "./pending";

// ✅ These MUST match exactly what your backend stores/returns
const STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"];

const STATUS_CONFIG = {
  Pending: {
    label: "⏳ Pending Orders",
    bg: "bg-gray-50",
    border: "border-gray-200",
    heading: "text-gray-800",
    activeBtn: "bg-gray-600 text-white shadow-md scale-105",
    hoverBtn: "bg-white text-gray-700 hover:bg-gray-100 hover:shadow",
  },
  Shipped: {
    label: "📦 Shipped",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    heading: "text-yellow-800",
    activeBtn: "bg-yellow-600 text-white shadow-md scale-105",
    hoverBtn: "bg-white text-gray-700 hover:bg-yellow-50 hover:shadow",
  },
  Delivered: {
    label: "✅ Delivered",
    bg: "bg-green-50",
    border: "border-green-200",
    heading: "text-green-800",
    activeBtn: "bg-green-600 text-white shadow-md scale-105",
    hoverBtn: "bg-white text-gray-700 hover:bg-green-50 hover:shadow",
  },
  Cancelled: {
    label: "❌ Cancelled",
    bg: "bg-red-50",
    border: "border-red-200",
    heading: "text-red-800",
    activeBtn: "bg-red-600 text-white shadow-md scale-105",
    hoverBtn: "bg-white text-gray-700 hover:bg-red-50 hover:shadow",
  },
};

export default function ManageOrders() {
  const [active, setActive] = useState("Pending");

  const config = STATUS_CONFIG[active];

  return (
    <div className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Order Management</h2>

      {/* Tab Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {STATUSES.map((status) => {
          const isActive = active === status;
          const cfg = STATUS_CONFIG[status];
          return (
            <button
              key={status}
              onClick={() => setActive(status)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-sm border border-gray-300 ${
                isActive ? cfg.activeBtn : cfg.hoverBtn
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Content Panel */}
      <div className="w-full transition-all duration-300">
        <div className={`p-6 ${config.bg} border ${config.border} rounded-2xl shadow-sm`}>
          <h3 className={`text-xl font-semibold mb-2 ${config.heading}`}>
            {config.label}
          </h3>
          {/* Key forces re-mount when tab changes, triggering fresh fetch */}
          <Pending key={active} status={active} />
        </div>
      </div>
    </div>
  );
}