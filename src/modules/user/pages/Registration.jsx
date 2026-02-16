import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../../../features/auth/authSlice";

function Registration() {
    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [validationError, setValidationError] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        if (isSuccess) {
            navigate("/verify-otp");
            dispatch(reset());
        }
        if (isError) {
            // stay on page to show error
        }
    }, [isSuccess, isError, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let isValid = true;
        let errors = {};

        if (!formdata.name.trim()) {
            isValid = false;
            errors.name = "Please enter a valid name.";
        }
        if (!formdata.email.trim()) {
            isValid = false;
            errors.email = "Please enter a valid email.";
        }
        if (!formdata.password.trim()) {
            isValid = false;
            errors.password = "Please enter a valid password.";
        }

        setValidationError(errors);

        if (isValid) {
            dispatch(register(formdata));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Create Your Account
                    </h2>
                </div>

                {(Object.keys(validationError).length > 0 || isError) && (
                    <div className="mb-4 text-center text-red-500 text-sm font-medium space-y-1">
                        {validationError.name && <p>{validationError.name}</p>}
                        {validationError.email && <p>{validationError.email}</p>}
                        {validationError.password && <p>{validationError.password}</p>}
                        {isError && <p>{message}</p>}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm text-white/80">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            onChange={(e) =>
                                setFormdata({ ...formdata, name: e.target.value })
                            }
                            className="mt-2 w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm text-white/80">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            onChange={(e) =>
                                setFormdata({ ...formdata, email: e.target.value })
                            }
                            className="mt-2 w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm text-white/80">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setFormdata({ ...formdata, password: e.target.value })
                            }
                            className="mt-2 w-full rounded-md bg-white/10 px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 rounded-md font-semibold transition ${isLoading
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                            }`}
                    >
                        {isLoading ? "Registering..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-white/60">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Registration;
