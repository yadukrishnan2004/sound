import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/authcontext";
import {
  ShoppingCart,
  Heart,
  Package,
  LogOut,
  User,
  MapPin,
} from "lucide-react";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";
import AddressModal from "../Parts/AddressModal";

function AccountDetails() {
  const { logout, user, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const wishlist = user?.wishlist || [];
  const cart = user?.cart || [];
  const orders = user?.orders || [];
  const address = user?.address || [];

  console.log("address",address);
  

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <h2 className="text-xl font-semibold">
          No account found. Please log in.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      {/* NAVBAR */}
      <div className="sticky top-0 z-50">
        <Navbar color={"white"} />
      </div>

      <div className="hidden md:flex sticky top-[64px] z-50 justify-center font-semibold">
        <Navbarsub />
      </div>

      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-10 border-b border-gray-700 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-indigo-400">{user.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="mt-6 sm:mt-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

            <div
              onClick={() => navigate("/cart")}
              className="cursor-pointer bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 text-center hover:scale-105 transition"
            >
              <ShoppingCart className="mx-auto text-blue-400 mb-2" size={28} />
              <h2 className="text-lg font-semibold text-blue-300">Cart</h2>
              <p className="text-3xl font-bold">{cart.length}</p>
            </div>

            <div
              onClick={() => navigate("/wishlist")}
              className="cursor-pointer bg-pink-500/20 border border-pink-500/30 rounded-xl p-6 text-center hover:scale-105 transition"
            >
              <Heart className="mx-auto text-pink-400 mb-2" size={28} />
              <h2 className="text-lg font-semibold text-pink-300">Wishlist</h2>
              <p className="text-3xl font-bold">{wishlist.length}</p>
            </div>

            <div
              onClick={() => navigate("/orders")}
              className="cursor-pointer bg-green-500/20 border border-green-500/30 rounded-xl p-6 text-center hover:scale-105 transition"
            >
              <Package className="mx-auto text-green-400 mb-2" size={28} />
              <h2 className="text-lg font-semibold text-green-300">Orders</h2>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>

          </div>

          {/* PROFILE INFO */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} /> Profile Information
            </h3>

            <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="text-lg text-white">{user.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg text-white">{user.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-400">Role</p>
                <p className="text-lg text-white">{user.role}</p>
              </div>
            </div>
          </div>

          {/* ADDRESS SECTION */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <MapPin size={20} /> Address
              </h3>

              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded-lg text-sm"
              >
                + Add Address
              </button>
            </div>

            {address.length ? (
              <ul className="space-y-2">
                {address.map((a, i) => (
                  <li key={i} className="text-gray-300">
                    {a.house_name}, {a.street}, {a.city}, {a.state} - {a.pin_code}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No address added.</p>
            )}
          </div>

          {/* LIST SECTIONS */}
          <div className="grid md:grid-cols-3 gap-6">

            {/* CART */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-blue-300 font-semibold mb-3">🛒 Cart</h3>
              {cart.length ? (
                <ul className="space-y-2">
                  {cart.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No items in cart.</p>
              )}
            </div>

            {/* WISHLIST */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-pink-300 font-semibold mb-3">❤️ Wishlist</h3>
              {wishlist.length ? (
                <ul className="space-y-2">
                  {wishlist.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No wishlist items.</p>
              )}
            </div>

            {/* ORDERS */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-green-300 font-semibold mb-3">📦 Orders</h3>
              {orders.length ? (
                <ul className="space-y-2">
                  {orders.map((order, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{order.date || "Order"}</span>
                      <span>₹{order.total || 0}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No orders yet.</p>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* ADDRESS MODAL */}
      {showModal && (
        <AddressModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchUserProfile}
        />
      )}

      <Footer />
    </div>
  );
}

export default AccountDetails;
