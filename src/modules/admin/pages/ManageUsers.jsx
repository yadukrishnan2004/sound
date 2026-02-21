// src/modules/admin/pages/ManageUsers.jsx

import React, { useEffect } from "react";
import { ArrowLeft, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchAdminUsers,
  deleteAdminUser,
  toggleBlockUser,
  clearAdminError,
  clearAdminSuccess,
} from "../../../features/admin/adminslice";

function ManageUsers() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    users,
    loadingUsers,
    loadingDelete,
    loadingBlock,
    error,
    successMessage,
  } = useSelector((state) => state.admin);

  // ── Fetch all users on mount ───────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  // ── Show success toast from Redux state ───────────────────────────────────
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearAdminSuccess());
    }
  }, [successMessage, dispatch]);

  // ── Show error toast from Redux state ─────────────────────────────────────
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAdminError());
    }
  }, [error, dispatch]);

  // ── Delete user ───────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteAdminUser(id));
    }
  };

  // ── Block / Unblock — PATCH via adminSlice (NOT GET, NOT navigate) ────────
  const handleToggleBlock = (user) => {
    dispatch(toggleBlockUser({ id: user.id, blocked: !user.is_blocked }));
  };

  // ── Edit user ─────────────────────────────────────────────────────────────
  const handleEdit = (id) => {
    navigate(`/admin/edituser/${id}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
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

        {loadingUsers ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
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
                {users?.map((user) => (
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${user.is_blocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >
                        {user.is_blocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3">

                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={loadingDelete}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition disabled:opacity-40"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>

                        {/* Block / Unblock — dispatches PATCH via adminSlice */}
                        <button
                          onClick={() => handleToggleBlock(user)}
                          disabled={loadingBlock}
                          className={`p-2 rounded-full transition disabled:opacity-40 ${user.is_blocked
                              ? "text-green-600 hover:bg-green-100"
                              : "text-gray-600 hover:bg-gray-100"
                            }`}
                          title={user.is_blocked ? "Unblock User" : "Block User"}
                        >
                          {user.is_blocked ? (
                            <Unlock size={18} />
                          ) : (
                            <Lock size={18} />
                          )}
                        </button>

                      </div>
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