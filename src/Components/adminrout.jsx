import React from 'react'
import { AuthContext, useAuth } from '../AuthContext/authcontext';
import { Navigate, useLocation } from 'react-router-dom';   

function AdminRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export  default AdminRoute;
