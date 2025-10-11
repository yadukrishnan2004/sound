import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import myVideo from "../../assets/bg-video.mp4";
import { ApiContext } from "../context/ApiContext";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import Navbarsub from "../Parts/navbarsub";

function Home1() {
  const { jbl } = useContext(ApiContext);
  const navigate = useNavigate();
  const [muted, setMuted] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [Search, setSearch] = useState("");
  const [filterProduct, setfilterProduct] = useState(jbl);
  const [loading, setLoading] = useState(false);

  function allproduct() {
    navigate("/allproducts");
  }

  const desc = (
    <h2 className="text-base sm:text-lg md:text-2xl text-white/90 font-medium tracking-wide">
      We have the largest collection of products
    </h2>
  );

  function Handlesearch(e) {
    const searchterm = e.target.value;
    setSearch(searchterm);
    setLoading(true);

    setTimeout(() => {
      if (searchterm.trim() === "") {
        setfilterProduct([]);
        setLoading(false);
        return;
      }
      const filtered = jbl.filter((product) =>
        product.name.toLowerCase().includes(searchterm.toLowerCase())
      );
      setfilterProduct(filtered);
      setLoading(false);
    }, 1000);
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <Navbar color={"white"} />
        <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>
      <div className="h-16"></div>
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
        <div className="h-20">

        </div>

        {/* Product Banner + Search */}

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
                  value={Search}
                  onChange={Handlesearch}
                  className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md"
                />
              </form>

              {/* Description under search bar */}
              <div className="text-center">{desc}</div>

              {/* Filtered Results */}
              <div className="w-full max-w-7xl mx-auto px-4">
                <ul className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 text-white font-medium justify-center">
                  {loading ? (
                    <p className="text-white text-lg font-medium text-center col-span-full">
                      Searching...
                    </p>
                  ) : Search.trim().length === 0 ? (
                    <p></p>
                  ) : filterProduct.length === 0 ? (
                    <p className="text-white text-lg font-medium text-center col-span-full">
                      No products found for "
                      <span className="italic">{Search}</span>"
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
                    onClick={()=>{navigate(`/catogery/${category}`)}}
                  >
                    {category}
                  </button>
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

export default Home1;
