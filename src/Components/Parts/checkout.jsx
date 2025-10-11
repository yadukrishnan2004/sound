import React, { useContext, useState } from "react";
import { ApiContext } from "../context/ApiContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cartcontext";

function CheckoutPage({item}) {
  const { user } = useContext(ApiContext);
    const {clearcart}=useContext(CartContext)

  const navigate=useNavigate();
  window.scrollTo({ top: 0, behavior: "smooth" });


  const cartItems = item;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + shipping + tax;

  // 🧾 Form state
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };





  const handleCheckout = async (e) => {
  e.preventDefault();

  if (!formData.fullName || !formData.address || !formData.phone) {
    alert("Please fill in all fields");
    return;
  }

  try {
    const { data:User } = await axios.get(`http://localhost:5001/user/${user.id}`);

    // Prepare new order
    const newOrder = {
      formData,
      items: cartItems,
      total: totalAmount,
      date: new Date().toISOString(),
    };

    const updatedOrders = User.myorder ? [...User.myorder, newOrder] : [newOrder];

    await axios.patch(`http://localhost:5001/user/${user.id}`, {
      myorder: updatedOrders,
      cart:[],
    });

    alert(`✅ Order placed successfully!\n\nTotal: ₹${totalAmount.toFixed(2)}`);
    navigate('/order');
  

    
  } catch (error) {
    console.error("❌ Error saving order:", error);
    alert("Something went wrong while placing your order!");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* 🛒 Cart Summary */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🛒 Your Cart</h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="text-gray-700 font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {/* Totals Section */}
          <div className="mt-5 space-y-2 text-gray-700 border-t pt-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-blue-600 border-t pt-3">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 🚚 Shipping Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🚚 Shipping Details
          </h2>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
