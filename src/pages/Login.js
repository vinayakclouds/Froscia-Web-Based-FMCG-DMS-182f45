import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import LoginForm from "../components/forms/LoginForm";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      switch (user.role) {
        case "ADMIN":
        case "MANAGEMENT":
          navigate("/admin/dashboard");
          break;
        case "SUPERSTOCKIST":
          navigate("/superstockist/dashboard");
          break;
        case "DISTRIBUTOR":
          navigate("/distributor/dashboard");
          break;
        case "SALESMAN":
          navigate("/salesman/dashboard");
          break;
        default:
          // If role is unknown or undefined, stay on login page
          break;
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8 lg:space-x-16">
          {/* Left Side - Company Information */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <div className="text-center md:text-left">
              <div className="w-60 mx-auto md:mx-0 mb-6">
                <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Mzk2MDh8MHwxfHNlYXJjaHwxfHxGcm9zY2lhJTJCQ29tcGFueSUyQkxvZ298ZW58MHx8fHwxNzQ3OTg3MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Froscia Company Logo" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-800 mb-4">
                Froscia Distribution Management System
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                A comprehensive platform to manage your entire distribution network
                efficiently and effectively.
              </p>
              
              <div className="hidden md:block">
                <h2 className="text-xl font-semibold text-primary-700 mb-3">Key Features</h2>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </span>
                    Complete inventory management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </span>
                    Order processing and tracking
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </span>
                    Sales force automation
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="mr-2 text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><polyline points="88 136 112 160 168 104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </span>
                    Real-time analytics and reports
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Right Side - Login Form */}
          <div className="w-full md:w-1/2 max-w-md">
            <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
                <p className="text-sm text-gray-600">
                  Log in with your credentials to access your account
                </p>
              </div>
              
              {/* Role Selection Cards */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select your role:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <RoleCard 
                    role="ADMIN" 
                    label="Admin"
                    icon=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="128" y1="132" x2="128" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="128" cy="172" r="16"/><path d="M216,112V56a8,8,0,0,0-8-8H48a8,8,0,0,0-8,8v56c0,96,88,120,88,120S216,208,216,112Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  />
                  <RoleCard 
                    role="MANAGEMENT" 
                    label="Management"
                    icon=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><rect x="32" y="48" width="192" height="136" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="160" y1="184" x2="192" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="96" y1="184" x2="64" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="92" y1="120" x2="92" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="104" x2="128" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="164" y1="88" x2="164" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="128" y1="48" x2="128" y2="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  />
                  <RoleCard 
                    role="SUPERSTOCKIST" 
                    label="Super Stockist"
                    icon=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="16" y1="192" x2="240" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="240" y1="48" x2="16" y2="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><polyline points="76 192 76 120 180 120 180 192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="76" y1="156" x2="180" y2="156" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="32" y1="92.57" x2="32" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="224" y1="51.43" x2="224" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  />
                  <RoleCard 
                    role="DISTRIBUTOR" 
                    label="Distributor"
                    icon=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><circle cx="220" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="36" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><circle cx="84" cy="184" r="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><line x1="196" y1="184" x2="108" y2="184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M156,184V56a8,8,0,0,1,8-8h0a48,48,0,0,1,48,48v8h0a32,32,0,0,1,32,32v48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M116,184V72H20a8,8,0,0,0-8,8V184" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  />
                  <RoleCard 
                    role="SALESMAN" 
                    label="Salesman"
                    icon=<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24"><rect width="256" height="256" fill="none"/><line x1="112" y1="100" x2="144" y2="100" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><rect x="32" y="60" width="192" height="144" rx="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M168,60V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V60" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M224,114.31A191.09,191.09,0,0,1,128,140a191.14,191.14,0,0,1-96-25.68" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                  />
                </div>
              </div>
              
              <LoginForm />
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Need help?</span>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col space-y-4">
                  <Link
                    to="/help"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="20" height="20"><rect width="256" height="256" fill="none"/><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M176,211.16V176a8,8,0,0,0-8-8H88a8,8,0,0,0-8,8v35.16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M96,168V136a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v32" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/><path d="M147.84,128,135.71,84.44a8,8,0,0,0-15.42,0L108.16,128Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"/></svg>
                    </span>
                    Help Center
                  </Link>
                  <div className="text-center">
                    <span className="text-xs text-gray-500">
                      By logging in, you agree to our{" "}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                        Privacy Policy
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* System Requirements */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Recommended browsers: Chrome, Firefox, Edge
              </p>
              <p className="text-xs text-gray-500">
                Version 2.1.0 | Last updated: May 15, 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Role selection card component
const RoleCard = ({ role, label, icon }) => {
  const formik = useFormik({
    initialValues: {
      role: "",
    }
  });
  
  const isSelected = formik.values.role === role;
  
  const handleRoleSelect = () => {
    formik.setFieldValue("role", role);
    // In a real implementation, this would update the parent form's role value
  };
  
  return (
    <button
      type="button"
      onClick={handleRoleSelect}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
        isSelected
          ? "bg-primary-50 border-primary-500"
          : "bg-white border-gray-300 hover:bg-gray-50"
      }`}
    >
      <div className={`p-2 rounded-full ${isSelected ? "bg-primary-100" : "bg-gray-100"}`}>
        <span className={isSelected ? "text-primary-600" : "text-gray-600"}>
          {icon}
        </span>
      </div>
      <span className={`mt-1 text-xs font-medium ${isSelected ? "text-primary-700" : "text-gray-700"}`}>
        {label}
      </span>
    </button>
  );
};

export default Login;