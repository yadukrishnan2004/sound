import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import axios from "axios";

function ProductPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    brand: "",
    price: "",
    images: [""],
    description: "",
    stock: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5001/jbl");
        setProducts(res.data);
      } catch (error) {
        alert("Error fetching data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5001/jbl/${id}`);
      setProducts(products.filter((item) => item.id !== id));
      alert("✅ Product deleted successfully!");
    } catch (error) {
      alert("❌ Error deleting product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setFormData(product);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5001/jbl/${editing}`,
        formData
      );
      setProducts(
        products.map((item) => (item.id === editing ? res.data : item))
      );

      alert("💾 Product updated successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Error saving product");
    } finally {
      setLoading(false);
      setEditing(null);
      resetForm();
    }
  };

  // ✅ Add New Product
  const handleAdd = async () => {
    if (!formData.name || !formData.price)
      return alert("Please fill all required fields");

    const newProduct = {
      ...formData,
      id: Date.now().toString(),
      images: [formData.images[0] || ""],
      stock: parseInt(formData.stock) || 0,
    };

    try {
      const res = await axios.post("http://localhost:5001/jbl", newProduct);
      setProducts([...products, res.data]);
      resetForm();
    } catch (error) {
      alert("❌ Error adding product");
    }
  };

  // ✅ Reset Form
  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      brand: "",
      price: "",
      images: [""],
      description: "",
      stock: "",
      isdeal: "",
    });
  };

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          🎧 Product Management
        </h1>

        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white border p-5 mb-8 rounded-xl shadow-md">
        <h2 className="text-2xl mb-4 font-semibold text-gray-700 border-b pb-2">
          {editing ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={formData.images[0]}
            onChange={(e) =>
              setFormData({ ...formData, images: [e.target.value] })
            }
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select
            value={formData.isdeal}
            onChange={(e) =>
              setFormData({ ...formData, isdeal: e.target.value === "true" })
            }
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>

          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border p-2 rounded-md col-span-1 sm:col-span-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>

        <div className="mt-5">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              💾 Save Changes
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              ➕ Add Product
            </button>
          )}
        </div>
      </div>

      {/* Product List */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">
          No products found for “{searchTerm}”
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-xl shadow-md bg-white hover:shadow-lg transition"
            >
              <img
                src={item?.images[0]}
                alt={item.name}
                className="h-44 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold text-lg text-gray-800">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">Brand: {item.brand}</p>
              <p className="text-sm text-gray-700 font-medium">
                Price: ₹{item.price.toLocaleString()}
              </p>

              <div className="mt-2">
                {item.stock > 0 ? (
                  <span className="text-green-600 font-semibold">
                    🟢 In Stock ({item.stock})
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    🔴 Out of Stock
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                {item.description}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md font-medium transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-medium transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;
