import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = ["Wireless", "Wired", "Earbuds", "Neckband", "Gaming", "Studio", "Luxury"];

function ProductDisplay({ initialCategory = "" }) {
  const [searchName, setSearchName] = useState("");
  const [selectedType, setSelectedType] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    setSelectedType(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          search: searchName || "",
          category: selectedType || "",
          min_price: minPrice || "",
          max_price: maxPrice || "",
        };
        const res = await api.get(ENDPOINTS.PRODUCTS.FILTER, {
          params,
          signal: controller.signal,
        });
        let result = res.data?.data || [];
        if (!Array.isArray(result)) result = [];
        setProducts(result);
        setCurrentPage(1);
      } catch (err) {
        if (err.name === "CanceledError" || err.name === "AbortError") return;
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchProducts, 400);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [searchName, selectedType, minPrice, maxPrice]);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const clearFilters = () => {
    setSelectedType("");
    setMinPrice("");
    setMaxPrice("");
    setSearchName("");
  };

  const hasFilters = selectedType || minPrice || maxPrice || searchName;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search headphones, earbuds, brands..."
            className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
          />
          {searchName && (
            <button
              onClick={() => setSearchName("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 transition bg-white shadow-sm"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasFilters && (
            <span className="ml-1 w-2 h-2 rounded-full bg-indigo-600 inline-block" />
          )}
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-4 py-3 text-sm text-rose-500 hover:text-rose-600 font-medium"
          >
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedType(selectedType === c ? "" : c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${selectedType === c
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Min Price (₹)
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Max Price (₹)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="100000"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-5">
          {products.length === 0
            ? "No products found"
            : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
        </p>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🎧</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} data={product} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - currentPage) <= 2)
            .map((p) => (
              <button
                key={p}
                onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${currentPage === p
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {p}
              </button>
            ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDisplay;