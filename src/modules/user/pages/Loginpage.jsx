import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, reset } from "../../../features/auth/authSlice";
import { Eye, EyeOff, LogIn } from "lucide-react";

function Loginpage() {
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [validationError, setValidationError] = useState({});
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess || user) {
      if (user?.role === "admin") navigate("/admin");
      else navigate("/");
    }
    if (isSuccess || isError) dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formdata.email) errors.email = "Email is required";
    if (!formdata.password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) { setValidationError(errors); return; }
    dispatch(login({ email: formdata.email, password: formdata.password }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-1 bg-indigo-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-800 via-indigo-600 to-indigo-500" />
        <div className="relative z-10 text-white text-center">
          <div className="text-6xl mb-6">🎧</div>
          <h2 className="text-4xl font-extrabold mb-4">
            Sound<span className="text-indigo-200">Core</span>
          </h2>
          <p className="text-indigo-200 text-lg max-w-xs mx-auto">
            Premium headphones for those who live for music.
          </p>
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {["Free shipping on orders ₹999+", "2-Year warranty on all products", "10,000+ happy customers"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-indigo-100 text-sm">
                <span className="text-green-400">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo (mobile) */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Sound<span className="text-indigo-600">Core</span>
            </h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          {/* Error */}
          {isError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {message || "Login failed. Please try again."}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={formdata.email}
                onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                  validationError.email ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                }`}
              />
              {validationError.email && (
                <p className="text-red-500 text-xs mt-1">{validationError.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={formdata.password}
                  onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                  placeholder="••••••••"
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
              {validationError.password && (
                <p className="text-red-500 text-xs mt-1">{validationError.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition text-sm"
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : (
                <><LogIn size={16} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;