import React, { useState, useEffect } from "react";
import { ArrowLeft, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";

function ManageUsers() {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/');
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);

        const updated = allUsers.filter((u) => u.id !== id);
        setAllUsers(updated);

        alert("✅ User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("❌ Failed to delete user. Please try again.");
      }
    }
  };


  const handleToggleBlock = async (id) => {
    try {
      const userToUpdate = allUsers.find((u) => u.id === id);
      const updatedBlockedStatus = !userToUpdate.blocked;

      // Optimistic update
      const updated = allUsers.map((u) =>
        u.id === id ? { ...u, blocked: updatedBlockedStatus } : u
      );
      setAllUsers(updated);

      await api.patch(`/admin/users/${id}/block`, {
        blocked: updatedBlockedStatus,
      });

      alert(`User ${id} ${updatedBlockedStatus ? "blocked" : "unblocked"} successfully.`);
    } catch (error) {
      console.error("Error updating block status:", error);
      alert("Error updating block status. Reverting changes.");
      fetchUsers(); // Revert
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/edituser/${id}`)
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          👥 Manage Users
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : allUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                  <th className="px-4 py-3 text-left">Profile</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    {/* Profile */}
                    <td className="px-4 py-3">
                      <img
                        src={
                          user.profile ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {user.name}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>

                    {/* Status */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.blocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                          }`}
                      >
                        {user.blocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Edit User"
                      >
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        onClick={() => handleToggleBlock(user.id)}
                        className={`p-2 rounded-full ${user.blocked
                          ? "text-green-600 hover:bg-green-100"
                          : "text-gray-600 hover:bg-gray-100"
                          }`}
                        title={user.blocked ? "Unblock User" : "Block User"}
                      >
                        {user.blocked ? <Unlock size={18} /> : <Lock size={18} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;
