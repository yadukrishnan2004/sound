import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, reset } from "../../../features/auth/authSlice";

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="text-2xl font-bold p-6 border-b border-gray-700">
                    Admin Panel
                </div>
                <nav className="flex-1 p-4 space-y-4">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition ${isActive ? "bg-blue-600 text-white" : "hover:text-blue-400"}`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="userlist"
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition ${isActive ? "bg-blue-600 text-white" : "hover:text-blue-400"}`
                        }
                    >
                        Manage Users
                    </NavLink>
                    <NavLink
                        to="productmanage"
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition ${isActive ? "bg-blue-600 text-white" : "hover:text-blue-400"}`
                        }
                    >
                        Manage Products
                    </NavLink>
                    <NavLink
                        to="manageorder"
                        className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg transition ${isActive ? "bg-blue-600 text-white" : "hover:text-blue-400"}`
                        }
                    >
                        Manage Orders
                    </NavLink>
                </nav>
                <button
                    onClick={handleLogout}
                    className="p-4 bg-red-600 hover:bg-red-700 text-white w-full text-left"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
