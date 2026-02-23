import React, { useState, useEffect, useCallback } from "react";
import { Search, Plus, Loader2, Trash2, Pencil, Package, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { ENDPOINTS } from "../../../services/endpoints";
import EditProductModal from "../components/Editproductmodal";

// ─── constants ───────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: "",
  price: "",
  desc: "",
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
  const [editTarget, setEditTarget] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
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

  const handleAdd = async () => {
    if (!formData.name.trim() || !formData.price || !formData.category.trim()) {
      toast.error("Name, price and category are required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price) || 0,
      desc: formData.desc.trim(),
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

  const handleSaved = (updated) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const set = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-gray-600">
        <Loader2 className="animate-spin" size={22} />
        Loading products…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
            <p className="text-sm text-gray-500">Manage your inventory and product listings</p>
          </div>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white shadow-sm transition"
          />
        </div>
      </div>

      {/* Add product form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" /> Add New Product
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Name <span className="text-red-500">*</span>
            </label>
            <input 
              className={inputCls} 
              placeholder="e.g. Sony WH-1000XM5"
              value={formData.name} 
              onChange={set("name")} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Category <span className="text-red-500">*</span>
            </label>
            <input 
              className={inputCls} 
              placeholder="e.g. Headphones"
              value={formData.category} 
              onChange={set("category")} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input 
              className={inputCls} 
              type="number" 
              min="0" 
              placeholder="0.00"
              value={formData.price} 
              onChange={set("price")} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Stock</label>
            <input 
              className={inputCls} 
              type="number" 
              min="0" 
              placeholder="0"
              value={formData.stock} 
              onChange={set("stock")} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Offer Label</label>
            <input 
              className={inputCls} 
              placeholder='e.g. "10% OFF"'
              value={formData.offer} 
              onChange={set("offer")} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Offer Price (₹)</label>
            <input 
              className={inputCls} 
              type="number" 
              min="0" 
              placeholder="0"
              value={formData.offerprice} 
              onChange={set("offerprice")} 
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Production / Origin</label>
            <input 
              className={inputCls} 
              placeholder="e.g. Made in Japan"
              value={formData.production} 
              onChange={set("production")} 
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Image URL</label>
            <input 
              className={inputCls} 
              placeholder="https://..."
              value={formData.images[0]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, images: [e.target.value] }))
              }
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-3">
            <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Description</label>
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              placeholder="Describe the product..."
              value={formData.desc}
              onChange={set("desc")}
            />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={submitting}
          className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-blue-200"
        >
          {submitting ? (
            <><Loader2 size={16} className="animate-spin" /> Adding...</>
          ) : (
            <><Plus size={16} /> Add Product</>
          )}
        </button>
      </div>

      {/* Product grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Package className="text-gray-400" size={32} />
          </div>
          <p className="text-gray-500 text-lg">
            {searchTerm ? `No products matching "${searchTerm}"` : "No products found."}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {searchTerm ? "Try a different search term" : "Add your first product above"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Edit modal */}
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
  const { 
    name, 
    price, 
    category, 
    images, 
    stock, 
    offer, 
    offerprice, 
    desc 
  } = product;

  const hasValidImage = images?.[0] && images[0].trim() !== "";
  const discountPercent = offerprice > 0 && price > 0 
    ? Math.round(((price - offerprice) / price) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image Container */}
      <div className="relative h-52 bg-gray-50 overflow-hidden">
        {hasValidImage ? (
          <img
            src={images[0]}
            alt={name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback placeholder */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-50 ${hasValidImage ? 'hidden' : 'flex'}`}
        >
          <ImageIcon className="text-gray-300 mb-2" size={48} />
          <span className="text-gray-400 text-sm">No Image</span>
        </div>

        {/* Offer Badge */}
        {offer && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {offer}
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Badge */}
        <div className="absolute bottom-3 left-3">
          {stock > 0 ? (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200">
              In Stock ({stock})
            </span>
          ) : (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category */}
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md w-fit">
          {category}
        </span>

        {/* Name */}
        <h3 className="font-bold text-gray-800 text-base line-clamp-1" title={name}>
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-gray-900 font-bold text-lg">
            ₹{Number(offerprice > 0 ? offerprice : price).toLocaleString()}
          </span>
          {offerprice > 0 && (
            <span className="text-gray-400 text-sm line-through">
              ₹{Number(price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {desc || "No description available"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          <Pencil size={16} /> Edit
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={onDelete}
          className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
}

export default ManageProducts;