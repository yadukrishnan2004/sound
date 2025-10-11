import React, { useEffect, useState } from "react";

function Navbarsub() {
  const [scroll, setScroll] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 200) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      // cleanup on unmount
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  return (
    <div
          className={`flex justify-center items-center w-100 z-50 transition-all duration-300 ${
        scroll ? "bg-gray-900 shadow-lg py-2" : "bg-transparent py-4"
      } text-white`}

      style={{
        clipPath: "polygon(0 0, 100% 0, 85% 100%, 15% 100%)",
      }}
    >
      <h1 className="text-2xl font-bold">Sound<span className="text-green-400">Hub </span></h1>
    </div>
  );
}

export default Navbarsub;
