import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config/baseUrl";

// 🔥 DO NOT export the raw context (causes Vite refresh issues)
export const AuthContext = createContext(null);

// ✅ Stable hook export
export function useAuth() {
  return useContext(AuthContext);
}

// ✅ Stable provider export
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/profile`, {
        withCredentials: true,
      });

      // backend response = {status, message, data}
      setUser(res?.data?.data || null);
    } catch (err) {
      console.log("No active session");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setErrore("");

    try {
      await axios.post(
        `${BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      await fetchUserProfile();

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setErrore(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/users/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
      console.log("✅ Logged out successfully");
    } catch (err) {
      console.error("❌ Logout error:", err);
      // Still clear local state even if API fails
      setUser(null);
      navigate("/login");
    }
  };

  const value = {
    user,
    errore,
    loading,
    login,
    logout,
    fetchUserProfile, // optional but useful
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
