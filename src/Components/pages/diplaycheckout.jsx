import React, { useContext } from 'react'
import CheckoutPage from '../Parts/checkout'
import { AuthContext } from '../../AuthContext/authcontext';


function Diplaycheckout() {
  const {user}=useContext(AuthContext);

  const cartItems = user.cart || [];
  return (
    <div>

    <CheckoutPage item={cartItems}/>
      
    </div>
  )
}

export default Diplaycheckout
