import React from "react";
import { useAuth } from "../AuthContext/authcontext";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 🔥 wait until auth finishes loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
