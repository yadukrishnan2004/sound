import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ApiContext } from "../context/ApiContext";

function MyOrders() {
  const { user } = useContext(ApiContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost:5001/user/${user.id}`)
        .then((res) => setOrders(res.data.myorder || []))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        <h2 className="text-xl font-semibold">
          Please log in to view your orders.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">🛍️ My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center text-gray-400 text-lg mt-20">
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div className="space-y-10">
            {orders.map((order, index) => {
              const orderId = new Date(order.date).toLocaleString();
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:scale-[1.01] transition"
                >
                  <div className="flex flex-wrap justify-between items-center mb-4 border-b border-gray-600 pb-3">
                    <h2 className="text-2xl font-semibold text-white">
                      Order ID:{" "}
                      <span className="text-emerald-400 font-mono">
                        {orderId}
                      </span>
                    </h2>
                    <p className="text-lg text-gray-300">
                      Total:{" "}
                      <span className="font-bold text-amber-400">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  {/* Shipping Details */}
                  <div className="mb-6 bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-2 text-gray-100">
                      📦 Shipping Details
                    </h3>
                    <p>
                      <strong>Name:</strong> {order.formData.fullName}
                    </p>
                    <p>
                      <strong>Address:</strong> {order.formData.address}
                    </p>
                    <p>
                      <strong>Phone:</strong> {order.formData.phone}
                    </p>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-100">
                      🧾 Items in this Order
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-900/40 rounded-lg p-4 flex flex-col items-center text-center border border-gray-700 hover:border-emerald-400 transition"
                        >
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-24 h-24 object-contain mb-3 rounded-lg"
                          />
                          <h4 className="text-lg font-semibold text-white">
                            {item.name}
                          </h4>
                          <p className="text-gray-400 text-sm">{item.brand}</p>
                          <p className="mt-2 text-amber-400 font-semibold">
                            ₹{item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
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
