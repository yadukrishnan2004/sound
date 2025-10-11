import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ApiContext } from "../context/ApiContext";
import Navbar from "../Parts/Navbar";
import ProductDisplay from "../Parts/ProductDisplay";

function Catogery() {
  const { catogery } = useParams();
  const { jbl } = useContext(ApiContext);

  const products = jbl.filter((p) => p.mainCategory === catogery);
  console.log(products);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white overflow-x-hidden flex flex-col">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 shadow-md">
        <Navbar color="white" />
      </div>

      <div className="h-30"></div>

      {/* Page Header */}
      <header className="text-center px-4 py-10">
        <h1 className="text-4xl font-extrabold uppercase tracking-wide text-white drop-shadow-lg">
          {catogery}
        </h1>
        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
          Discover our best-in-class {catogery} headphones curated for
          performance and style.
        </p>
      </header>

      {/* Product Grid */}
      <main className="flex-grow px-6 pb-20">
        {products.length > 0 ? (
          <ProductDisplay data={products} />
        ) : (
          <div className="text-center text-white/70 py-20">
            <p className="text-xl">No products found in this category.</p>
            <p className="mt-2 text-sm">
              Please check back later or explore other categories.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Catogery;
