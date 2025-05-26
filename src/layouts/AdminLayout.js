import React, { useState } from "react";
import { Outlet, useLocation, NavLink } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import TopBar from "../components/navigation/TopBar";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extract current page title from URL
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("products")) return "Product Catalog";
    if (path.includes("inventory")) return "Inventory Management";
    if (path.includes("users")) return "User Management";
    if (path.includes("retailers")) return "Retailer Management";
    if (path.includes("distributors")) return "Distributor Management";
    if (path.includes("schemes")) return "Scheme Management";
    if (path.includes("orders")) return "Order Management";
    if (path.includes("sales-targets")) return "Sales Targets";
    if (path.includes("reports")) return "Reports & Analytics";
    return "Admin Dashboard";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black opacity-50 transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <div className={`md:flex flex-shrink-0 ${sidebarOpen ? 'fixed inset-y-0 z-30 w-64' : 'hidden'} md:static md:w-64`}>
        <Sidebar />
      </div>
      
      {/* Content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <TopBar toggleSidebar={toggleSidebar} />
        
        {/* Main content */}
        <main className="flex-1 relative z-0 overflow-y-auto py-6 focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Page header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
                {/* Page-specific action button could go here */}
                <div className="flex space-x-3">
                  {location.pathname.includes("/admin/products") && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <span className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg></span>
                      Add Product
                    </button>
                  )}
                  
                  {location.pathname.includes("/admin/users") && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <span className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg></span>
                      Add User
                    </button>
                  )}
                  
                  {location.pathname.includes("/admin/retailers") && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <span className="mr-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="18" height="18"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg></span>
                      Add Retailer
                    </button>
                  )}
                </div>
              </div>
              
              {/* Breadcrumbs */}
              <nav className="flex mt-2" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2 text-sm text-gray-500">
                  <li>
                    <NavLink to="/admin/dashboard" className="hover:text-gray-700">
                      Admin
                    </NavLink>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-1">/</span>
                  </li>
                  <li className="text-gray-700 font-medium">
                    {getPageTitle()}
                  </li>
                </ol>
              </nav>
            </div>
            
            {/* Admin greeting card */}
            {location.pathname === "/admin/dashboard" && (
              <div className="bg-white shadow rounded-lg mb-6 p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="80" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="80" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="172" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="176" cy="60" r="28" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,224a60,60,0,0,1,96,0,60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M32,112a60,60,0,0,1,96,0h0a60,60,0,0,1,96,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Welcome back, {user?.name || "Admin"}!
                    </h2>
                    <p className="text-sm text-gray-500">
                      Here's what's happening with your distribution network today
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Content from nested routes */}
            <div className="py-4">
              <Outlet />
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Froscia FMCG. All rights reserved.
              </div>
              <div className="text-sm">
                <a 
                  href="/help" 
                  className="text-gray-500 hover:text-gray-900 mr-4"
                >
                  Help Center
                </a>
                <a 
                  href="/contact" 
                  className="text-gray-500 hover:text-gray-900"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;