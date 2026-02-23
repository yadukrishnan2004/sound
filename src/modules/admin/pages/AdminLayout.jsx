import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, reset } from "../../../features/auth/authSlice";
import {
  LayoutDashboard, Users, Package, ShoppingBag, LogOut, Menu, X
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} />, end: true },
  { to: "userlist", label: "Manage Users", icon: <Users size={18} /> },
  { to: "productmanage", label: "Manage Products", icon: <Package size={18} /> },
  { to: "manageorder", label: "Manage Orders", icon: <ShoppingBag size={18} /> },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate("/login");
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${
        mobile ? "w-64" : collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-2 px-4 py-5 border-b border-gray-100 ${collapsed && !mobile ? "justify-center" : ""}`}>
        {(!collapsed || mobile) && (
          <span className="text-xl font-extrabold text-gray-900">
            Sound<span className="text-indigo-600">Core</span>
            <span className="ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Admin</span>
          </span>
        )}
        {collapsed && !mobile && (
          <span className="text-xl font-extrabold text-indigo-600">S</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                collapsed && !mobile ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {(!collapsed || mobile) && item.label}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle (Desktop) */}
      {!mobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-2 px-3 py-3 mx-2 mb-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-700 text-sm transition ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? <Menu size={18} /> : <><Menu size={18} /><span>Collapse</span></>}
        </button>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className={`flex items-center gap-2 px-3 py-3 mx-2 mb-4 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium transition ${collapsed && !mobile ? "justify-center" : ""}`}
      >
        <LogOut size={18} />
        {(!collapsed || mobile) && "Logout"}
      </button>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
          <button
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>
          <h2 className="text-sm font-semibold text-gray-500">Admin Dashboard</h2>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;