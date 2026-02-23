import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar";
import ProductDisplay from "../../../shared/components/ProductDisplay";
import Footer from "../../../shared/components/Footer";
import { ArrowLeft } from "lucide-react";

function CategoryProducts() {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition mb-4"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mb-1">
            Category
          </p>
          <h1 className="text-3xl font-extrabold text-gray-900 capitalize">
            {categoryName} Products
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Explore our best selection of {categoryName?.toLowerCase()} audio gear.
          </p>
        </div>
      </div>

      {/* Products Display pre-filtered by category */}
      <ProductDisplay initialCategory={categoryName} />

      <Footer />
    </div>
  );
}

export default CategoryProducts;
