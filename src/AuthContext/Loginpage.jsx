import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./authcontext";

function Loginpage() {
  const { errore, login } = useAuth();
  const [error, setError] = useState({});
  const [formdata, setFormdata] = useState({ email: "", password: "" });
  const [remember, setremember] = useState(false);

  const HandleSubmit = (e) => {
    e.preventDefault();
    const validationError = {};

    if (!formdata.email) validationError.email = "Use a valid Email";
    if (!formdata.password) validationError.password = "Use a valid Password";

    if (Object.keys(validationError).length > 0) {
      setError(validationError);
      return;
    }

    login(formdata.email, formdata.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold text-white">
            Sign in to your account
          </h2>
        </div>

        {(error.email || error.password || errore) && (
          <div className="mt-4 text-center text-red-500 text-sm font-medium">
            {error.email || error.password || errore}
          </div>
        )}

        <form onSubmit={HandleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm text-white/80">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={formdata.email}
              onChange={(e) =>
                setFormdata({ ...formdata, email: e.target.value })
              }
              className="mt-2 w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-white/80">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formdata.password}
              onChange={(e) =>
                setFormdata({ ...formdata, password: e.target.value })
              }
              className="mt-2 w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setremember(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-white/70">Remember me</label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md font-semibold transition"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Sign Up
          </Link>
          
        </p>
      </div>
    </div>
  );
}

export default Loginpage;
