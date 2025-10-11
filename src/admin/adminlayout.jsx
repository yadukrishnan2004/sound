import { NavLink, Outlet } from "react-router-dom";
import DashboardStats from "./admindashbourd";
import Graph from "./graph";
import Graph2 from "./graph2";
import Graph3 from "./graph3";
import { useAuth } from "../AuthContext/authcontext";

const AdminLayout = () => {
  const {logout}=useAuth();
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="text-2xl font-bold p-6 border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-4">
          <NavLink to="" className="block hover:text-blue-400">
            Dashboard
          </NavLink>
          <NavLink to="userlist" className="block hover:text-blue-400">
            Manage Users
          </NavLink>
          <NavLink to="productmanage" className="block hover:text-blue-400">
            Manage Products
          </NavLink>
          <NavLink to="manageorder" className="block hover:text-blue-400">
            Manage Orders
          </NavLink>
        </nav>
        <button
        onClick={()=>{logout()}}
         className="p-4 bg-red-600 hover:bg-red-700 text-white">
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
