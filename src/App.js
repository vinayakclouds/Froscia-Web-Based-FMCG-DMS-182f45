import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import DistributorLayout from "./layouts/DistributorLayout";
import SuperstockistLayout from "./layouts/SuperstockistLayout";
import SalesmanLayout from "./layouts/SalesmanLayout";

// Pages
import Login from "./pages/Login";

// Protected Route Component
const ProtectedRoute = ({ element: Element, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    switch (user.role) {
      case "ADMIN":
      case "MANAGEMENT":
        return <Navigate to="/admin/dashboard" replace />;
      case "SUPERSTOCKIST":
        return <Navigate to="/superstockist/dashboard" replace />;
      case "DISTRIBUTOR":
        return <Navigate to="/distributor/dashboard" replace />;
      case "SALESMAN":
        return <Navigate to="/salesman/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <Element />;
};

const App = () => {
  const { user, loading } = useAuth();

  // Redirect to appropriate dashboard if already logged in
  const getDefaultRoute = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "ADMIN":
      case "MANAGEMENT":
        return "/admin/dashboard";
      case "SUPERSTOCKIST":
        return "/superstockist/dashboard";
      case "DISTRIBUTOR":
        return "/distributor/dashboard";
      case "SALESMAN":
        return "/salesman/dashboard";
      default:
        return "/login";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img src="https://images.unsplash.com/photo-1592093947163-51f1d258d110?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDgyNTczMTN8&ixlib=rb-4.1.0&q=80&w=1080" alt="Froscia Logo Loading" />
          <div className="mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Default Route Redirect */}
      <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

      {/* Admin & Management Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute
            element={AdminLayout}
            allowedRoles={["ADMIN", "MANAGEMENT"]}
          />
        }
      />

      {/* Superstockist Routes */}
      <Route
        path="/superstockist/*"
        element={
          <ProtectedRoute
            element={SuperstockistLayout}
            allowedRoles={["SUPERSTOCKIST"]}
          />
        }
      />

      {/* Distributor Routes */}
      <Route
        path="/distributor/*"
        element={
          <ProtectedRoute
            element={DistributorLayout}
            allowedRoles={["DISTRIBUTOR"]}
          />
        }
      />

      {/* Salesman Routes */}
      <Route
        path="/salesman/*"
        element={
          <ProtectedRoute
            element={SalesmanLayout}
            allowedRoles={["SALESMAN"]}
          />
        }
      />

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-400">404</div>
              <h1 className="mt-4 text-xl font-semibold text-gray-600">Page Not Found</h1>
              <p className="mt-2 text-gray-500">The page you're looking for doesn't exist.</p>
              <button
                onClick={() => window.location.href = getDefaultRoute()}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M40,216H216V120a8,8,0,0,0-2.34-5.66l-80-80a8,8,0,0,0-11.32,0l-80,80A8,8,0,0,0,40,120Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                <span className="ml-2">Return to Dashboard</span>
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;