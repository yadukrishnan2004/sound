
  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
  import React, { lazy, Suspense } from "react";

  import ContextProvider from "./Components/context/Cartcontext";
  import { ApiProvider } from "./Components/context/ApiContext";
  import { Wishlist } from "./Components/context/wishlist";
  import Allproduct from "./Components/pages/Allproduct";
  import AccountDetails from "./Components/pages/AccountDetails";
  import Home from "./Components/pages/Home";
  import Categories from "./Components/pages/Categories";
  import Deals from "./Components/pages/deals";
  import Contact from "./Components/pages/contact";
  import Catogery from "./Components/pages/Catogery";
  import { AuthProvider } from "./AuthContext/authcontext";
  import AdminLayout from "./admin/adminlayout";
  import Diplaycheckout from "./Components/pages/diplaycheckout";
  import Mangeuser from "./admin/mangeuser";
  import EditUser from "./admin/edituser";
  import MyOrders from "./Components/pages/Myorders";
  import ProductPage from "./admin/manageproduct";
  import ManageOrders from "./admin/manageorders";
  import Homee from "./admin/home";
  import ProtuctedRoute from "./Components/protuctedRoute";
import AdminRoute from "./Components/adminrout";


  const Homepage = lazy(() => import("./Components/pages/Homepage"));
  const Registration = lazy(() => import("./AuthContext/Registration"));
  const Loginpage = lazy(() => import("./AuthContext/Loginpage"));
  const Jbl = lazy(() => import("./Components/pages/Jbl"));
  const ProductDetail = lazy(() => import("./Components/pages/ProductDetail"));
  const Cartdisply = lazy(() => import("./Components/pages/Cartdisply"));
  const Displaywish = lazy(() => import("./Components/pages/Displaywish"));


  function App() {
    return (
      <Router>
        <AuthProvider>
        <ApiProvider>
          <ContextProvider>
            <Wishlist>
              <Suspense
                fallback={
                  <div className="text-center mt-20 text-white">
                    Loading page...
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/register" element={<Registration />} />
                  <Route path="/login" element={<Loginpage />} />
                  <Route path="/jbl" element={<Jbl />} />
                  <Route path="/Product/:id" element={<ProductDetail />} />
                  <Route path="/catogery/:catogery" element={<Catogery />} />
                  <Route path="/allproducts" element={<Allproduct />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/deals" element={<Deals />} />



                  {/* protect routes */}
                  <Route path="/Cart" element={ <ProtuctedRoute><Cartdisply /></ProtuctedRoute> } />
                  <Route path="/checkout" element= {<ProtuctedRoute><Diplaycheckout /></ProtuctedRoute>} />
                  <Route path="/order" element={<ProtuctedRoute><MyOrders /></ProtuctedRoute>} />
                  <Route path="/accountdetails" element={<ProtuctedRoute><AccountDetails /></ProtuctedRoute>} />
                  <Route path="/contact" element={<ProtuctedRoute><Contact /></ProtuctedRoute>} />
                  <Route path="/wishlist" element={<ProtuctedRoute><Displaywish /></ProtuctedRoute>} />





  {/* ---------------------------------------------------Admin----------------------------------------------------------- */}

                  <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                            <Route index element={<Homee />} />
                            <Route path="userlist" element={<Mangeuser />} />
                            <Route path="edituser/:id" element={<EditUser />} />
                            <Route path="productmanage" element={<ProductPage />} />
                            <Route path="manageorder" element={<ManageOrders />} />

                  </Route>
                </Routes>
              </Suspense>
            </Wishlist>
          </ContextProvider>
        </ApiProvider>
        </AuthProvider>
      </Router>
    );
  }

  export default App;

