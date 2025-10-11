import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";

function ProductFilter({ data }) {
  const products = useMemo(() => data || [], [data]);

  const [searchName, setSearchName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 
  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    let filtered = products;

    if (searchName.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;
      filtered = filtered.filter((p) => {
        const price = parseInt(p.price);
        return price >= min && price <= max;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // reset to first page when filters change
  }, [searchName, selectedType, minPrice, maxPrice, products]);

  const handleClearFilters = () => {
    setSearchName("");
    setSelectedType("");
    setMinPrice("");
    setMaxPrice("");
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" }); // smooth scroll up on page change
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        🎧 Headset Shop
      </h1>

      {/* Filters */}
      <div className="max-w-4xl mx-auto mb-8 bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter headset name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Filter Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="">All Types</option>
              <option value="wired">wired</option>
              <option value="wireless">wireless</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100 mb-2">
              Filter by Price (₹)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="text-black w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="text-black w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full bg-gray-500 text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-100">
          Showing {currentProducts.length} of {filteredProducts.length} products
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex justify-center">
        <div className="flex justify-center items-center">
          <div className="max-w-screen-xl w-full px-4 py-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {currentProducts.length !== 0 ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))
            ) : (
              <div className="flex w-full justify-center items-center">
                <div className="absolute w-full text-center text-white/70 py-20">
                  <p className="text-xl">No products found in this category.</p>
                  <p className="mt-2 text-sm">
                    Please check back later or explore other categories.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductFilter;
