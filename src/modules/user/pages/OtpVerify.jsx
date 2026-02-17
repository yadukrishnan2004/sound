import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { verifyOtp, reset } from "../../../features/auth/authSlice";

function OtpVerify() {
    const [formData, setFormData] = useState({
        email: "",
        otp: "",
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess) {
            toast.success("OTP verified successfully");
            navigate("/login");
            dispatch(reset());
        }
    }, [isSuccess, navigate, dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.email || !formData.otp) {
            toast.error("Email and OTP are required");
            return;
        }

        dispatch(verifyOtp(formData));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl">

                <h2 className="text-2xl text-white font-bold text-center mb-6">
                    Verify OTP
                </h2>

                {isError && (
                    <p className="text-red-400 text-sm text-center mb-4">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="text-white/80 text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full mt-2 px-4 py-2 rounded-md bg-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="text-white/80 text-sm">OTP</label>
                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full mt-2 px-4 py-2 rounded-md bg-white/10 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-md font-semibold transition ${isLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white"
                            }`}
                    >
                        {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default OtpVerify;
