import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { getProduct, resetProduct } from "../../../features/products/productSlice";
import { addToCart } from "../../../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../../features/wishlist/wishlistSlice";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { ShoppingCart, Zap, ArrowLeft, Star, Shield, Truck, RefreshCw } from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, isLoading, isError, message } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getProduct(id));
    return () => dispatch(resetProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.length > 0) setMainImage(product.images[0]);
  }, [product]);

  const currentWishlist = wishlistItems.length > 0 ? wishlistItems : user?.wishlist || [];
  const like = currentWishlist.some((item) => {
    const wid = item?.product_id || item?.ProductID || item?.id;
    const cid = product?.id || product?.ID;
    return String(wid) === String(cid);
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <p className="text-gray-600">Product not found.</p>
          <button onClick={() => navigate("/allproducts")} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const images = product?.images || [];
  const hasOffer = product?.offerprice && Number(product.offerprice) < Number(product.price);
  const discount = hasOffer ? Math.round(((product.price - product.offerprice) / product.price) * 100) : 0;

  const toggleWishlist = () => {
    if (!user) { toast.error("Please login to use wishlist"); return; }
    if (like) { dispatch(removeFromWishlist(product)); toast.success("Removed from wishlist"); }
    else { dispatch(addToWishlist(product.id)); toast.success("Added to wishlist"); }
  };

  const handleAddToCart = () => {
    if (!user) { toast.error("Please login to add to cart"); return; }
    dispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) { toast.error("Please login to buy"); return; }
    navigate("/checkout", { state: { product, quantity: qty } });
  };

  const PERKS = [
    { icon: <Truck size={16} />, text: "Free delivery on orders ₹999+" },
    { icon: <RefreshCw size={16} />, text: "Easy 10-day returns" },
    { icon: <Shield size={16} />, text: "2-Year warranty included" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Images */}
            <div className="p-8 bg-gray-50 flex flex-col items-center gap-4">
              <div className="relative w-full max-w-sm aspect-square flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
                <img
                  src={mainImage || images[0] || "/noimage.png"}
                  alt={product.name}
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
                {hasOffer && (
                  <span className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{discount}% OFF
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition ${mainImage === img ? "border-indigo-600" : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-8 flex flex-col">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-sm text-gray-500">(124 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-extrabold text-gray-900">
                  ₹{Number(hasOffer ? product.offerprice : product.price).toLocaleString("en-IN")}
                </span>
                {hasOffer && (
                  <span className="text-xl text-gray-400 line-through">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {product.desc || product.description || "Premium quality audio product."}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-gray-700">Qty:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-semibold text-gray-900">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap size={18} /> Buy Now
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition ${like ? "bg-rose-500 border-rose-500 text-white" : "border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-500"
                    }`}
                >
                  {like ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                </button>
              </div>

              {/* Perks */}
              <div className="border-t border-gray-100 pt-5 space-y-2">
                {PERKS.map((p) => (
                  <div key={p.text} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="text-indigo-500">{p.icon}</span> {p.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;