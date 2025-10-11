import React, { useState } from "react";
import myVideo from "../../assets/bg-video.mp4";
import Navbar from "../Parts/Navbar";
import Footer from "../Parts/footer";
import { useNavigate } from "react-router-dom";
import Navbarsub from "../Parts/navbarsub";

const categoryList = [
  "Wireless",
  "Wired",
  "Earbuds",
  "Neckband",
  "Studio",
  "Gaming",
  "Luxury",
  "Fitness",
];

function Categories() {
  const navigate=useNavigate();
  const [muted, setMuted] = useState(true);

  return (
    <div className="relative w-full min-h-screen overflow-hidden items-center">
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

      {/* Mute / Unmute Button with transparent glass effect */}
      <button
        onClick={() => setMuted(!muted)}
        className="fixed bottom-6 right-6 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-lg hover:bg-white/20 transition z-20 border border-white/30"
      >
        {muted ? "🔇 Mute" : "🔊 Unmute"}

      </button>
        <div className="sticky top-0 z-50">
          <Navbar color={"white"} />
        </div>
        <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>
        <div className=""></div>

      <div className="min-h-screen justify-center flex items-center">
        <div className=" p-6 flex-nowrap">
          <h1 className="text-4xl font-bold text-center mb-12 text-white drop-shadow-lg">
            Explore Categories
          </h1>

          <div className="">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {categoryList.map((category, index) => (
              <div
              onClick={()=>{navigate(`/catogery/${category}`)}}
                key={index}
                className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-10 text-center cursor-pointer hover:scale-105 border border-white/30"
              >
                <span className="text-xl font-semibold text-white drop-shadow-sm">
                  {category}
                </span>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Categories;
