import axios from "axios";
import jwtDecode from "jwt-decode";

// Constants
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const AUTH_STORAGE_KEY = "froscia_auth";
const TOKEN_REFRESH_THRESHOLD = 5 * 60; // 5 minutes in seconds

// Initialize axios instance
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to handle auth token
authApi.interceptors.request.use(
  (config) => {
    const auth = getAuthFromStorage();
    if (auth?.token) {
      config.headers["Authorization"] = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = getAuthFromStorage();
        if (auth?.refreshToken) {
          const response = await refreshToken(auth.refreshToken);
          if (response?.token) {
            originalRequest.headers["Authorization"] = `Bearer ${response.token}`;
            return authApi(originalRequest);
          }
        }
      } catch (refreshError) {
        logout();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to get auth data from storage
const getAuthFromStorage = () => {
  const authJson = localStorage.getItem(AUTH_STORAGE_KEY);
  if (authJson) {
    try {
      return JSON.parse(authJson);
    } catch (e) {
      console.error("Error parsing auth data from storage:", e);
      return null;
    }
  }
  return null;
};

// Helper function to set auth data in storage
const setAuthInStorage = (authData) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
};

// Helper function to clear auth data from storage
const clearAuthFromStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

// Token refresh function
const refreshToken = async (refreshToken) => {
  try {
    const response = await authApi.post("/auth/refresh", { refreshToken });
    const newAuthData = response.data;
    setAuthInStorage(newAuthData);
    return newAuthData;
  } catch (error) {
    clearAuthFromStorage();
    throw error;
  }
};

// Check if token needs refresh
const shouldRefreshToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp - currentTime < TOKEN_REFRESH_THRESHOLD;
  } catch (e) {
    return true;
  }
};

// Authentication service
const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await authApi.post("/auth/login", credentials);
      const authData = response.data;
      setAuthInStorage(authData);
      return authData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Logout function
  logout: async () => {
    try {
      const auth = getAuthFromStorage();
      if (auth?.refreshToken) {
        await authApi.post("/auth/logout", { refreshToken: auth.refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthFromStorage();
    }
  },

  // Check authentication status
  isAuthenticated: () => {
    const auth = getAuthFromStorage();
    if (!auth?.token) return false;

    try {
      const decoded = jwtDecode(auth.token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (e) {
      return false;
    }
  },

  // Get current user role
  getUserRole: () => {
    const auth = getAuthFromStorage();
    if (!auth?.token) return null;

    try {
      const decoded = jwtDecode(auth.token);
      return decoded.role;
    } catch (e) {
      return null;
    }
  },

  // Get current user data
  getCurrentUser: () => {
    const auth = getAuthFromStorage();
    if (!auth?.token) return null;

    try {
      const decoded = jwtDecode(auth.token);
      return {
        id: decoded.sub,
        username: decoded.username,
        role: decoded.role,
        permissions: decoded.permissions || []
      };
    } catch (e) {
      return null;
    }
  },

  // Verify and refresh token if needed
  verifyToken: async () => {
    const auth = getAuthFromStorage();
    if (!auth?.token) return false;

    try {
      if (shouldRefreshToken(auth.token)) {
        await refreshToken(auth.refreshToken);
      }
      return true;
    } catch (e) {
      clearAuthFromStorage();
      return false;
    }
  },

  // Check if user has specific permission
  hasPermission: (permission) => {
    const user = authService.getCurrentUser();
    return user?.permissions?.includes(permission) || false;
  },

  // Check if user has any of the specified roles
  hasRole: (roles) => {
    const userRole = authService.getUserRole();
    if (!userRole || !roles) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  },

  // Initialize auth state
  initializeAuth: async () => {
    try {
      const isAuthenticated = await authService.verifyToken();
      if (!isAuthenticated) {
        clearAuthFromStorage();
      }
      return isAuthenticated;
    } catch (error) {
      clearAuthFromStorage();
      return false;
    }
  },

  // Get authentication token
  getToken: () => {
    const auth = getAuthFromStorage();
    return auth?.token || null;
  },

  // Update user password
  updatePassword: async (currentPassword, newPassword) => {
    try {
      await authApi.post("/auth/change-password", {
        currentPassword,
        newPassword
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password update failed");
    }
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      await authApi.post("/auth/forgot-password", { email });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset request failed");
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      await authApi.post("/auth/reset-password", {
        token,
        newPassword
      });
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Password reset failed");
    }
  },

  // Register new user (if applicable)
  register: async (userData) => {
    try {
      const response = await authApi.post("/auth/register", userData);
      const authData = response.data;
      setAuthInStorage(authData);
      return authData;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }
};

export default authService;