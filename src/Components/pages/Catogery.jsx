import React, { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import Navbar from "../Parts/Navbar";
import ProductDisplay from "../Parts/ProductDisplay";

function Catogery() {
  const { catogery } = useParams();
  const { jbl } = useContext(ApiContext);

  // ✅ make sure array
  const productsData = Array.isArray(jbl) ? jbl : [];

  // ✅ filter using category (NOT mainCategory)
  const products = useMemo(() => {
    return productsData.filter(
      (p) =>
        p?.category?.toLowerCase() ===
        catogery?.toLowerCase()
    );
  }, [productsData, catogery]);

  const loading = !productsData.length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white flex flex-col">
      
      <div className="sticky top-0 z-50 shadow-md">
        <Navbar color="white" />
      </div>

      <div className="h-24" />

      {/* HEADER */}
      <header className="text-center px-4 py-10">
        <h1 className="text-4xl font-extrabold uppercase tracking-wide">
          {catogery}
        </h1>

        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
          Discover our best {catogery} products.
        </p>
      </header>

      {/* PRODUCTS */}
      <main className="flex-grow px-6 pb-20">
        {loading ? (
          <div className="text-center py-20">Loading products...</div>
        ) : products.length > 0 ? (
          <ProductDisplay data={products} />
        ) : (
          <div className="text-center text-white/70 py-20">
            <p className="text-xl">No products found in this category.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Catogery;
