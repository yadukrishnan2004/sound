import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [errore, setErrore] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/user/${storedUser.id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    if (storedUser?.id) {
      fetchUser();
    } else if (!["/login", "/register"].includes(window.location.pathname)) {
      navigate("/login");
    }
  }, [navigate]);

  const login = async (email, password) => {
    setLoading(true);
    setErrore("");

    try {
      const res = await axios.get(`http://localhost:5001/user?email=${email}`);
      if (res.data.length === 0) {
        setErrore("User not found");
        setLoading(false);
        return;
      }

      const foundUser = res.data[0];

      if (foundUser.blocked === true) {
        setErrore("You are blocked by the admin.");
        setLoading(false);
        return;
      }

      if (foundUser.password !== password) {
        setErrore("Invalid password");
        setLoading(false);
        return;
      }

      const loginTime = new Date();
      const userData = {
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        loginTime,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      alert("Login successful!");

      if (foundUser.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setErrore("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, errore, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
