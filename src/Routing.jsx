import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

// Public Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import LoginPage from "./Pages/Login";
import SignInPage from "./Pages/Register";
import Profile from "./Pages/Profile";
import ProductsPage from "./Pages/ProductsPage";
import Settings from "./Pages/Settings";

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

// Admin Pages
import AdminDashboard from "./Pages/Admin/Dashboard";
import AdminProducts from "./Pages/Admin/Products";
import StockAndPrices from "./Pages/Admin/StockAndPrices";
import AdminCategories from "./Pages/Admin/Categories";
import AdminCustomers from "./Pages/Admin/Customers";
import StoreSettings from "./Pages/Admin/StoreSettings";
import GenericAdminSection from "./Pages/Admin/GenericAdminSection";
import AllOrders from "./Pages/Admin/AllOrders";

function Routing() {
  const location = useLocation();

  const hideHeaderFooterPaths = [
    "/login",
    "/register",
    "/cart",
    "/orders",
    "/payment",
    "/order-success",
    "/admin",
    "/address",
    "/settings"
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

        <Route path="/products" element={<ProductsPage />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/settings" element={<Settings />} />

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
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AllOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/AllOrders"
          element={
            <AdminRoute>
              <AllOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock"
          element={
            <AdminRoute>
              <StockAndPrices />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <AdminRoute>
              <AdminCustomers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <StoreSettings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/charges"
          element={
            <AdminRoute>
              <StoreSettings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="% Offers"
                subtitle="Active promotional percentage discounts and grocery deals"
              />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="Coupons"
                subtitle="Manage checkout discount coupon codes and vouchers"
              />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/banners"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="Banners"
                subtitle="Promotional home carousels and store advertisement banners"
              />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/team"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="Team & Delivery Staff"
                subtitle="Store operators, cashiers, and assigned delivery riders"
              />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/cash"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="Cash Counter"
                subtitle="Daily cash reconciliation and physical register balances"
              />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="Reports & Analytics"
                subtitle="End-of-day sales reports, GST invoices, and AOV trends"
              />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit-log"
          element={
            <AdminRoute>
              <GenericAdminSection
                title="Audit Log"
                subtitle="Track system changes, price edits, and admin events"
              />
            </AdminRoute>
          }
        />

      </Routes>

      {!shouldHideHeaderFooter && <Footer />}
    </>
  );
}

export default Routing;