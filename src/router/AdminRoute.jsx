import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    // Fixed: use strict equality (!==) instead of loose (!=)
    if (!user || user.role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute;