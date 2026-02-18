import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../../features/cart/cartSlice";
import { removeFromWishlist,clearWishlist } from "../../../features/wishlist/wishlistSlice";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
import NavbarSub from "../../../shared/components/NavbarSub";
import { useNavigate } from "react-router";


function WishlistDisplay() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const wishlist =
        wishlistItems.length > 0 ? wishlistItems : user?.wishlist || [];

    const handleRemove = (product) => {
        dispatch(removeFromWishlist(product));
        toast.success("Removed from wishlist");
    };

    const handleAddCart = (product) => {
        dispatch(addToCart(product));
        toast.success("Added to cart");
    };

const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your entire wishlist?")) return;

    dispatch(clearWishlist())
        .unwrap()
        .then(() => toast.success("Wishlist cleared"))
        .catch(() => toast.error("Failed to clear wishlist"));
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
            <Navbar />

            <div className="hidden md:flex sticky top-[64px] z-50 justify-center font-semibold">
                <NavbarSub />
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-10 mt-24">
                    <h2 className="text-3xl font-bold text-purple-400">
                        My Wishlist ❤️
                    </h2>

                    {wishlist.length > 0 && (
                        <button
                            onClick={handleClear}
                            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg font-semibold"
                        >
                            🧹 Clear Wishlist
                        </button>
                    )}
                </div>

                {wishlist.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">
                        No items are added yet
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {wishlist.map((product, index) => {
                            const productId = product?.product_id || product?.id;
                            const productImages =
                                product?.Images || product?.images || [];

                            return (
                                <div
                                    key={`wish-${productId || index}-${index}`}
                                    onClick={() => {
                                        if (!productId) return;
                                        navigate(`/Product/${productId}`);
                                    }}
                                    className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col md:flex-row hover:scale-[1.02] transition cursor-pointer"
                                >
                                    {/* IMAGE */}
                                    <div className="flex justify-center items-center bg-gray-100 p-4 md:w-1/3">
                                        <img
                                            src={productImages[0]}
                                            alt={product?.name}
                                            className="w-36 h-36 object-contain"
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="p-5 flex flex-col gap-2 flex-1 text-gray-800">
                                        <h3 className="text-xl font-semibold">
                                            {product?.name}
                                        </h3>

                                        <p className="text-gray-600">
                                            ₹{Number(product?.price || 0).toLocaleString("en-IN")}
                                        </p>

                                        <p
                                            className={`text-sm ${
                                                product?.stock > 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {product?.stock > 0
                                                ? `In Stock (${product?.stock})`
                                                : "Out of Stock"}
                                        </p>

                                        <p className="text-sm text-gray-700">
                                            {product?.description || product?.desc}
                                        </p>

                                        {/* BUTTONS */}
                                        <div className="flex gap-3 mt-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // ✅ prevent navigation
                                                    handleAddCart({
                                                        id: productId,
                                                        name: product.name,
                                                        price: product.price,
                                                        images: productImages,
                                                    });
                                                }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                                            >
                                                Add to Cart
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); // ✅ prevent navigation
                                                    handleRemove(product);
                                                }}
                                                className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default WishlistDisplay;
