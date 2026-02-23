import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';

// Lazy Load User Components
const Loginpage = lazy(() => import('../modules/user/pages/Loginpage'));
const Registration = lazy(() => import('../modules/user/pages/Registration'));
const OtpVerify = lazy(() => import('../modules/user/pages/OtpVerify'));
const Homepage = lazy(() => import('../modules/user/pages/Homepage'));
const ProductDetail = lazy(() => import('../modules/user/pages/ProductDetail'));
const AllProducts = lazy(() => import('../modules/user/pages/AllProducts'));
const CategoryProducts = lazy(() => import('../modules/user/pages/CategoryProducts'));
const CartDisplay = lazy(() => import('../modules/user/pages/CartDisplay'));
const WishlistDisplay = lazy(() => import('../modules/user/pages/WishlistDisplay'));
const AccountDetails = lazy(() => import('../modules/user/pages/AccountDetails'));
const MyOrders = lazy(() => import('../modules/user/pages/MyOrders'));
const OrderDetail = lazy(() => import('../modules/user/pages/OrderDetail'));
const CheckoutDisplay = lazy(() => import('../modules/user/pages/CheckoutDisplay'));

// Lazy Load Admin Components
const AdminLayout = lazy(() => import('../modules/admin/pages/AdminLayout'));
const Dashboard = lazy(() => import('../modules/admin/pages/Dashboard'));
const ManageUsers = lazy(() => import('../modules/admin/pages/ManageUsers'));
const EditUser = lazy(() => import('../modules/admin/pages/EditUser'));
const ManageProducts = lazy(() => import('../modules/admin/pages/ManageProducts'));
const ManageOrders = lazy(() => import('../modules/admin/pages/ManageOrders'));

const Loader = () => (
    <div className="flex justify-center items-center h-screen bg-black text-white">
        Loading...
    </div>
);

function AppRouter() {
    const { user, isAuthChecked } = useSelector((state) => state.auth);

    if (!isAuthChecked) {
        return <Loader />;
    }

    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/home" element={<Homepage />} />

                {/* Redirect logged-in users away from auth pages */}
                <Route
                    path="/login"
                    element={
                        !user ? <Loginpage /> :
                            user.role === 'admin' ? <Navigate to="/admin" replace /> :
                                <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        !user ? <Registration /> :
                            user.role === 'admin' ? <Navigate to="/admin" replace /> :
                                <Navigate to="/" replace />
                    }
                />
                <Route path="/verify-otp" element={<OtpVerify />} />
                <Route path="/Product/:id" element={<ProductDetail />} />
                <Route path="/allproducts" element={<AllProducts />} />
                <Route path="/category/:categoryName" element={<CategoryProducts />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                    {/* Support both /cart and /Cart for compatibility */}
                    <Route path="/cart" element={<CartDisplay />} />
                    <Route path="/Cart" element={<CartDisplay />} />
                    <Route path="/wishlist" element={<WishlistDisplay />} />
                    <Route path="/account" element={<AccountDetails />} />
                    <Route path="/myorders" element={<MyOrders />} />
                    <Route path="/myorders/:orderId" element={<OrderDetail />} />
                    <Route path="/checkout" element={<CheckoutDisplay />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="userlist" element={<ManageUsers />} />
                    <Route path="edituser/:id" element={<EditUser />} />
                    <Route path="productmanage" element={<ManageProducts />} />
                    <Route path="manageorder" element={<ManageOrders />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}

export default AppRouter;
