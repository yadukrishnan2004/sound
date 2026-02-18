import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Bell, User, LogIn } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../features/auth/authSlice"; // If needed

function Navbar({ color }) {
    const { user } = useSelector((state) => state.auth);


    // Assuming cart and wishlist are also in redux now, or still usage user object if that's how it's structured
    // For now, let's assume we might need to fetch them or they are part of user.
    // The original code: const wishlist = user?.wishlist || [];

    // If we move to separate slices for cart/wishlist, we should use those selectors.
    // But if the backend returns them with user profile, we might still reference user.
    // However, the prompt asked for separate slices.
    // Let's assume for now we use the slices.
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    // Fallback to user object if slices aren't populated yet (transition phase)
    const wishlist = wishlistItems.length > 0 ? wishlistItems : (user?.wishlist || []);
    const cart = cartItems.length > 0 ? cartItems : (user?.cart || []);

    const [menuOpen, setMenuOpen] = useState(false);
    const [scroll, setScroll] = useState(false);

    // Calculate total cart quantity
    const cartCount = cart.reduce((total, item) => total + (item.Quantity || 1), 0); // Default to 1 if Quantity missing

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScroll(true);
            } else {
                setScroll(false);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300  ${scroll ? "bg-gray-900 shadow-lg py-2 text-white" : "bg-transparent py-4"
                } text-${color}`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">Sound<span className="text-green-400">Core</span></h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex space-x-6">
                        <Link to="/home" className="hover:text-indigo-400">
                            Home
                        </Link>
                        <Link to="/allproducts" className="hover:text-indigo-400">
                            Shop
                        </Link>
                        <Link to="/categories" className="hover:text-indigo-400">
                            Categories
                        </Link>
                        <Link to="/deals" className="hover:text-indigo-400">
                            Deals
                        </Link>
                        <Link to="/contact" className="hover:text-indigo-400">
                            About
                        </Link>
                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center space-x-4">
                        <Link to="/wishlist" className="relative hover:text-indigo-400">
                            <Heart className="w-6 h-6" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 rounded-full">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="relative hover:text-indigo-400">
                            <ShoppingCart className="w-6 h-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button className="hover:text-indigo-400">
                            <Bell className="w-6 h-6" />
                        </button>

                        <div className="flex items-center space-x-2">
                            {user ? (
                                <Link
                                    to="/account"
                                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-all"
                                >
                                    <User className="w-6 h-6 text-indigo-400" />
                                    <span className="font-medium">
                                        {user.name ? user.name.split(" ")[0] : user.email?.split("@")[0]}
                                    </span>
                                </Link>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition-all"
                                >
                                    <LogIn className="w-5 h-5" />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>


                        {/* Mobile Menu Toggle */}
                        <button
                            className="sm:hidden p-2 rounded-md hover:bg-gray-800"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                {menuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="sm:hidden px-4 pb-3 space-y-2 bg-gray-800">
                    <Link to="/" className="block hover:text-indigo-400">
                        Home
                    </Link>
                    <Link to="/shop" className="block hover:text-indigo-400">
                        Shop
                    </Link>
                    <Link to="/categories" className="block hover:text-indigo-400">
                        Categories
                    </Link>
                    <Link to="/deals" className="block hover:text-indigo-400">
                        Deals
                    </Link>
                    <Link to="/about" className="block hover:text-indigo-400">
                        About
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
