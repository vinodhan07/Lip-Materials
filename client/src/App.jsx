import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Common Components
import AnnouncementPopup from './components/common/AnnouncementPopup';
import ToastBanner from './components/common/ToastBanner';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import AnnouncementManagement from './pages/admin/AnnouncementManagement';

// Auth Store
import useAuthStore from './store/authStore';

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
}

// Main Layout for public pages
function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ToastBanner />
      <main className="flex-1">{children}</main>
      <Footer />
      <AnnouncementPopup />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="announcements" element={<AnnouncementManagement />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
        <Route path="/products/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout><Checkout /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MainLayout><Orders /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Static Pages - placeholders for now */}
        <Route path="/about" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">About Us</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />
        <Route path="/contact" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Contact Us</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />
        <Route path="/faq" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">FAQ</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />
        <Route path="/privacy" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Privacy Policy</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />
        <Route path="/terms" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Terms of Service</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />
        <Route path="/shipping" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Shipping Info</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />
        <Route path="/returns" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-3xl font-bold">Returns & Refunds</h1><p className="mt-4 text-gray-600">Coming soon...</p></div></MainLayout>} />

        {/* 404 */}
        <Route path="*" element={<MainLayout><div className="container mx-auto px-4 py-20 text-center"><h1 className="text-4xl font-bold text-gray-900">404</h1><p className="mt-4 text-gray-600">Page not found</p></div></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
