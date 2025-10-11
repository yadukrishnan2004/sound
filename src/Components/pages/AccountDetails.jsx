import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/authcontext";
import { ShoppingCart, Heart, Package, LogOut, User } from "lucide-react";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";

function AccountDetails() {
  const { logout, user } = useAuth();
  const {jbl } = useContext(ApiContext);
  const navigate = useNavigate();

  
    const wishlistIds = user?.wishes || [];
  const wishlist = jbl.filter((p) => wishlistIds.includes(String(p.id)));

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
    <div className="sticky top-0 z-50">
          <Navbar color={"white"} />
        </div>
        <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>
    <div className="h-10   ">
    </div>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16 px-6">
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 border-b border-gray-700 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="mt-6 sm:mt-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div
          onClick={()=>{navigate('/Cart')}}
          
          className="bg-gradient-to-br from-blue-500/20 to-blue-700/10 border border-blue-500/30 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-200">
            <ShoppingCart className="mx-auto text-blue-400 mb-2" size={28} />
            <h2 className="text-lg font-semibold text-blue-300">Cart Items</h2>
            <p className="text-3xl font-bold text-white mt-1">
              {user.cart?.length || 0}
            </p>
          </div>

          <div 
          onClick={()=>{navigate('/wishlist')}}
          className="bg-gradient-to-br from-pink-500/20 to-pink-700/10 border border-pink-500/30 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-200">
            <Heart className="mx-auto text-pink-400 mb-2" size={28} />
            <h2 className="text-lg font-semibold text-pink-300">Wishlist</h2>
            <p className="text-3xl font-bold text-white mt-1">
              {user.wishes?.length || 0}
            </p>
          </div>

          <div
          onClick={()=>{navigate('/order')}}
           className="bg-gradient-to-br from-green-500/20 to-green-700/10 border border-green-500/30 rounded-xl p-6 text-center shadow-lg hover:scale-105 transition-transform duration-200">
            <Package className="mx-auto text-green-400 mb-2" size={28} />
            <h2 className="text-lg font-semibold text-green-300">My Orders</h2>
            <p className="text-3xl font-bold text-white mt-1">
              {user.myorder?.length || 0}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
            <User size={20} /> Profile Information
          </h3>

          <div className="grid sm:grid-cols-2 gap-6 text-gray-300">
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-lg font-medium text-white">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg font-medium text-white">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="text-lg font-medium text-white">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Account Status</p>
              <p
                className={`text-lg font-medium ${
                  user.blocked ? "text-red-400" : "text-green-400"
                }`}
              >
                {user.blocked ? "Blocked" : "Active"}
              </p>
            </div>
          </div>
        </div>

        {/* Lists Section */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {/* Cart Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-300">
              🛒 Cart Items
            </h3>
            {user.cart?.length ? (
              <ul className="space-y-2 text-gray-300">
                {user.cart.map((item) => (
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

          {/* Wishlist Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-pink-300">
              ❤️ Wishlist
            </h3>
            {wishlist?.length ? (
              <ul className="space-y-2 text-gray-300">
                {wishlist.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No wishlist items.</p>
            )}
          </div>

          {/* Orders Section */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-3 text-green-300">
              📦 My Orders
            </h3>
            {user.myorder?.length ? (
              <ul className="space-y-2 text-gray-300">
                {user.myorder.map((order, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{order.date}</span>
                    <span>₹{order.total}</span>
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
    <Footer />
    </div>
  );
}

export default AccountDetails;
