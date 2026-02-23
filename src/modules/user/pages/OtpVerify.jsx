import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { verifyOtp, reset } from "../../../features/auth/authSlice";
import { ShieldCheck } from "lucide-react";

function OtpVerify() {
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess) {
      toast.success("OTP verified successfully!");
      navigate("/login");
      dispatch(reset());
    }
  }, [isSuccess, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.otp) { toast.error("Email and OTP are required"); return; }
    dispatch(verifyOtp(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="text-gray-500 text-sm mt-2">
              Enter the OTP sent to your email address to complete registration.
            </p>
          </div>

          {isError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {message || "Invalid OTP. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                OTP Code
              </label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition bg-white text-center text-lg tracking-[0.5em] font-bold"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition text-sm"
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verifying...</>
              ) : (
                <><ShieldCheck size={16} /> Verify OTP</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Didn't receive an OTP?{" "}
            <button className="text-indigo-600 font-semibold hover:text-indigo-700">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OtpVerify;