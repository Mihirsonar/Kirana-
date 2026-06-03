import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// Public Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import LoginPage from "./Pages/Login";
import SignInPage from "./Pages/Register";
import Profile from "./Pages/Profile";

// Components
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";

// Shopping Flow
import Cart from "./Pages/Cart";
import Orders from "./Pages/Orders";
import AddressPage from "./Pages/Address";
import PaymentPage from "./Pages/Payment";
import OrderSuccess from "./Pages/Order-success";
import MyOrders from "./Pages/Myorders";

// Lazy Loaded Admin Pages
const AllOrdersLazy = lazy(() =>
  import("./Pages/Admin/AllOrders")
);

function Routing() {
  const location = useLocation();

  const hideHeaderFooterPaths = [
    "/login",
    "/register",
    "/cart",
    "/orders",
    "/address",
    "/payment",
    "/order-success",
    "/admin",
  ];

  const shouldHideHeaderFooter =
    hideHeaderFooterPaths.some((path) =>
      location.pathname.startsWith(path)
    );

  return (
    <>
      {!shouldHideHeaderFooter && <Header />}

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<SignInPage />} />

        <Route path="/profile" element={<Profile />} />

        <Route
          path="/order-success"
          element={<OrderSuccess />}
        />

        {/* PROTECTED ROUTES */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/myorders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/address"
          element={
            <ProtectedRoute>
              <AddressPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}

        <Route
          path="/admin/AllOrders"
          element={
            <AdminRoute>
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="mt-4 text-slate-600 dark:text-slate-400">
                        Loading Dashboard...
                      </p>
                    </div>
                  </div>
                }
              >
                <AllOrdersLazy />
              </Suspense>
            </AdminRoute>
          }
        />

      </Routes>

      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default Routing;