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
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M104,35a95.51,95.51,0,0,1,48,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M35.49,102.3a95.54,95.54,0,0,1,24-41.56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M152,221a95.51,95.51,0,0,1-48,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M196.51,60.73a95.54,95.54,0,0,1,24,41.58" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="120" r="40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M220.52,153.7a96,96,0,0,1-28.32,45.67,72,72,0,0,0-128.4,0A96,96,0,0,1,35.48,153.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    {
      name: "Retailer Visits",
      path: "/salesman/retailer-visits",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="16" y1="216" x2="240" y2="216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="224 216 224 76 176 76 176 40 80 40 80 112 32 112 32 216" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="76" x2="136" y2="76" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="112" x2="136" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="112" x2="188" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="68" y1="148" x2="84" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="120" y1="148" x2="136" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="172" y1="148" x2="188" y2="148" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M148,216V176a4,4,0,0,0-4-4H112a4,4,0,0,0-4,4v40Z"/></svg>
    },
    {
      name: "Order Entry",
      path: "/salesman/order-entry",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><path d="M20,32H40L76.75,164.28A16,16,0,0,0,92.16,176H191a16,16,0,0,0,15.42-11.72L232,72H51.11" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="88" cy="220" r="20"/><circle cx="192" cy="220" r="20"/></svg>
    },
    {
      name: "Collections",
      path: "/salesman/collections",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><line x1="128" y1="24" x2="128" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="208" x2="128" y2="232" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,88a40,40,0,0,0-40-40H112a40,40,0,0,0,0,80h40a40,40,0,0,1,0,80H104a40,40,0,0,1-40-40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
    },
    {
      name: "Market Feedback",
      path: "/salesman/market-feedback",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><rect x="48" y="120" width="88" height="88" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,188v12a8,8,0,0,1-8,8H180" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="208" y1="116" x2="208" y2="140" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M184,48h16a8,8,0,0,1,8,8V72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="116" y1="48" x2="140" y2="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48,76V56a8,8,0,0,1,8-8H68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="96" x2="96" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="96" x2="160" y2="160" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><polyline points="24 180 68 164 108 180 148 164 188 180 232 164" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="24" y1="128" x2="232" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M208,172.73V184a32,32,0,0,1-32,32H80a32,32,0,0,1-32-32V171.27" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M48.2,92a8,8,0,0,1-7.83-10.29C49.49,53.24,85.26,32,128,32s78.52,21.25,87.63,49.73A8,8,0,0,1,207.8,92Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="40" y="40" width="176" height="176" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="88" y1="128" x2="168" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="88" x2="128" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SalesmanLayout;