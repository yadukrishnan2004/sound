import React, { useState } from "react";
import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";
import toast from "react-hot-toast";
import { X, MapPin } from "lucide-react";

const FIELDS = [
  { key: "name", label: "Full Name", placeholder: "Recipient name" },
  { key: "phone", label: "Phone", placeholder: "10-digit phone number" },
  { key: "house_name", label: "House / Building", placeholder: "Flat no., Building name" },
  { key: "street", label: "Street / Area", placeholder: "Street, Colony" },
  { key: "city", label: "City", placeholder: "City" },
  { key: "state", label: "State", placeholder: "State" },
  { key: "pin_code", label: "PIN Code", placeholder: "6-digit PIN code" },
];

function AddressModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "", phone: "", house_name: "", street: "", city: "", state: "", pin_code: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(ENDPOINTS.ADDRESS.CREATE, formData);
      toast.success("Address added successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin size={18} className="text-indigo-500" /> Add New Address
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-4">
            {FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={formData[key]}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-sm font-semibold transition"
            >
              {loading ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddressModal;