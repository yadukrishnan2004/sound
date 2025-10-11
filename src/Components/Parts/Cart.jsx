import React, { useContext } from 'react'

import Navbar from './Navbar';
import Cartdisply from '../pages/Cartdisply';

function Cart() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <div>
        <Navbar/>
        <Cartdisply />
    </div>
  )
}

export default Cart
