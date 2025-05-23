import axios from "axios";

// Create a configurable axios instance for our API
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If refresh token is implemented
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        return api.post("/auth/refresh-token", { refreshToken })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem("token", res.data.token);
              
              // Update the authorization header
              api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
              originalRequest.headers["Authorization"] = `Bearer ${res.data.token}`;
              
              return api(originalRequest);
            }
          })
          .catch(err => {
            // If refresh token fails, logout user
            authService.logout();
            window.location.href = "/login";
            return Promise.reject(err);
          });
      } else {
        // No refresh token, redirect to login
        window.location.href = "/login";
      }
    }

    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// Auth related API calls
const authService = {
  login: (credentials) => {
    return api.post("/auth/login", credentials);
  },

  register: (userData) => {
    return api.post("/auth/register", userData);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
  
  verifyToken: () => {
    return api.get("/auth/verify");
  }
};

// User related API calls
const userService = {
  getCurrentUser: () => {
    return api.get("/users/me");
  },

  updateProfile: (userData) => {
    return api.put("/users/me", userData);
  },
  
  changePassword: (passwordData) => {
    return api.post("/users/change-password", passwordData);
  },
  
  getUsers: (params) => {
    return api.get("/users", { params });
  },
  
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },
  
  createUser: (userData) => {
    return api.post("/users", userData);
  },
  
  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  
  deleteUser: (id) => {
    return api.delete(`/users/${id}`);
  }
};

// Product related API calls
const productService = {
  getProducts: (params) => {
    return api.get("/products", { params });
  },
  
  getProductById: (id) => {
    return api.get(`/products/${id}`);
  },
  
  createProduct: (productData) => {
    return api.post("/products", productData);
  },
  
  updateProduct: (id, productData) => {
    return api.put(`/products/${id}`, productData);
  },
  
  deleteProduct: (id) => {
    return api.delete(`/products/${id}`);
  }
};

// Order related API calls
const orderService = {
  getOrders: (params) => {
    return api.get("/orders", { params });
  },
  
  getOrderById: (id) => {
    return api.get(`/orders/${id}`);
  },
  
  createOrder: (orderData) => {
    return api.post("/orders", orderData);
  },
  
  updateOrder: (id, orderData) => {
    return api.put(`/orders/${id}`, orderData);
  },
  
  changeOrderStatus: (id, status) => {
    return api.patch(`/orders/${id}/status`, { status });
  },
  
  deleteOrder: (id) => {
    return api.delete(`/orders/${id}`);
  }
};

// Retailer related API calls
const retailerService = {
  getRetailers: (params) => {
    return api.get("/retailers", { params });
  },
  
  getRetailerById: (id) => {
    return api.get(`/retailers/${id}`);
  },
  
  createRetailer: (retailerData) => {
    return api.post("/retailers", retailerData);
  },
  
  updateRetailer: (id, retailerData) => {
    return api.put(`/retailers/${id}`, retailerData);
  },
  
  deleteRetailer: (id) => {
    return api.delete(`/retailers/${id}`);
  }
};

// Distributor related API calls
const distributorService = {
  getDistributors: (params) => {
    return api.get("/distributors", { params });
  },
  
  getDistributorById: (id) => {
    return api.get(`/distributors/${id}`);
  },
  
  createDistributor: (distributorData) => {
    return api.post("/distributors", distributorData);
  },
  
  updateDistributor: (id, distributorData) => {
    return api.put(`/distributors/${id}`, distributorData);
  },
  
  deleteDistributor: (id) => {
    return api.delete(`/distributors/${id}`);
  }
};

// Visit related API calls
const visitService = {
  getVisits: (params) => {
    return api.get("/visits", { params });
  },
  
  getVisitById: (id) => {
    return api.get(`/visits/${id}`);
  },
  
  scheduleVisit: (visitData) => {
    return api.post("/visits", visitData);
  },
  
  updateVisit: (id, visitData) => {
    return api.put(`/visits/${id}`, visitData);
  },
  
  completeVisit: (id, completionData) => {
    return api.patch(`/visits/${id}/complete`, completionData);
  },
  
  cancelVisit: (id, reason) => {
    return api.patch(`/visits/${id}/cancel`, { reason });
  },
  
  deleteVisit: (id) => {
    return api.delete(`/visits/${id}`);
  }
};

// Collection related API calls
const collectionService = {
  getCollections: (params) => {
    return api.get("/collections", { params });
  },
  
  getCollectionById: (id) => {
    return api.get(`/collections/${id}`);
  },
  
  recordCollection: (collectionData) => {
    return api.post("/collections", collectionData);
  },
  
  updateCollection: (id, collectionData) => {
    return api.put(`/collections/${id}`, collectionData);
  },
  
  deleteCollection: (id) => {
    return api.delete(`/collections/${id}`);
  }
};

// Inventory related API calls
const inventoryService = {
  getInventory: (params) => {
    return api.get("/inventory", { params });
  },
  
  getStockById: (id) => {
    return api.get(`/inventory/${id}`);
  },
  
  updateStock: (id, stockData) => {
    return api.put(`/inventory/${id}`, stockData);
  },
  
  transferStock: (transferData) => {
    return api.post("/inventory/transfer", transferData);
  }
};

// Scheme related API calls
const schemeService = {
  getSchemes: (params) => {
    return api.get("/schemes", { params });
  },
  
  getSchemeById: (id) => {
    return api.get(`/schemes/${id}`);
  },
  
  createScheme: (schemeData) => {
    return api.post("/schemes", schemeData);
  },
  
  updateScheme: (id, schemeData) => {
    return api.put(`/schemes/${id}`, schemeData);
  },
  
  deleteScheme: (id) => {
    return api.delete(`/schemes/${id}`);
  }
};

// Report related API calls
const reportService = {
  getSalesReport: (params) => {
    return api.get("/reports/sales", { params });
  },
  
  getInventoryReport: (params) => {
    return api.get("/reports/inventory", { params });
  },
  
  getPerformanceReport: (params) => {
    return api.get("/reports/performance", { params });
  },
  
  getCollectionReport: (params) => {
    return api.get("/reports/collections", { params });
  },
  
  exportReport: (type, params) => {
    return api.get(`/reports/${type}/export`, { 
      params,
      responseType: "blob" 
    });
  }
};

// Dashboard related API calls
const dashboardService = {
  getSalesmanDashboard: () => {
    return api.get("/dashboard/salesman");
  },
  
  getDistributorDashboard: () => {
    return api.get("/dashboard/distributor");
  },
  
  getSuperstockistDashboard: () => {
    return api.get("/dashboard/superstockist");
  },
  
  getAdminDashboard: () => {
    return api.get("/dashboard/admin");
  }
};

// Feedback API calls
const feedbackService = {
  getFeedbacks: (params) => {
    return api.get("/feedback", { params });
  },
  
  getFeedbackById: (id) => {
    return api.get(`/feedback/${id}`);
  },
  
  submitFeedback: (feedbackData) => {
    // Use FormData if there are file attachments
    if (feedbackData instanceof FormData) {
      return api.post("/feedback", feedbackData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
    }
    return api.post("/feedback", feedbackData);
  },
  
  updateFeedback: (id, feedbackData) => {
    return api.put(`/feedback/${id}`, feedbackData);
  },
  
  deleteFeedback: (id) => {
    return api.delete(`/feedback/${id}`);
  }
};

// Generic error handler for use in catch blocks
const handleApiError = (error) => {
  let errorMessage = "An unexpected error occurred";
  
  if (error.response) {
    // Request was made and server responded with non-2xx status
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = "No response received from server. Please check your connection.";
  } else {
    // Something else happened while setting up the request
    errorMessage = error.message;
  }
  
  return errorMessage;
};

export {
  api,
  authService,
  userService,
  productService,
  orderService,
  retailerService,
  distributorService,
  visitService,
  collectionService,
  inventoryService,
  schemeService,
  reportService,
  dashboardService,
  feedbackService,
  handleApiError
};