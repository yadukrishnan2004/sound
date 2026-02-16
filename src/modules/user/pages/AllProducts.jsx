import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../features/products/productSlice";
import Navbar from "../../../shared/components/Navbar";
import NavbarSub from "../../../shared/components/NavbarSub";
import ProductDisplay from "../../../shared/components/ProductDisplay";
import Footer from "../../../shared/components/Footer";

function AllProducts() {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const displayProducts = products || [];

    return (
        <div className="min-h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white overflow-x-hidden">
            {/* Sticky Navbar */}
            <div className="sticky top-0 z-50 shadow-md">
                <Navbar color={"white"} />
            </div>
            <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
                <NavbarSub />
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
                <ProductDisplay data={displayProducts} />
            </main>

            <Footer />
        </div>
    );
}

export default AllProducts;
