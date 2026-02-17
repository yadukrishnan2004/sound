import React, { useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function AddressModal({ onClose, onSuccess }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        house_name: "",
        street: "",
        city: "",
        state: "",
        pin_code: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const res = await api.post('/addresses', form);

            if (res.status === 200 || res.status === 201) {
                if (onSuccess) await onSuccess();
                toast.success("Address saved successfully");
                onClose();
                return;
            }

            toast.error("Failed to save address");

        } catch (err) {
            console.error("Address save failed:", err);
            toast.error(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to save address"
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg border border-white/10">

                <h2 className="text-xl font-bold mb-4 text-white">Add Address</h2>

                <div className="grid grid-cols-2 gap-3">
                    <input name="name" placeholder="Name" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    <input name="house_name" placeholder="House Name" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    <input name="street" placeholder="Street" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    <input name="city" placeholder="City" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    <input name="state" placeholder="State" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500" />
                    <input name="pin_code" placeholder="Pin Code" onChange={handleChange} className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-indigo-500 col-span-2" />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white hover:bg-gray-600">
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>

            </div>
        </div>
    );
}

export default AddressModal;
