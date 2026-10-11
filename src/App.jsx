import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import CustomerLayout from './layouts/CustomerLayout';
import AdminRoute from './routes/AdminRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import ScrollToTop from './components/ScrollToTop';
import ToastContainer from './components/ToastContainer';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Favorites from './pages/Favorites';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SizeGuide from './pages/SizeGuide';
import HowItWorks from './pages/HowItWorks';
import CustomOrder from './pages/CustomOrder';
import TrackOrder from './pages/TrackOrder';
import Book from './pages/Book';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

// Auth & Protected Customer Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/customer/Profile';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminLookbook from './pages/admin/AdminLookbook';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminOffers from './pages/admin/AdminOffers';
import AdminStudio from './pages/admin/AdminStudio';
import AdminMedia from './pages/admin/AdminMedia';
import AdminSupport from './pages/admin/AdminSupport';
import AdminSettings from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <ToastContainer />

      <Routes>
        {/* ===================================================================
            1. CUSTOMER PORTAL ROUTES (Preserves complete Nailsbyhelina website)
            =================================================================== */}
        <Route element={<CustomerLayout />}>
          {/* Public Storefront */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/custom-order" element={<CustomOrder />} />
          <Route path="/track-order" element={<TrackOrder />} />

          {/* Studio Experience (Dynamic toggle between Coming Soon and Booking) */}
          <Route path="/studio" element={<Book />} />
          <Route path="/book" element={<Book />} />
          <Route path="/booking" element={<Book />} />

          {/* Information & Legal */}
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping-returns" element={<ShippingReturns />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Customer Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Account Redirect */}
          <Route path="/account" element={<Navigate to="/profile" replace />} />

          {/* Protected Customer Account Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All within Customer Layout */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ===================================================================
            2. ADMIN PORTAL ROUTES (Protected by AdminRoute and Database RLS)
            =================================================================== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Navigate to="/admin/dashboard" replace />
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
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/new"
          element={
            <AdminRoute>
              <AdminProductForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <AdminRoute>
              <AdminProductForm />
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
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <AdminRoute>
              <AdminOrderDetail />
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
          path="/admin/lookbook"
          element={
            <AdminRoute>
              <AdminLookbook />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/homepage"
          element={
            <AdminRoute>
              <AdminHomepage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/offers"
          element={
            <AdminRoute>
              <AdminOffers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/studio"
          element={
            <AdminRoute>
              <AdminStudio />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <AdminRoute>
              <AdminMedia />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <AdminRoute>
              <AdminSupport />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
