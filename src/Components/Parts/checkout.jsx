import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext/authcontext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cartcontext";
import BASE_URL from "../../config/baseUrl";
import { useContext } from "react";

function CheckoutPage({ item }) {
  const { user, fetchUserProfile } = useAuth();
  const { clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Address form state
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip: "",
  });

  const cartItems = user?.cart || item || [];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.Price || item.price) * (item.Quantity || item.quantity),
    0
  );
  const shipping = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + shipping + tax;

  // Fetch saved addresses on mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/addresses`, {
        withCredentials: true,
      });
      const addressList = res?.data?.data || [];
      setAddresses(addressList);
      if (addressList.length > 0) {
        setSelectedAddress(addressList[0].id);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/addresses`, newAddress, {
        withCredentials: true,
      });

      setNewAddress({ street: "", city: "", zip: "" });
      setShowAddressForm(false);
      await fetchAddresses();
      alert("✅ Address added successfully!");
    } catch (err) {
      console.error("Error adding address:", err);
      alert("❌ Failed to add address");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      alert("Please select or add a delivery address");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/orders`,
        {
          address_id: selectedAddress,
          payment_method: paymentMethod,
        },
        { withCredentials: true }
      );

      await fetchUserProfile(); // Refresh user data
      alert(`✅ Order placed successfully!\\n\\nOrder ID: ${res.data?.data?.id || "N/A"}\\nTotal: ₹${totalAmount.toFixed(2)}`);
      navigate("/myorders");
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert(error?.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {/* 🛒 Cart Summary */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🛒 Your Cart</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`checkout-${item.CartID || item.id}-${index}`}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.Name || item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.Quantity || item.quantity}
                  </p>
                </div>
                <p className="text-gray-700 font-semibold">
                  ₹{((item.Price || item.price) * (item.Quantity || item.quantity)).toFixed(2)}
                </p>
              </div>
            ))
          )}

          {/* Totals */}
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

        {/* 🚚 Shipping & Payment */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🚚 Delivery Details
          </h2>

          {/* Address Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Address
            </label>

            {addresses.length === 0 ? (
              <p className="text-gray-500 text-sm mb-3">No saved addresses</p>
            ) : (
              <select
                value={selectedAddress || ""}
                onChange={(e) => setSelectedAddress(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.street}, {addr.city} - {addr.zip}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="mt-2 text-blue-600 text-sm hover:underline"
            >
              + Add New Address
            </button>
          </div>

          {/* Add Address Form */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <input
                type="text"
                placeholder="Street Address"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={newAddress.city}
                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={newAddress.zip}
                onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Save Address
              </button>
            </form>
          )}

          {/* Payment Method */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
