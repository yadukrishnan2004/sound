import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Loader2, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";
import EditProductModal from "../components/EditProductModal";

// ─── constants ───────────────────────────────────────────────────────────────

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

const inputCls =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 hover:bg-white";

// ─── ManageProducts ──────────────────────────────────────────────────────────

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(EMPTY_FORM);

  // The product currently being edited (null = modal hidden)
  const [editTarget, setEditTarget] = useState(null);

  // ── data fetching ──────────────────────────────────────────────────────────

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Use the admin endpoint so the data matches the Go Product struct exactly
      const res = await api.get(ENDPOINTS.ADMIN.PRODUCTS.LIST);
      setProducts(res.data?.data || res.data || []);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── add product ────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.price || !formData.category.trim()) {
      toast.error("Name, price and category are required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price) || 0,
      desc: formData.description.trim(),
      category: formData.category.trim(),
      images: formData.images.filter(Boolean),
      stock: Number(formData.stock) || 0,
      offer: formData.offer.trim(),
      offerprice: Number(formData.offerprice) || 0,
      production: formData.production.trim(),
    };

    setSubmitting(true);
    try {
      const res = await api.post(ENDPOINTS.ADMIN.PRODUCTS.ADD, payload);
      const created = res.data?.data || res.data;
      setProducts((prev) => [created, ...prev]);
      setFormData(EMPTY_FORM);
      toast.success("Product added successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  };

  // ── delete product ─────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This action cannot be undone.")) return;

    try {
      await api.delete(ENDPOINTS.ADMIN.PRODUCTS.DELETE(id));
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } 
  };

  // ── after modal saves ──────────────────────────────────────────────────────

  const handleSaved = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  // ── helpers ────────────────────────────────────────────────────────────────

  const set = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-gray-600">
        <Loader2 className="animate-spin" size={22} />
        Loading products…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 lg:p-10">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🎧 Product Management</h1>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or category…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      {/* ── Add product form ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md border p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-5 border-b pb-3 flex items-center gap-2">
          <Plus size={18} className="text-green-600" /> Add New Product
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Name <span className="text-red-500">*</span>
            </label>
            <input className={inputCls} placeholder="e.g. Sony WH-1000XM5"
              value={formData.name} onChange={set("name")} />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Category <span className="text-red-500">*</span>
            </label>
            <input className={inputCls} placeholder="e.g. Headphones"
              value={formData.category} onChange={set("category")} />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input className={inputCls} type="number" min="0" placeholder="0.00"
              value={formData.price} onChange={set("price")} />
          </div>

          {/* Stock */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</label>
            <input className={inputCls} type="number" min="0" placeholder="0"
              value={formData.stock} onChange={set("stock")} />
          </div>

          {/* Offer */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Offer Label</label>
            <input className={inputCls} placeholder='e.g. "10% OFF"'
              value={formData.offer} onChange={set("offer")} />
          </div>

          {/* Offer Price */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Offer Price (₹)</label>
            <input className={inputCls} type="number" min="0" placeholder="0"
              value={formData.offerprice} onChange={set("offerprice")} />
          </div>

          {/* Production */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Production / Origin</label>
            <input className={inputCls} placeholder="e.g. Made in Japan"
              value={formData.production} onChange={set("production")} />
          </div>

          {/* Image URL (first) */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Image URL</label>
            <input className={inputCls} placeholder="https://…"
              value={formData.images[0]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, images: [e.target.value] }))
              }
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Describe the product…"
              value={formData.description}
              onChange={set("description")}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={submitting}
          className="mt-5 flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          {submitting
            ? <><Loader2 size={16} className="animate-spin" /> Adding…</>
            : <><Plus size={16} /> Add Product</>
          }
        </button>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-16">
          {searchTerm ? `No products matching "${searchTerm}"` : "No products found."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onEdit={() => setEditTarget(item)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* ── Edit modal ───────────────────────────────────────────────────── */}
      <EditProductModal
        product={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}

// ─── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({ product, onEdit, onDelete }) {
  const { name, price, category, images, stock, offer, offerprice, description } = product;

  return (
    <div className="bg-white rounded-2xl border shadow-md hover:shadow-lg transition flex flex-col overflow-hidden">
      {/* Image */}
      <div className="relative h-44 bg-gray-100">
        <img
          src={images?.[0]}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        {offer && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {offer}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-1">
        <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">{category}</p>
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{name}</h3>

        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-gray-800 font-semibold text-sm">₹{Number(price).toLocaleString()}</span>
          {offerprice > 0 && (
            <span className="text-green-600 text-xs font-medium">
              → ₹{Number(offerprice).toLocaleString()}
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>

        <div className="mt-2">
          {stock > 0 ? (
            <span className="text-green-600 text-xs font-semibold">🟢 In Stock ({stock})</span>
          ) : (
            <span className="text-red-500 text-xs font-semibold">🔴 Out of Stock</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition"
        >
          <Pencil size={14} /> Edit
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}

export default ManageProducts;