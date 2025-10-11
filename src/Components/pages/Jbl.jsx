import { useContext } from "react";
import Navbar from "../Parts/Navbar";
import ProductDisplay from "../Parts/ProductDisplay";
import {ApiContext} from "../context/ApiContext";
import Navbarsub from "../Parts/navbarsub";
function Jbl() {
  const {jbl}=useContext(ApiContext);;
 
  return (
    <div>
      <Navbar />
              <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>
      <ProductDisplay data={jbl} />

    </div>
  );
}

export default Jbl;
