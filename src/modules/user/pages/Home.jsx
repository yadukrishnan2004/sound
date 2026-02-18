import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../features/products/productSlice";
import myVideo from "../../../assets/bg-video.mp4";
import Navbar from "../../../shared/components/Navbar";
import Footer from "../../../shared/components/Footer";
// import NavbarSub from "../../../shared/components/NavbarSub";

function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { products, isLoading } = useSelector((state) => state.products);

    const [muted, setMuted] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);
    const [search, setSearch] = useState("");
    const [filterProduct, setFilterProduct] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (products) {
            setFilterProduct(products);
        }
    }, [products]);

    function allproduct() {
        navigate("/allproducts");
    }

    const desc = (
        <h2 className="text-base sm:text-lg md:text-2xl text-white/90 font-medium tracking-wide">
            We have the largest collection of products
        </h2>
    );

    function handleSearch(e) {
        const searchterm = e.target.value;
        setSearch(searchterm);
        setSearchLoading(true);

        setTimeout(() => {
            if (searchterm.trim() === "") {
                setFilterProduct(products); // Reset to all products or empty if desired behavior was clear. Original code set to empty [] if blank? 
                // Original code: if (searchterm.trim() === "") { setfilterProduct([]); ... }
                // Wait, normally if search is empty we show all? Or maybe the UI is designed to only show results when searching?
                // Let's stick to original behavior but improve it. If typical e-commerce, empty search = all products or no filtering.
                // The original code `setfilterProduct([])` suggests it clears the list.
                // But `useState(jbl)` initialized with all products.
                // Let's assume empty search means show all.
                setFilterProduct(products);
                setSearchLoading(false);
                return;
            }
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchterm.toLowerCase())
            );
            setFilterProduct(filtered);
            setSearchLoading(false);
        }, 500); // Reduced delay
    }

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            {/* Navbar is rendered by Homepage for the layout, but Home component itself also had Navbar in one version.
          Since Homepage uses Home, we should probably check if we are duplicating Navbar.
          Homepage.jsx renders Navbar, NavbarSub, then Home.
          Home.jsx (Step 105) renders Video, Mute Button, Scrollable Content (Welcome, Banner, Search, List, Footer).
          Home.jsx (Step 101) renders Navbar, NavbarSub, Video...
          
          I will make THIS Home component the one from Step 105 (the content), and let Homepage or Route handle the Navbar if needed.
          However, `appRouter` has `/home` -> `Home` component.
          And `/` -> `Homepage` -> `Navbar` + `Home`.
          
          So this `Home` should NOT have Navbar if used inside Homepage.
          But if accessed via `/home`, it might need it.
          
          Let's include Navbar only if it's the standalone /home route?
          Or better, simpler: remove Navbar from here and ensure layouts handle it.
          For now, I'll follow `Homepage` structure which wraps this. 
          But wait, `Home` (Step 105) IMPORTED `Footer` but didn't import `Navbar`.
          `Home1` (Step 101) IMPORTED `Navbar`.
          
          I'll stick to the Step 105 version which seems to be the "Inner Home".
          Use `HomePage` for the composition.
      */}

              <div className="hidden md:flex sticky top-[64px] z-50 justify-center font-semibold">
            <Navbar />
        </div>

            {/* Background Video */}
            <video
                autoPlay
                loop
                muted={muted}
                playsInline
                className="fixed top-0 left-0 w-screen h-screen object-cover -z-10"
            >
                <source src={myVideo} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Mute / Unmute Button */}
            <button
                onClick={() => setMuted(!muted)}
                className="fixed bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full shadow-md hover:bg-black/80 transition z-20"
            >
                {muted ? "🔇 Mute" : "🔊 Unmute"}
            </button>

            {/* Scrollable Content */}
            <div className="relative z-10 w-full min-h-screen overflow-y-auto">
                {/* Welcome Screen */}
                {showWelcome && (
                    <div className="flex items-center justify-center py-20">
                        <div className="bg-white/20 border border-white rounded-xl p-8 backdrop-blur-md text-center shadow-lg max-w-lg mx-auto">
                            <h1 className="text-4xl font-bold text-white mb-4">
                                Welcome to Soney
                            </h1>
                            <p className="text-lg text-white mb-6 italic">
                                "Music is the universal language of mankind." <br />
                                <span className="text-base font-medium">
                                    — Henry Wadsworth Longfellow
                                </span>
                            </p>
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="mt-4 px-6 py-2 bg-white/30 border border-white text-white rounded-lg font-semibold transition hover:bg-white/60 hover:text-blue-700"
                            >
                                Find More
                            </button>
                        </div>
                    </div>
                )}

                {/* Product Banner + Search */}
                {!showWelcome && (
                    <div className="py-20 px-4">
                        <div className="bg-white/30 border border-white rounded-xl p-8 backdrop-blur-md text-center shadow-lg w-full max-w-7xl mx-auto">
                            {/* Banner */}
                            <div className="w-full text-center py-16 px-6 rounded-2xl shadow-lg bg-gradient-to-r from-black/70 via-gray-800/60 to-black/70 backdrop-blur-sm">
                                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-5xl font-extrabold text-white drop-shadow-lg leading-snug max-w-4xl mx-auto">
                                    Search Your One from Thousands of Products
                                </h1>
                            </div>

                            {/* Search Section */}
                            <div className="mt-6 flex flex-col items-center gap-4">
                                <form className="w-full flex justify-center">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={search}
                                        onChange={handleSearch}
                                        className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md"
                                    />
                                </form>

                                {/* Description under search bar */}
                                <div className="text-center">{desc}</div>

                                {/* Filtered Results */}
                                <div className="w-full max-w-7xl mx-auto px-4">
                                    <ul className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 text-white font-medium justify-center">
                                        {searchLoading || isLoading ? (
                                            <p className="text-white text-lg font-medium text-center col-span-full">
                                                Searching...
                                            </p>
                                        ) : search.trim().length === 0 ? (
                                            // Original code showed nothing if empty? Or all?
                                            // " : Search.trim().length === 0 ? ( <p></p> )"
                                            // So it showed nothing. I will keep it consistent?
                                            // But earlier I said setFilterProduct(products)...
                                            // Let's rely on filterProduct state.
                                            filterProduct.map((product, i) => (
                                                <li
                                                    key={i}
                                                    className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-white/20"
                                                >
                                                    <Link
                                                        to={`/Product/${product.id}`}
                                                        className="block text-white text-lg font-semibold"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                </li>
                                            ))
                                        ) : filterProduct.length === 0 ? (
                                            <p className="text-white text-lg font-medium text-center col-span-full">
                                                No products found for "
                                                <span className="italic">{search}</span>"
                                            </p>
                                        ) : (
                                            filterProduct.map((product, i) => (
                                                <li
                                                    key={i}
                                                    className="bg-white/10 backdrop-blur-lg p-4 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:bg-white/20"
                                                >
                                                    <Link
                                                        to={`/Product/${product.id}`}
                                                        className="block text-white text-lg font-semibold"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center h-30 items-center ">
                            <button
                                className="text-white border border-white p-5  hover:bg-white hover:text-black"
                                onClick={() => allproduct()}
                            >
                                All Products
                            </button>
                        </div>

                        {/* Category Scroll Section */}
                        <div className="w-full mt-10 px-6">
                            <div className="bg-amber-400/30 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-6xl mx-auto border border-amber-300/40">
                                <h2 className="text-2xl font-bold text-white mb-4 drop-shadow">
                                    Browse by Category
                                </h2>
                                <div className="overflow-x-auto flex gap-4 pb-2">
                                    {[
                                        "Wireless",
                                        "Wired",
                                        "Earbuds",
                                        "Neckband",
                                        "Studio",
                                        "Gaming",
                                        "Luxury",
                                        "Fitness",
                                    ].map((category) => (
                                        <button
                                            key={category}
                                            className="px-6 py-3 bg-white/80 text-black rounded-lg font-semibold whitespace-nowrap hover:bg-white transition duration-200 shadow-md"
                                            onClick={() => {
                                                navigate(`/catogery/${category}`);
                                            }}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Home;
