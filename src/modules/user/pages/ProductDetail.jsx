import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProduct, resetProduct } from "../../../features/products/productSlice";
import { addToCart } from "../../../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../../features/wishlist/wishlistSlice";
import Navbar from "../../../shared/components/Navbar";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function ProductDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { product, isLoading, isError, message } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    // Using direct user.wishlist fallback until wishlistSlice is fully synced if needed
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const [mainImage, setMainImage] = useState("");

    useEffect(() => {
        dispatch(getProduct(id));
        return () => {
            dispatch(resetProduct());
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (product && product.images?.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-amber-400"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <h2>Error: {message}</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <h2>Product not found</h2>
            </div>
        );
    }

    const productImages = product?.images || [];

    // Wishlist Logic
    const currentWishlist = wishlistItems.length > 0 ? wishlistItems : (user?.wishlist || []);
    const like = currentWishlist.some((item) => {
        const wishlistProductId = item?.product_id || item?.ProductID || item?.id;
        const currentProductId = product?.id || product?.ID;
        return String(wishlistProductId) === String(currentProductId);
    });

    const toggleWishlist = () => {
        if (!user) {
            alert("Please login to use wishlist");
            return;
        }
        if (like) {
            dispatch(removeFromWishlist(product));
        } else {
            dispatch(addToWishlist(product));
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            alert("Please login to add to cart");
            return;
        }
        dispatch(addToCart(product));
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/10 backdrop-blur-lg rounded-2xl p-10">

                    {/* IMAGE */}
                    <div className="flex flex-col items-center">
                        <img
                            src={mainImage || productImages[0] || "/noimage.png"}
                            alt={product.name}
                            className="w-full max-w-md object-contain"
                        />

                        {productImages.length > 1 && (
                            <div className="flex gap-3 mt-6">
                                {productImages.map((img, i) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt=""
                                        className={`w-20 h-20 cursor-pointer border ${mainImage === img ? "border-amber-400" : ""
                                            }`}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col gap-4">
                        <h1 className="text-4xl font-bold">{product.name}</h1>

                        <p className="text-white/70">
                            Category: {product.category}
                        </p>

                        <p className="text-3xl font-bold text-amber-400">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>

                        <p
                            className={`${product.stock > 0
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                        >
                            {product.stock > 0
                                ? `In Stock (${product.stock})`
                                : "Out of Stock"}
                        </p>

                        <p className="text-white/80">{product.desc || product.description}</p>

                        {/* BUTTONS */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={handleAddToCart}
                                className="bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl text-black font-semibold transition"
                            >
                                🛒 Add to Cart
                            </button>

                            <button
                                onClick={toggleWishlist}
                                className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition ${like
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-white/10 border border-white/30 text-white hover:bg-white/20"
                                    }`}
                            >
                                {like ? (
                                    <AiFillHeart className="text-2xl" />
                                ) : (
                                    <AiOutlineHeart className="text-2xl" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
