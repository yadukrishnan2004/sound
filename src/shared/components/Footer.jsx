import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight mb-3">
              Sound<span className="text-indigo-400">Core</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium headphones &amp; audio gear for those who demand the best.
              Hear every detail.
            </p>
            <div className="flex gap-4 mt-5">
              {[
                { Icon: FaFacebook, href: "#", hover: "hover:text-blue-400" },
                { Icon: FaInstagram, href: "#", hover: "hover:text-pink-400" },
                { Icon: FaTwitter, href: "#", hover: "hover:text-sky-400" },
                { Icon: FaYoutube, href: "#", hover: "hover:text-red-400" },
              ].map(({ Icon, href, hover }) => (
                <a
                  key={href + Icon}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-gray-400 ${hover} transition`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">
              Shop
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "All Products", to: "/allproducts" },
                { label: "New Arrivals", to: "/allproducts" },
                { label: "Best Sellers", to: "/allproducts" },
                { label: "On Sale", to: "/allproducts" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {["FAQ's", "Shipping Policy", "Return Policy", "Track Order"].map(
                (item) => (
                  <li key={item}>
                    <span className="hover:text-white transition cursor-default">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-300 mb-4">
              Account
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {[
                { label: "My Account", to: "/account" },
                { label: "My Orders", to: "/myorders" },
                { label: "Wishlist", to: "/wishlist" },
                { label: "Cart", to: "/cart" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} SoundCore. All rights reserved.</p>
          <p className="text-xs">Made with ❤️ for audio lovers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;