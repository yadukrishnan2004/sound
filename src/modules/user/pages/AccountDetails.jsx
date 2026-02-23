import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset, getUserProfile } from "../../../features/auth/authSlice";
import { ShoppingCart, Heart, Package, LogOut, User, MapPin, ChevronRight } from "lucide-react";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import AddressModal from "../../../shared/components/AddressModal";

function AccountDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [showModal, setShowModal] = useState(false);

  const wishlist = user?.wishlist || [];
  const cart = user?.cart || [];
  const orders = user?.orders || [];
  const address = user?.address || [];

  const handleLogout = () => { dispatch(logout()); dispatch(reset()); navigate("/login"); };
  const handleSuccess = () => dispatch(getUserProfile());

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Please log in to view your account</p>
          <button onClick={() => navigate("/login")} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const STAT_CARDS = [
    { label: "Cart", value: cart.length, icon: <ShoppingCart size={22} />, color: "indigo", to: "/cart" },
    { label: "Wishlist", value: wishlist.length, icon: <Heart size={22} />, color: "rose", to: "/wishlist" },
    { label: "Orders", value: orders.length, icon: <Package size={22} />, color: "amber", to: "/myorders" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <span className="inline-block mt-1 bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 font-semibold text-sm rounded-xl transition"
            >
              <LogOut size={15} /> Log Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {STAT_CARDS.map((s) => {
            const colors = {
              indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
              rose: "bg-rose-50 text-rose-600 border-rose-100",
              amber: "bg-amber-50 text-amber-600 border-amber-100",
            };
            return (
              <div
                key={s.label}
                onClick={() => navigate(s.to)}
                className={`cursor-pointer border rounded-2xl p-5 text-center hover:shadow-md transition-all ${colors[s.color]}`}
              >
                <div className="flex justify-center mb-2">{s.icon}</div>
                <p className="text-3xl font-extrabold">{s.value}</p>
                <p className="text-sm font-medium mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-6 py-4 border-b border-gray-100">
            Quick Actions
          </h2>
          {[
            { label: "My Orders", desc: "View and track your orders", icon: <Package size={18} />, to: "/myorders" },
            { label: "My Wishlist", desc: "Items saved for later", icon: <Heart size={18} />, to: "/wishlist" },
            { label: "Shopping Cart", desc: "Items ready for checkout", icon: <ShoppingCart size={18} />, to: "/cart" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.to)}
              className="flex items-center justify-between px-6 py-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition"
            >
              <div className="flex items-center gap-3">
                <span className="text-indigo-500">{item.icon}</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>

        {/* Addresses */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" /> Saved Addresses
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              + Add Address
            </button>
          </div>

          {address.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <MapPin size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No saved addresses yet.</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-3 text-indigo-600 text-sm font-semibold"
              >
                Add your first address
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {address.map((addr, i) => (
                <div key={i} className="px-6 py-4">
                  <p className="font-semibold text-gray-900 text-sm">{addr.name}</p>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {addr.house_name}, {addr.street}, {addr.city}, {addr.state} - {addr.pin_code}
                  </p>
                  <p className="text-gray-500 text-sm">📞 {addr.phone}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddressModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}

      <Footer />
    </div>
  );
}

export default AccountDetails;