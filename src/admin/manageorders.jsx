// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function ManageOrders() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch all users and their orders
//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5001/user");
//       setUsers(res.data);
//     } catch (err) {
//       console.error("Error fetching users:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // Handle order status update
//   const handleStatusChange = async (userId, orderDate, newStatus) => {
//     try {
//       const user = users.find((u) => u.id === userId);
//       if (!user) return;

//       const updatedOrders = user.myorder.map((order) =>
//         order.date === orderDate ? { ...order, status: newStatus } : order
//       );

//       await axios.put(`http://localhost:5001/user/${userId}`, {
//         ...user,
//         myorder: updatedOrders,
//       });

//       setUsers((prev) =>
//         prev.map((u) =>
//           u.id === userId ? { ...u, myorder: updatedOrders } : u
//         )
//       );
//     } catch (err) {
//       console.error("Error updating status:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-semibold mb-6 text-center">
//         Admin - Manage User Orders
//       </h1>

//       {loading ? (
//         <p className="text-center text-gray-600">Loading orders...</p>
//       ) : (
//         <div className="space-y-8">
//           {users
//             .filter((user) => user.myorder && user.myorder.length > 0) // ✅ Only show users with orders
//             .map((user) => (
//               <div
//                 key={user.id}
//                 className="border p-4 rounded-xl shadow-sm bg-white"
//               >
//                 <h2 className="text-xl font-bold mb-2">
//                   👤 {user.name} ({user.email})
//                 </h2>
//                 <hr className="mb-3" />

//                 {user.myorder.map((order) => (
//                   <div
//                     key={order.date}
//                     className="border rounded-lg p-4 mb-4 bg-gray-50"
//                   >
//                     <div className="flex flex-wrap justify-between items-center">
//                       <div>
//                         <p className="font-semibold">
//                           Order ID:{" "}
//                           <span className="text-blue-600">
//                             {new Date(order.date).toLocaleString()}
//                           </span>
//                         </p>
//                         <p className="text-gray-700">
//                           Total: ₹{order.total.toFixed(2)}
//                         </p>
//                       </div>

//                       <select
//                         value={order.status || "Pending"}
//                         onChange={(e) =>
//                           handleStatusChange(
//                             user.id,
//                             order.date,
//                             e.target.value
//                           )
//                         }
//                         className="border px-3 py-1 rounded-md bg-white"
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="On the Way">On the Way</option>
//                         <option value="Shipped">Shipped</option>
//                         <option value="Delivered">Delivered</option>
//                       </select>
//                     </div>

//                     <div className="mt-3">
//                       <p className="font-semibold">Items:</p>
//                       <ul className="list-disc pl-6 text-sm text-gray-700">
//                         {order.items.map((item) => (
//                           <li key={item.id}>
//                             {item.name} × {item.quantity} — ₹{item.price}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="mt-3 text-sm text-gray-600">
//                       <p>
//                         📍 Address: {order.formData.address} |{" "}
//                         {order.formData.phone}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}

//           {/* ✅ If no user has any orders */}
//           {users.filter((u) => u.myorder?.length > 0).length === 0 && (
//             <p className="text-center text-gray-500 italic">
//               No orders found.
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ManageOrders;

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
                ${
                  isActive
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
