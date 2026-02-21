import React, { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";

// ─── helpers ────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
    name: "",
    price: "",
    description: "",
    category: "",
    images: [""],
    stock: "",
    offer: "",
    offerprice: "",
    production: "",
};

function toPayload(form) {
    return {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        description: form.description.trim(),   // backend field: "desc"
        category: form.category.trim(),
        images: form.images.filter(Boolean),
        stock: Number(form.stock) || 0,
        offer: form.offer.trim(),
        offerprice: Number(form.offerprice) || 0,
        production: form.production.trim(),
    };
}

// ─── sub-components ─────────────────────────────────────────────────────────

function Field({ label, children, required }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputCls =
    "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white";

// ─── main component ──────────────────────────────────────────────────────────

/**
 * EditProductModal
 *
 * Props:
 *  product  – product object to edit (null → hidden)
 *  onClose  – called when modal should close
 *  onSaved  – called with the updated product after a successful save
 */
function EditProductModal({ product, onClose, onSaved }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // Populate form whenever the target product changes
    useEffect(() => {
        if (!product) return;
        setForm({
            name: product.name ?? "",
            price: product.price ?? "",
            description: product.description ?? "",   // Go JSON tag "desc" → JS "description"
            category: product.category ?? "",
            images: product.images?.length ? product.images : [""],
            stock: product.stock ?? "",
            offer: product.offer ?? "",
            offerprice: product.offerprice ?? "",
            production: product.production ?? "",
        });
    }, [product]);

    if (!product) return null;

    // ── field helpers ──────────────────────────────────────────────────────────

    const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const setImage = (index, value) =>
        setForm((prev) => {
            const imgs = [...prev.images];
            imgs[index] = value;
            return { ...prev, images: imgs };
        });

    const addImageField = () =>
        setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));

    const removeImageField = (index) =>
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));

    // ── submit ─────────────────────────────────────────────────────────────────

    const handleSave = async () => {
        if (!form.name.trim() || !form.price || !form.category.trim()) {
            toast.error("Name, price and category are required");
            return;
        }

        setSaving(true);
        try {
            const payload = toPayload(form);
            const res = await api.put(ENDPOINTS.ADMIN.PRODUCTS.UPDATE(product.id), payload);
            const updated = res.data?.data || res.data;
            toast.success("Product updated successfully");
            onSaved(updated);
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update product");
        } finally {
            setSaving(false);
        }
    };

    // ── render ─────────────────────────────────────────────────────────────────

    return (
        /* Backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
                        <p className="text-xs text-gray-400 mt-0.5">ID: {product.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-5 flex flex-col gap-5">

                    {/* Row 1 – Name & Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Product Name" required>
                            <input className={inputCls} placeholder="e.g. Sony WH-1000XM5"
                                value={form.name} onChange={set("name")} />
                        </Field>
                        <Field label="Category" required>
                            <input className={inputCls} placeholder="e.g. Headphones"
                                value={form.category} onChange={set("category")} />
                        </Field>
                    </div>

                    {/* Row 2 – Price & Stock */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Price (₹)" required>
                            <input className={inputCls} type="number" min="0" placeholder="0.00"
                                value={form.price} onChange={set("price")} />
                        </Field>
                        <Field label="Stock">
                            <input className={inputCls} type="number" min="0" placeholder="0"
                                value={form.stock} onChange={set("stock")} />
                        </Field>
                    </div>

                    {/* Row 3 – Offer & Offer Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Offer Label">
                            <input className={inputCls} placeholder='e.g. "10% OFF"'
                                value={form.offer} onChange={set("offer")} />
                        </Field>
                        <Field label="Offer Price (₹)">
                            <input className={inputCls} type="number" min="0" placeholder="0"
                                value={form.offerprice} onChange={set("offerprice")} />
                        </Field>
                    </div>

                    {/* Row 4 – Production */}
                    <Field label="Production / Origin">
                        <input className={inputCls} placeholder="e.g. Made in Japan"
                            value={form.production} onChange={set("production")} />
                    </Field>

                    {/* Description */}
                    <Field label="Description" required>
                        <textarea
                            className={`${inputCls} resize-none`}
                            rows={3}
                            placeholder="Describe the product…"
                            value={form.description}
                            onChange={set("description")}
                        />
                    </Field>

                    {/* Images */}
                    <Field label="Image URLs">
                        <div className="flex flex-col gap-2">
                            {form.images.map((url, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <input
                                        className={`${inputCls} flex-1`}
                                        placeholder={`Image URL ${i + 1}`}
                                        value={url}
                                        onChange={(e) => setImage(i, e.target.value)}
                                    />
                                    {/* Preview thumbnail */}
                                    {url && (
                                        <img
                                            src={url}
                                            alt=""
                                            className="h-9 w-9 object-cover rounded-md border shrink-0"
                                            onError={(e) => (e.target.style.display = "none")}
                                        />
                                    )}
                                    {form.images.length > 1 && (
                                        <button
                                            onClick={() => removeImageField(i)}
                                            className="text-red-400 hover:text-red-600 transition shrink-0"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addImageField}
                                className="self-start text-sm text-blue-600 hover:underline mt-1"
                            >
                                + Add another image
                            </button>
                        </div>
                    </Field>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="px-5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProductModal;