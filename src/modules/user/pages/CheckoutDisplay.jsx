import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../services/api";
import { clearCart } from "../../../features/cart/cartSlice";
import { getUserProfile } from "../../../features/auth/authSlice";
import { ENDPOINTS } from "../../../services/endpoints";

function CheckoutDisplay() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const buyNowProduct = location.state?.product;
    const buyNowQuantity = location.state?.quantity || 1;

    const currentCart = buyNowProduct
        ? [{ ...buyNowProduct, Quantity: buyNowQuantity }]
        : (cartItems.length > 0 ? cartItems : user?.cart || []);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("COD");

    // ✅ Address state aligned with backend struct
    const [newAddress, setNewAddress] = useState({
        name: "",
        phone: "",
        house_name: "",
        street: "",
        city: "",
        state: "",
        pin_code: "",
    });

    /* ======================
            CALCULATIONS
    ====================== */

    const subtotal = currentCart.reduce(
        (acc, item) =>
            acc +
            Number(item.Price || item.price) *
            (item.Quantity || item.quantity),
        0
    );

    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.1;
    const totalAmount = subtotal + shipping + tax;

    /* ======================
        FETCH ADDRESSES
    ====================== */

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await api.get(ENDPOINTS.ADDRESS.GET);
            const addressList = res?.data?.data || [];

            setAddresses(addressList);

            if (addressList.length > 0) {
                setSelectedAddress(addressList[0].id);
            }
        } catch (err) {
            console.error("Error fetching addresses:", err);
        }
    };

    /* ======================
        ADD ADDRESS
    ====================== */

    const handleAddAddress = async (e) => {
        e.preventDefault();

        try {
            await api.post(ENDPOINTS.ADDRESS.CREATE, newAddress);

            setNewAddress({
                name: "",
                phone: "",
                house_name: "",
                street: "",
                city: "",
                state: "",
                pin_code: "",
            });

            setShowAddressForm(false);
            await fetchAddresses();

            toast.success("Address added successfully");
        } catch (err) {
            console.error("Error adding address:", err);
            toast.error("Failed to add address");
        }
    };

    /* ======================
        PLACE ORDER
    ====================== */

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select or add a delivery address");
            return;
        }

        try {
            let res;
            if (buyNowProduct) {
                res = await api.post(ENDPOINTS.ORDERS.BUY, {
                    product_id: buyNowProduct.id,
                    quantity: 1, // Default quantity for now
                    address_id: selectedAddress,
                    payment_method: paymentMethod,
                });
            } else {
                res = await api.post("/orders", {
                    address_id: selectedAddress,
                    payment_method: paymentMethod,
                });
                dispatch(clearCart());
            }

            dispatch(getUserProfile());

            toast.success(
                `Order placed! Order ID: ${res.data?.data?.id || "N/A"
                }`
            );

            navigate("/myorders");
        } catch (error) {
            console.error("Error placing order:", error);
            const msg =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong!";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-10">
            <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">

                {/* ================= CART SUMMARY ================= */}
                <div className="md:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        🛒 Your Cart
                    </h2>

                    {currentCart.length === 0 ? (
                        <p className="text-gray-500">No items in cart</p>
                    ) : (
                        currentCart.map((item, index) => (
                            <div
                                key={`checkout-${item.CartID || item.id}-${index}`}
                                className="flex justify-between items-center border-b py-3"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {item.Name || item.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.Quantity || item.quantity}
                                    </p>
                                </div>

                                <p className="text-gray-700 font-semibold">
                                    ₹{(
                                        (item.Price || item.price) *
                                        (item.Quantity || item.quantity)
                                    ).toFixed(2)}
                                </p>
                            </div>
                        ))
                    )}

                    {/* TOTALS */}
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

                {/* ================= DELIVERY & PAYMENT ================= */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        🚚 Delivery Details
                    </h2>

                    {/* ADDRESS SELECT */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Select Address
                        </label>

                        {addresses.length === 0 ? (
                            <p className="text-gray-500 text-sm mb-3">
                                No saved addresses
                            </p>
                        ) : (
                            <select
                                value={selectedAddress || ""}
                                onChange={(e) =>
                                    setSelectedAddress(Number(e.target.value))
                                }
                                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            >
                                {addresses.map((addr) => (
                                    <option key={addr.id} value={addr.id}>
                                        {addr.house_name}, {addr.street},{" "}
                                        {addr.city}, {addr.state} -{" "}
                                        {addr.pin_code}
                                    </option>
                                ))}
                            </select>
                        )}

                        <button
                            onClick={() =>
                                setShowAddressForm(!showAddressForm)
                            }
                            className="mt-2 text-blue-600 text-sm hover:underline"
                        >
                            + Add New Address
                        </button>
                    </div>

                    {/* ================= ADDRESS FORM ================= */}
                    {showAddressForm && (
                        <form
                            onSubmit={handleAddAddress}
                            className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg"
                        >
                            {[
                                ["name", "Full Name"],
                                ["phone", "Phone"],
                                ["house_name", "House Name"],
                                ["street", "Street"],
                                ["city", "City"],
                                ["state", "State"],
                                ["pin_code", "Pin Code"],
                            ].map(([key, label]) => (
                                <input
                                    key={key}
                                    type="text"
                                    placeholder={label}
                                    value={newAddress[key]}
                                    onChange={(e) =>
                                        setNewAddress({
                                            ...newAddress,
                                            [key]: e.target.value,
                                        })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                            ))}

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            >
                                Save Address
                            </button>
                        </form>
                    )}

                    {/* PAYMENT METHOD */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                            Payment Method
                        </label>
                        <select
                            value={paymentMethod}
                            onChange={(e) =>
                                setPaymentMethod(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="ONLINE">Online Payment</option>
                        </select>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CheckoutDisplay;
