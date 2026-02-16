import React, { useState } from "react";
import Pending from "./pending";

export default function ManageOrders() {
  const [active, setActive] = useState("Pending");

  const statuses = ["Pending", "On the Way", "Shipped", "Delivered"];

  const renderContent = () => {
    switch (active) {
      case "Pending":
        return (
          <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              ⏳ Pending Orders
            </h3>
            <p className="text-gray-600">
              <Pending status={"Pending"} />
            </p>
          </div>
        );

      case "On the Way":
        return (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🚚 On the Way
            </h3>
            <p className="text-blue-700">
              <Pending status={"On the Way"} />
            </p>
          </div>
        );

      case "Shipped":
        return (
          <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
              📦 Shipped
            </h3>
            <p className="text-yellow-700">
              <Pending status={"Shipped"} />
            </p>
          </div>
        );

      case "Delivered":
        return (
          <div className="p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              ✅ Delivered
            </h3>
            <p className="text-green-700">
              <Pending status={"Delivered"} />
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Order Status</h2>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {statuses.map((status) => {
          const isActive = active === status;
          const colors = {
            Pending: "gray",
            "On the Way": "blue",
            Shipped: "yellow",
            Delivered: "green",
          };

          return (
            <button
              key={status}
              onClick={() => setActive(status)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-sm border
                ${isActive
                  ? `bg-${colors[status]}-600 text-white scale-105 shadow-md`
                  : `bg-white text-gray-700 border-gray-300 hover:bg-${colors[status]}-100 hover:shadow`
                }`}
            >
              {status}
            </button>
          );
        })}
      </div>

      <div className="w-full  transition-all duration-300">
        {renderContent()}
      </div>
    </div>
  );
}
