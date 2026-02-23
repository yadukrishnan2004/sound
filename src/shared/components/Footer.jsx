import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
    return (
        // Fixed: brand name updated from "VESTRA" to "SoundCore" to match the app
        <footer className="mt-20 bottom-0 left-0 w-full bg-black text-white py-10">
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand Section */}
                <div>
                    <h2 className="text-2xl font-bold">
                        Sound<span className="text-green-400">Core</span>
                    </h2>
                    {/* Fixed: description now matches actual product category */}
                    <p className="mt-3 text-gray-400 text-sm">
                        Premium headphones and audio gear for true music lovers.
                        Experience sound like never before.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/allproducts" className="hover:text-white">Shop</Link></li>
                        <li><Link to="/account" className="hover:text-white">My Account</Link></li>
                        <li><Link to="/myorders" className="hover:text-white">My Orders</Link></li>
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Customer Care</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><span className="hover:text-white cursor-default">FAQ's</span></li>
                        <li><span className="hover:text-white cursor-default">Shipping Policy</span></li>
                        <li><span className="hover:text-white cursor-default">Return Policy</span></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                    <div className="flex space-x-4">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-500">
                            <FaFacebook size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-sky-400">
                            <FaTwitter size={24} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-4">
                © {new Date().getFullYear()} SoundCore. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;