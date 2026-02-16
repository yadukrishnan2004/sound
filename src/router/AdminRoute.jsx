import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);

    // Check if user exists and is admin (adjust logic based on your user object structure)
    if (!user || !user.isAdmin) {
        // Assuming 'isAdmin' or similar property exists on user object
        // If validation fails, redirect to home or login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute;
