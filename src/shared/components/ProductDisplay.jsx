import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import api from "../../services/api";
import { ENDPOINTS } from "../../services/endpoints";

function ProductDisplay() {
    const [searchName, setSearchName] = useState("");

    // backend filters
    const [selectedType, setSelectedType] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // products from backend
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // =====================================================
    //  BACKEND FILTER + SEARCH (Race-safe + Cancel request)
    // =====================================================
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

                const res = await api.get(
                    ENDPOINTS.PRODUCTS.FILTER,
                    {
                        params,
                        signal: controller.signal, //  cancel previous request
                    }
                );

                let result = res.data?.data || [];
                if (!Array.isArray(result)) result = [];

                setProducts(result);
                setCurrentPage(1);
            } catch (err) {
                // Ignore cancelled requests
                if (err.name === "CanceledError" || err.name === "AbortError") {
                    return;
                }
                console.error("Fetch failed:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        // 🔥 debounce
        const timer = setTimeout(fetchProducts, 400);

        // 🔥 cleanup: cancel request + timeout
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchName, selectedType, minPrice, maxPrice]);

    // =====================================================
    //  FRONTEND PAGINATION
    // =====================================================
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;

    const currentProducts = products.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleClearFilters = () => {
        setSelectedType("");
        setMinPrice("");
        setMaxPrice("");
    };

    return (
        <div className="p-6">
            {/* SEARCH + FILTER UI */}
            <div className="max-w-4xl mx-auto mb-8 bg-white/20 backdrop-blur-md shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">
                    Search Products
                </h2>

                <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="text-black w-full px-4 py-3 rounded-lg mb-6"
                    placeholder="Search from backend..."
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* CATEGORY */}
                    <div>
                        <label className="block text-sm text-white mb-2">
                            Category
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="text-black w-full px-4 py-2 rounded-lg"
                        >
                            <option value="">All</option>
                            <option value="wired">Wired</option>
                            <option value="wireless">Wireless</option>
                            <option value="earbuds">Earbuds</option>
                            <option value="neckband">Neckband</option>
                            <option value="gaming">Gaming</option>
                            <option value="studio">Studio</option>
                            <option value="luxury">Luxury</option>
                            <option value="fitness">Fitness</option>
                        </select>
                    </div>

                    {/* PRICE */}
                    <div>
                        <label className="block text-sm text-white mb-2">
                            Price (₹)
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                placeholder="Min"
                                className="text-black w-1/2 px-4 py-2 rounded-lg"
                            />
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                placeholder="Max"
                                className="text-black w-1/2 px-4 py-2 rounded-lg"
                            />
                        </div>
                    </div>

                    {/* CLEAR */}
                    <div className="flex items-end">
                        <button
                            onClick={handleClearFilters}
                            className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                <div className="mt-4 text-sm text-white/80">
                    {loading
                        ? "Searching..."
                        : `Showing ${currentProducts.length} of ${products.length}`}
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="max-w-screen-xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {loading ? (
                    <div className="col-span-full text-center text-white/70 py-20">
                        Loading...
                    </div>
                ) : currentProducts.length ? (
                    currentProducts.map((product) => (
                        <ProductCard key={product.id} data={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-white/70 py-20">
                        No products found.
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
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
                                    : "bg-gray-700 text-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductDisplay;
