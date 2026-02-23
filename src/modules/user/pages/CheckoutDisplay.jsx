import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { clearCart } from "../../../features/cart/cartSlice";
import { getUserProfile } from "../../../features/auth/authSlice";
import { ENDPOINTS } from "../../../services/endpoints";
import Navbar from "../../../shared/components/Navbar";
import { loadRazorpay } from "../../../utils/loadRazorpay";
import { MapPin, CreditCard, Plus, Check } from "lucide-react";

function CheckoutDisplay() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { cartItems } = useSelector((s) => s.cart);

  const buyNowProduct = location.state?.product;
  const buyNowQuantity = location.state?.quantity || 1;
  const currentCart = buyNowProduct
    ? [{ ...buyNowProduct, Quantity: buyNowQuantity }]
    : cartItems.length > 0 ? cartItems : user?.cart || [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "", phone: "", house_name: "", street: "", city: "", state: "", pin_code: "",
  });

  const subtotal = currentCart.reduce((acc, i) => acc + Number(i.Price || i.price) * (i.Quantity || i.quantity), 0);
  const shipping = subtotal > 999 ? 0 : 50;
  const tax = subtotal * 0.1;
  const totalAmount = subtotal + shipping + tax;

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get(ENDPOINTS.ADDRESS.GET);
      const list = res?.data?.data || [];
      setAddresses(list);
      if (list.length > 0) setSelectedAddress(list[0].id);
    } catch { }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post(ENDPOINTS.ADDRESS.CREATE, newAddress);
      setNewAddress({ name: "", phone: "", house_name: "", street: "", city: "", state: "", pin_code: "" });
      setShowAddressForm(false);
      await fetchAddresses();
      toast.success("Address added!");
    } catch { toast.error("Failed to add address"); }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error("Please select a delivery address"); return; }
    setPlacing(true);

    try {
      let res;
      if (buyNowProduct) {
        res = await api.post(ENDPOINTS.ORDERS.BUY, {
          product_id: buyNowProduct.id, quantity: buyNowQuantity, address_id: selectedAddress, payment_method: paymentMethod,
        });
      } else {
        res = await api.post(ENDPOINTS.ORDERS.CREATE, { address_id: selectedAddress, payment_method: paymentMethod });
      }

      const orderData = res.data?.data || {};

      if (paymentMethod === "Razorpay") {
        const razorpayOrderId = orderData.razorpay_order_id;
        if (!razorpayOrderId) {
          toast.error("Failed to generate secure Razorpay order ID from server.");
          setPlacing(false);
          return;
        }

        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          toast.error("Razorpay SDK failed to load. Are you online?");
          setPlacing(false);
          return;
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_YOUR_TEST_KEY_HERE",
          amount: parseInt(totalAmount * 100), // amount in paise
          currency: "INR",
          name: "Soney Audio",
          description: "Order Checkout",
          order_id: razorpayOrderId, // Validated Razorpay order ID from backend
          handler: async function (response) {
            try {
              // Verify the payment on the server
              await api.post("/orders/verify-payment", {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              });

              if (!buyNowProduct) dispatch(clearCart());
              toast.success("Payment verified and Order placed successfully! 🎉");
              dispatch(getUserProfile());
              navigate("/myorders");
            } catch (err) {
              toast.error(err.response?.data?.message || "Payment verification failed on server.");
              navigate("/myorders"); // navigate anyway because order was created as pending
            } finally {
              setPlacing(false);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
          },
          theme: {
            color: "#4f46e5",
          },
          modal: {
            ondismiss: function () {
              setPlacing(false);
              toast.error("Payment was cancelled or interrupted.");
              if (!buyNowProduct) dispatch(clearCart());
              navigate("/myorders"); // The order is still in DB as pending payment
            }
          }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } else {
        // COD Flow
        if (!buyNowProduct) dispatch(clearCart());
        toast.success("Order placed successfully! 🎉");
        dispatch(getUserProfile());
        navigate("/myorders");
        setPlacing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Address + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" /> Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-sm text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  <Plus size={14} /> New Address
                </button>
              </div>

              <div className="p-4 space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${selectedAddress === addr.id ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-0.5 accent-indigo-600"
                    />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-gray-900">{addr.name} · {addr.phone}</p>
                      <p className="text-gray-500 mt-0.5">
                        {addr.house_name}, {addr.street}, {addr.city}, {addr.state} - {addr.pin_code}
                      </p>
                    </div>
                    {selectedAddress === addr.id && (
                      <Check size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    )}
                  </label>
                ))}

                {addresses.length === 0 && !showAddressForm && (
                  <p className="text-center text-gray-400 text-sm py-4">
                    No addresses saved. Add one below.
                  </p>
                )}
              </div>

              {/* Add Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name", label: "Full Name", placeholder: "Recipient name" },
                    { key: "phone", label: "Phone", placeholder: "10-digit number" },
                    { key: "house_name", label: "House / Building", placeholder: "Flat, Building name" },
                    { key: "street", label: "Street / Area", placeholder: "Street, Colony" },
                    { key: "city", label: "City", placeholder: "City" },
                    { key: "state", label: "State", placeholder: "State" },
                    { key: "pin_code", label: "PIN Code", placeholder: "6-digit PIN" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={newAddress[key]}
                        onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition">
                      Save Address
                    </button>
                    <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard size={16} className="text-indigo-500" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { val: "COD", label: "Cash on Delivery", emoji: "💵" },
                  { val: "Razorpay", label: "Razorpay", emoji: "💳" },
                ].map((pm) => (
                  <label
                    key={pm.val}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${paymentMethod === pm.val ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-gray-200"
                      }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.val}
                      checked={paymentMethod === pm.val}
                      onChange={() => setPaymentMethod(pm.val)}
                      className="accent-indigo-600"
                    />
                    <span className="text-xl">{pm.emoji}</span>
                    <span className="font-medium text-gray-900 text-sm">{pm.label}</span>
                    {paymentMethod === pm.val && <Check size={14} className="text-indigo-600 ml-auto" />}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4 max-h-52 overflow-y-auto">
                {currentCart.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <img
                      src={item?.Image?.[0] || item?.images?.[0] || "/noimage.png"}
                      alt={item.Name || item.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.Name || item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.Quantity || item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0">
                      ₹{(Number(item.Price || item.price) * (item.Quantity || item.quantity)).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={`font-medium ${shipping === 0 ? "text-emerald-600" : ""}`}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">₹{tax.toFixed(0)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition"
              >
                {placing ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</>
                ) : (
                  "Place Order →"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutDisplay;