import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../../features/auth/authSlice";
import { Eye, EyeOff, UserPlus } from "lucide-react";

function Registration() {
  const [formdata, setFormdata] = useState({ name: "", email: "", password: "" });
  const [validationError, setValidationError] = useState({});
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess) { dispatch(reset()); navigate("/verify-otp"); }
    if (isError) { console.log("Registration failed"); }
  }, [isSuccess, isError, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    if (!formdata.name.trim()) errors.name = "Name is required";
    if (!formdata.email.trim()) errors.email = "Email is required";
    if (!formdata.password.trim()) errors.password = "Password is required";
    setValidationError(errors);
    if (Object.keys(errors).length === 0) dispatch(register(formdata));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Decorative Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-700 to-violet-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 text-white text-center">
          <div className="text-6xl mb-6">🎵</div>
          <h2 className="text-4xl font-extrabold mb-4">Join SoundCore</h2>
          <p className="text-indigo-200 text-lg max-w-xs mx-auto">
            Create your account and start your premium audio journey today.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs mx-auto text-sm">
            {[
              { val: "500+", label: "Products" },
              { val: "2yr", label: "Warranty" },
              { val: "Free", label: "Shipping" },
              { val: "24/7", label: "Support" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="font-extrabold text-lg">{s.val}</p>
                <p className="text-indigo-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Sound<span className="text-indigo-600">Core</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-8">Fill in your details to get started</p>

          {isError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {message || "Registration failed. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={formdata.name}
                onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                  validationError.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                }`}
              />
              {validationError.name && <p className="text-red-500 text-xs mt-1">{validationError.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={formdata.email}
                onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                  validationError.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                }`}
              />
              {validationError.email && <p className="text-red-500 text-xs mt-1">{validationError.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formdata.password}
                  onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                    validationError.password ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {validationError.password && <p className="text-red-500 text-xs mt-1">{validationError.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition text-sm"
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;