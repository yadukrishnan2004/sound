import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/baseUrl";

function OtpVerify() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.otp) {
      setError("Email and OTP are required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 YOUR BACKEND API
      const res = await axios.post(
        `${BASE_URL}/users/verify`,
        formData
      );

      alert(res.data.message || "OTP verified successfully");

      // redirect after success (change if needed)
      navigate("/login");

    } catch (err) {
      console.error("OTP Verify Error:", err);
      setError(
        err?.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl">

        <h2 className="text-2xl text-white font-bold text-center mb-6">
          Verify OTP
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">
            {error}
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
            disabled={loading}
            className={`w-full py-2 rounded-md font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default OtpVerify;
