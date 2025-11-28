import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optional: Redirect to login page or reload
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/me"),
  logout: () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Return promise for consistency with other methods
    return Promise.resolve({ message: "Logged out successfully" });
  }
};

// Book API methods
export const bookAPI = {
  getAll: (filters = {}) => api.get("/books", { params: filters }),
  getStats: () => api.get("/stats"),
  create: (bookData) => api.post("/books", bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData), // ADDED: Missing update method
  delete: (id) => api.delete(`/books/${id}`),
  borrow: (id, borrowerData) => api.post(`/books/${id}/borrow`, borrowerData),
  return: (id) => api.post(`/books/${id}/return`),
  payPenalty: (id, paymentData) => api.post(`/books/${id}/pay-penalty`, paymentData), // UPDATED: Added paymentData parameter
  getMyBorrowed: () => api.get("/books/my-borrowed"), // ADDED: Get user's borrowed books
  getMyUnpaidPenalties: () => api.get("/books/my-unpaid-penalties"), // ADDED: Get user's unpaid penalties
};

// Payment API methods - ADDED: New payment methods
export const paymentAPI = {
  getMethods: () => api.get("/payment/methods"),
  getHistory: () => api.get("/payments/history"),
};

// Admin API methods - ADDED: New admin methods
export const adminAPI = {
  // User Management
  getUsers: (filters = {}) => api.get("/admin/users", { params: filters }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  createUser: (userData) => api.post("/admin/users", userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  resetPassword: (userId, newPassword) => api.post(`/admin/users/${userId}/reset-password`, { newPassword }),
  getUserStats: () => api.get("/admin/users-stats"),
  
  // Existing admin methods
  getUnpaidPenalties: () => api.get("/admin/unpaid-penalties"),
  markPenaltyPaid: (id, paymentData) => api.post(`/admin/books/${id}/mark-penalty-paid`, paymentData),
};

export const healthCheck = () => api.get("/health");

// Export a utility function for logout that can be used anywhere - ADDED
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  
  // Clear any axios authorization header
  delete api.defaults.headers.common['Authorization'];
  
  // Optional: Redirect to home page
  window.location.href = "/";
};

export default api;