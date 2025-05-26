import React, { useState } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TopBar from "../components/navigation/TopBar";
import { format } from "date-fns";

const SalesmanLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const today = format(new Date(), "EEEE, MMMM d, yyyy");
  
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/salesman/dashboard",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M152,208V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,115.5V208a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V115.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M220.8,91.9,128,32.5,35.2,91.9a8.1,8.1,0,0,0-2.7,11.1h0a8,8,0,0,0,11,2.7L128,51.5l84.5,54.2a8,8,0,0,0,11-2.7h0A8.1,8.1,0,0,0,220.8,91.9Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    {
      name: "Retailer Visits",
      path: "/salesman/retailer-visits",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M48,139.6V208a8,8,0,0,0,8,8H200a8,8,0,0,0,8-8V139.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M54.5,163.2a7.7,7.7,0,0,0,10.4-3.2L85.3,123a8.1,8.1,0,0,1,14.4,0l21.1,42.2a8,8,0,0,0,14.4,0l21.1-42.2a8.1,8.1,0,0,1,14.4,0l20.4,37a7.7,7.7,0,0,0,10.4,3.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="40" x2="216" y2="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="88" x2="216" y2="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    {
      name: "Order Entry",
      path: "/salesman/order-entry",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M184,184H69.8L41.9,30.6A8,8,0,0,0,34.1,24H16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="80" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="184" cy="204" r="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M62.5,144H188.1a15.9,15.9,0,0,0,15.7-13.1L216,64H48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    {
      name: "Collections",
      path: "/salesman/collections",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M102.5,120a28,28,0,0,1,51,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M153.5,136a28,28,0,0,1-51,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="92" x2="128" y2="164" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    {
      name: "Market Feedback",
      path: "/salesman/market-feedback",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M132.4,190.7a8,8,0,0,1-8.8,0C96.7,172.9,40,127.8,40,84A44,44,0,0,1,84,40c14.5,0,27.7,7.2,36,18.8C128.3,47.2,141.5,40,156,40a44,44,0,0,1,44,44C200,127.8,143.3,172.9,132.4,190.7Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      
      {/* Mobile menu toggle */}
      <div className="bg-white p-4 md:hidden shadow-sm flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{today}</p>
          <p className="text-xs text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
        >
          {isMenuOpen ? 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="40" y1="128" x2="216" y2="128" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="64" x2="216" y2="64" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="40" y1="192" x2="216" y2="192" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
          }
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
      
      {/* Desktop Bottom Navigation (Specific to Salesmen) */}
      <div className="hidden md:block fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-10">
        <nav className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-around">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center py-3 px-4 ${
                      isActive ? "text-primary-600" : "text-gray-500 hover:text-gray-900"
                    }`
                  }
                >
                  <span className="mb-1">{item.icon}</span>
                  <span className="text-xs font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-4 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Salesman Portal</h1>
            <p className="text-sm text-gray-500">{today}</p>
          </div>
          
          {/* Performance Summary Card */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Today's Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 rounded-md p-3">
                <p className="text-xs text-green-700">Visits Completed</p>
                <p className="text-xl font-bold text-green-800">3/8</p>
              </div>
              <div className="bg-blue-50 rounded-md p-3">
                <p className="text-xs text-blue-700">Orders Placed</p>
                <p className="text-xl font-bold text-blue-800">5</p>
              </div>
              <div className="bg-purple-50 rounded-md p-3">
                <p className="text-xs text-purple-700">Order Value</p>
                <p className="text-xl font-bold text-purple-800">₹12,450</p>
              </div>
              <div className="bg-amber-50 rounded-md p-3">
                <p className="text-xs text-amber-700">Collections</p>
                <p className="text-xl font-bold text-amber-800">₹8,200</p>
              </div>
            </div>
          </div>
          
          {/* Page Content from Child Routes */}
          <Outlet />
        </div>
      </main>
      
      {/* Quick Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button 
          className="bg-primary-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-primary-700"
          onClick={() => navigate("/salesman/order-entry/new")}  
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="40" y1="128" x2="216" y2="128" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="40" x2="128" y2="216" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SalesmanLayout;