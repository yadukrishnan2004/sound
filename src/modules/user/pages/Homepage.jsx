import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../features/products/productSlice";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import ProductCard from "../../../shared/components/ProductCard";
import { ArrowRight, Star, Shield, Truck, Headphones } from "lucide-react";

const CATEGORIES = [
  { name: "Wireless", emoji: "🎧", desc: "Freedom of movement" },
  { name: "Wired", emoji: "🎵", desc: "Pure audio fidelity" },
  { name: "Earbuds", emoji: "🎶", desc: "Compact & powerful" },
  { name: "Gaming", emoji: "🎮", desc: "Immersive experience" },
  { name: "Studio", emoji: "🎙️", desc: "Professional grade" },
  { name: "Neckband", emoji: "🔊", desc: "Hands-free comfort" },
];

const FEATURES = [
  { icon: <Truck size={22} />, title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: <Shield size={22} />, title: "2-Year Warranty", desc: "All products covered" },
  { icon: <Star size={22} />, title: "Top Rated", desc: "Loved by 10,000+ users" },
  { icon: <Headphones size={22} />, title: "Expert Support", desc: "7 days a week" },
];

function Homepage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, isLoading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const featured = products?.slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-indigo-100 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              New Arrivals 2025
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
              Hear Every<br />
              <span className="text-indigo-600">Detail</span> Clearly.
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto md:mx-0">
              Discover premium headphones and earbuds designed for audiophiles, gamers, and everyday music lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={() => navigate("/allproducts")}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-base"
              >
                Shop Now <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/allproducts")}
                className="px-7 py-3.5 border-2 border-gray-200 hover:border-indigo-300 text-gray-700 font-semibold rounded-xl transition text-base"
              >
                View All
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center md:justify-start">
              {[
                { val: "500+", label: "Products" },
                { val: "10K+", label: "Happy Customers" },
                { val: "4.9★", label: "Avg Rating" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{s.val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-indigo-100 rounded-full" />
              <img
                src={products?.[0]?.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"}
                alt="Featured headphone"
                className="relative z-10 w-full h-full object-contain p-6 drop-shadow-2xl"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"; }}
              />
              {/* Floating badge */}
              <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl shadow-lg px-4 py-3 z-20 border border-gray-100">
                <p className="text-xs text-gray-400">Best Seller</p>
                <p className="font-bold text-gray-900 text-sm">{products?.[0]?.name || "SoundCore Pro"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-indigo-600 text-white py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {f.icon}
                </div>
                <p className="font-semibold text-sm">{f.title}</p>
                <p className="text-indigo-200 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider mb-1">Browse</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Shop by Category</h2>
          </div>
          <button
            onClick={() => navigate("/allproducts")}
            className="hidden sm:flex items-center gap-1 text-indigo-600 font-medium text-sm hover:gap-2 transition-all"
          >
            View All <ArrowRight size={15} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/category/${cat.name}`)}
              className="group bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">{cat.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-indigo-600 text-sm font-semibold uppercase tracking-wider mb-1">Hand-picked</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Products</h2>
          </div>
          <button
            onClick={() => navigate("/allproducts")}
            className="hidden sm:flex items-center gap-1 text-indigo-600 font-medium text-sm hover:gap-2 transition-all"
          >
            See All <ArrowRight size={15} />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {featured.map((p) => (
              <ProductCard key={p.id} data={p} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/allproducts")}
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition"
          >
            View All Products <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="bg-gray-900 text-white py-16 mx-6 rounded-3xl mb-16 max-w-7xl lg:mx-auto overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-800/40 via-transparent to-transparent" />
        <div className="relative z-10 text-center px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            Ready to Upgrade Your Sound?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Shop the latest premium headphones with free shipping and easy returns.
          </p>
          <button
            onClick={() => navigate("/allproducts")}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition text-base"
          >
            Shop Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;