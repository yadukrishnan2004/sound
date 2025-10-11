import React, { useContext } from 'react'
import { ApiContext } from '../context/ApiContext'
import ProductDisplay from '../Parts/ProductDisplay';
import Navbar from '../Parts/Navbar';
import Footer from '../Parts/footer';
import Navbarsub from '../Parts/navbarsub';

function Deals() {
    const {jbl}=useContext(ApiContext);
    const deal=jbl.filter((p)=> p.isdeal);
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white'>
      <div className="sticky top-0 z-50">
          <Navbar color={"white"} />
        </div>
        <div className="hidden md:flex sticky top-[64px] z-50 items-center justify-center text-white font-semibold">
          <Navbarsub />
        </div>
      <div className='h-25'>

      </div>

        <ProductDisplay data={deal}/>


        <Footer/>

      
    </div>
  )
}

export default Deals
