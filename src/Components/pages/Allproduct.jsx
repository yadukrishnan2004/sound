import React, { useContext } from "react";
import { ApiContext } from "../context/ApiContext";
import Navbar from "../Parts/Navbar";
import ProductDisplay from "../Parts/ProductDisplay";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";

function Allproduct() {
  const { jbl } = useContext(ApiContext);

  return (
    <div className="min-h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white overflow-x-hidden">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 shadow-md">
        <Navbar color={"white"} />
      </div>
               <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>

      <div className="h-10">

      </div>

      {/* Page Header */}
      <header className="text-center px-1 mt-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
          All Products
        </h1>
        <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
          Explore our full catalog of premium headphones across all categories.
        </p>
      </header>

      {/* Product Grid */}
      <main className="flex-grow mx-auto w-full pb-20">
        <ProductDisplay data={jbl} />
      </main>


        <Footer />
    </div>
  );
}

export default Allproduct;
