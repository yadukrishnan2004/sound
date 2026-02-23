import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, LogIn, Menu, X, Search } from "lucide-react";
import { useSelector } from "react-redux";

function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);
  const { wishlistItems } = useSelector((s) => s.wishlist);
  const navigate = useNavigate();

  const wishlist = wishlistItems.length > 0 ? wishlistItems : user?.wishlist || [];
  const cart = cartItems.length > 0 ? cartItems : user?.cart || [];
  const cartCount = cart.reduce((t, i) => t + (i.Quantity || 1), 0);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/allproducts?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal("");
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/allproducts", label: "Shop" },
    { to: "/allproducts", label: "Categories" },
    { to: "/allproducts", label: "Deals" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b border-gray-100"
            : "bg-white/95 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Sound<span className="text-indigo-600">Core</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 rounded-full text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              {user ? (
                <Link
                  to="/account"
                  className="hidden sm:flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase() || <User size={14} />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-600 hover:text-indigo-600 transition"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Search Bar (Expanded) */}
          {searchOpen && (
            <div className="pb-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search headphones, earbuds..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm text-gray-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                >
                  Account
                </Link>
                <Link
                  to="/myorders"
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                >
                  My Orders
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}

export default Navbar;