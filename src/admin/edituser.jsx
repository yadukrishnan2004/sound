import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { ApiContext } from "../Components/context/ApiContext";


function EditUser() {
    const {jbl}=useContext(ApiContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

    const wishlistIds = user?.wishes || [];
  const wishlist = jbl.filter((p) => wishlistIds.includes(String(p.id)));



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/user/${id}`);
        setUser(res.data);
        setIsBlocked(res.data.blocked || false);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5001/user/${id}`, user);
      alert("✅ User details updated successfully!");
      navigate("/admin/userlist");
    } catch (error) {
      console.error("Error saving user:", error);
      alert("❌ Failed to save changes");
    }
  };

  const toggleBlock = async () => {
    try {
      const updated = { ...user, blocked: !isBlocked };
      await axios.patch(`http://localhost:5001/user/${id}`, {
        blocked: !isBlocked,
      });
      setIsBlocked(!isBlocked);
      setUser(updated);
    } catch (error) {
      console.error("Error toggling block:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading user details...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        User not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            ✏️ Edit User - {user.name}
          </h1>
          <button
            onClick={toggleBlock}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
              isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isBlocked ? <Unlock size={18} /> : <Lock size={18} />}
            {isBlocked ? "Unblock User" : "Block User"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg text-center shadow-sm">
            <h2 className="text-lg font-semibold text-blue-700">🛒 Cart Items</h2>
            <p className="text-2xl font-bold text-blue-900">
              {user.cart?.length || 0}
            </p>
          </div>
          <div className="bg-pink-100 p-4 rounded-lg text-center shadow-sm">
            <h2 className="text-lg font-semibold text-pink-700">❤️ Wishlist</h2>
            <p className="text-2xl font-bold text-pink-900">
              {user.wishes?.length || 0}
            </p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center shadow-sm">
            <h2 className="text-lg font-semibold text-green-700">📦 My Orders</h2>
            <p className="text-2xl font-bold text-green-900">
              {user.myorder?.length || 0}
            </p>
          </div>
        </div>

        {/* User Details Form */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="text"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Sections */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🛒 Cart</h3>
            {user.cart?.length ? (
              user.cart.map((item) => (
                <p key={item.id} className="text-gray-600 text-sm">
                  {item.name} × {item.quantity} – ₹{item.price}
                </p>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No cart items</p>
            )}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">❤️ Wishlist</h3>
            {wishlist?.length ? (
              wishlist.map((item, index) => (
                <p key={index} className="text-gray-600 text-sm">
                  {item.name}
                </p>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No wishlist items</p>
            )}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📦 My Orders</h3>
            {user.myorder?.length ? (
              user.myorder.map((order, index) => (
                <p key={index} className="text-gray-600 text-sm">
                  {order.date} – ₹{order.total}
                </p>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No orders found</p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-lg transition"
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
