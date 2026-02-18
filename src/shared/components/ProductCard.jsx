import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../features/wishlist/wishlistSlice";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function ProductCard({ data }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const { user } = useSelector((state) => state.auth);

    const { wishlistItems } = useSelector((state) => state.wishlist);


    const currentWishlist = wishlistItems.length > 0 ? wishlistItems : (user?.wishlist || []);

    const like = currentWishlist.some(
        (item) => {
            const wishlistProductId = item?.product_id || item?.ProductID || item?.id;
            const currentProductId = data?.id || data?.ID;
            return String(wishlistProductId) === String(currentProductId);
        }
    );    

    async function toggle(e) {
        e.stopPropagation();
        if (!user) {
            toast.error("Please login first");
            return;
        }
        if (like) {
            dispatch(removeFromWishlist(data));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addToWishlist(data.id));
            toast.success("Added to wishlist");
        }
    }

    function handleAddCart(product) {
        if (!user) {
            toast.error("Please login first");
            return;
        }
        
        dispatch(addToCart(product));
        toast.success("Added to cart");
    }

    function gotoDetail() {
        navigate(`/Product/${data.id}`);
    }

    return (
        <div
            onClick={gotoDetail}
            className="cursor-pointer bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg 
                 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 
                 rounded-2xl flex flex-col p-5 w-full max-w-sm"
        >
            {/* IMAGE */}
            <div className="w-full h-56 flex items-center justify-center bg-white/20 rounded-xl mb-4 overflow-hidden">
                <img
                    src={data?.images?.[0] || "/noimage.png"}
                    alt={data?.name}
                    className="max-h-48 object-contain"
                />
            </div>

            {/* BRAND + CATEGORY */}
            <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-indigo-300 font-semibold">
                    {data.brand}
                </span>

                <span className="text-xs text-white/60 uppercase">
                    {data.mainCategory || data.category}
                </span>
            </div>

            {/* NAME */}
            <h3 className="text-lg font-bold text-white line-clamp-2 mb-1">
                {data.name}
            </h3>

            {/* DESCRIPTION */}
            <p className="text-white/70 text-sm line-clamp-2 mb-3">
                {data.description}
            </p>

            {/* PRICE */}
            <span className="text-2xl font-extrabold text-amber-400 mb-4">
                ₹{Number(data.price)}
            </span>

            {/* ACTIONS */}
            <div
                className="flex gap-3 mt-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="flex-1 bg-amber-500 text-black py-2 rounded-full font-semibold 
                     hover:bg-amber-600 transition"
                    onClick={() => handleAddCart(data)}
                >
                    Add to Cart
                </button>

                <button
                    className={`w-12 h-12 flex items-center justify-center border rounded-full transition 
            ${like ? "bg-red-500 border-red-500" : "border-white/30 hover:bg-white/10"}`}
                    aria-label="wishlist"
                    onClick={toggle}
                >
                    {like ? (
                        <AiFillHeart className="text-white text-xl" />
                    ) : (
                        <AiOutlineHeart className="text-white text-xl" />
                    )}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
