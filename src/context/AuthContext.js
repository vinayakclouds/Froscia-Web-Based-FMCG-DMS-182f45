import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Role definitions and their hierarchical access levels
  const roleHierarchy = {
    ADMIN: 4,
    MANAGEMENT: 3,
    SUPERSTOCKIST: 2,
    DISTRIBUTOR: 1,
    SALESMAN: 0,
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          await logout();
        } else {
          await getUserProfile(token);
        }
      }
    } catch (err) {
      console.error("Auth status check failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (token) => {
    try {
      const response = await api.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      await logout();
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", credentials);
      const { token, user: userData } = response.data;
      
      localStorage.setItem("authToken", token);
      setUser(userData);
      
      // Configure default auth header for subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Attempt to invalidate token on server
      const token = localStorage.getItem("authToken");
      if (token) {
        await api.post("/auth/logout", null, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clean up local state regardless of server response
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      setError(null);
    }
  };

  const hasPermission = (requiredRole) => {
    if (!user || !user.role) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const canAccessRoute = (allowedRoles) => {
    if (!user || !user.role) return false;
    return allowedRoles.some(role => hasPermission(role));
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put("/user/profile", profileData);
      setUser(prevUser => ({ ...prevUser, ...response.data }));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Profile update failed");
      throw err;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setError(null);
      await api.put("/user/change-password", passwordData);
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
      throw err;
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setError(null);
      await api.post("/auth/forgot-password", { email });
    } catch (err) {
      setError(err.response?.data?.message || "Password reset request failed");
      throw err;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setError(null);
      await api.post("/auth/reset-password", { token, newPassword });
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed");
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission,
    canAccessRoute,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;