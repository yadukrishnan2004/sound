import axios from "axios";
import React, { useEffect, useState } from "react";

function Pending({status}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/user");
      setUsers(res.data);
    } catch {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  // --- update order status (optional handler) ---
  const handleStatusChange = async (userId, date, newStatus) => {
    try {
      const updatedUsers = users.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            myorder: u.myorder.map((order) =>
              order.date === date ? { ...order, status: newStatus } : order
            ),
          };
        }
        return u;
      });

      setUsers(updatedUsers);

      // Update JSON server
      const updatedUser = updatedUsers.find((u) => u.id === userId);
      await axios.put(`http://localhost:5001/user/${userId}`, updatedUser);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div>
      {loading ? (
        <p className="text-center text-gray-600">Loading orders...</p>
      ) : (
        <div className="space-y-8">
          {(() => {
            // ✅ Flatten all orders with user info
            const pendingOrders = users.flatMap((u) =>
              (u.myorder || [])
                .filter((order) => order.status === status)
                .map((order) => ({ ...order, userInfo: u }))
            );

            return (
              <>
                {pendingOrders.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No pending orders
                  </p>
                ) : (
                  pendingOrders.map((order, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-xl shadow-sm bg-white"
                    >
                      <h2 className="text-xl font-bold mb-2">
                        👤 {order.userInfo.name} ({order.userInfo.email})
                      </h2>
                      <hr className="mb-3" />

                      <div
                        key={order.date}
                        className="border rounded-lg p-4 mb-4 bg-gray-50"
                      >
                        <div className="flex flex-wrap justify-between items-center">
                          <div>
                            <p className="font-semibold">
                              Order Date:{" "}
                              <span className="text-blue-600">
                                {new Date(order.date).toLocaleString()}
                              </span>
                            </p>
                            <p className="text-gray-700">
                              Total: ₹{order.total.toFixed(2)}
                            </p>
                          </div>

                          <select
                            value={order.status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(
                                order.userInfo.id,
                                order.date,
                                e.target.value
                              )
                            }
                            className="border px-3 py-1 rounded-md bg-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="On the Way">On the Way</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>

                        <div className="mt-3">
                          <p className="font-semibold">Items:</p>
                          <ul className="list-disc pl-6 text-sm text-gray-700">
                            {order.items.map((item) => (
                              <li key={item.id}>
                                {item.name} × {item.quantity} — ₹{item.price}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-3 text-sm text-gray-600">
                          <p>
                            📍 Address: {order.formData.address} |{" "}
                            {order.formData.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default Pending;
