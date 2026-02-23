import React, { useEffect } from "react";
import Navbar from "../../../shared/components/Navbar";
import ProductDisplay from "../../../shared/components/ProductDisplay";
import Footer from "../../../shared/components/Footer";

function AllProducts() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-1">
            Catalog
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900">All Products</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Explore our full range of premium headphones and audio gear.
          </p>
        </div>
      </div>

      {/* Products */}
      <ProductDisplay />

      <Footer />
    </div>
  );
}

export default AllProducts;