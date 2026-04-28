import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ==================== PUBLIC API ====================
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== ADMIN API ====================
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Inject admin key from sessionStorage
adminApi.interceptors.request.use(
  (config) => {
    const adminKey = sessionStorage.getItem('admin_key');
    if (adminKey) {
      config.headers['X-Admin-Key'] = adminKey;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle auth errors globally
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      sessionStorage.removeItem('admin_key');
      // Only reload if on admin page
      if (window.location.pathname.includes('/admin')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

// ==================== PUBLIC ENDPOINTS ====================

/**
 * Create a new donation and initiate M-Pesa STK Push
 */
export const createDonation = (data) => api.post('/donate', data);

/**
 * Get approved public messages for the message wall
 */
export const getPublicMessages = () => api.get('/public-messages');

/**
 * Get current fundraising progress
 */
export const getProgress = () => api.get('/progress');

/**
 * Check the status of a transaction (for polling)
 */
export const checkTransactionStatus = (transactionId) => 
  api.get(`/transaction/${transactionId}`);

// ==================== ADMIN ENDPOINTS ====================

/**
 * Verify admin key is valid
 */
export const verifyAdminKey = (key) => 
  axios.get(`${API_BASE_URL}/admin/verify`, {
    headers: { 'X-Admin-Key': key },
  });

/**
 * Get all donation messages (public and hidden)
 */
export const getAllMessages = () => adminApi.get('/admin/messages');

/**
 * Approve a message for public display
 */
export const approveMessage = (donationId) => 
  adminApi.patch(`/admin/messages/${donationId}/approve`);

/**
 * Hide a message from public display
 */
export const hideMessage = (donationId) => 
  adminApi.patch(`/admin/messages/${donationId}/hide`);

/**
 * Delete a message and its associated transactions permanently
 */
export const deleteMessage = (donationId) => 
  adminApi.delete(`/admin/messages/${donationId}`);

/**
 * Get all transactions with optional filtering
 * @param {Object} params - { limit, status }
 */
export const getAllTransactions = (params = {}) => 
  adminApi.get('/admin/transactions', { params });

/**
 * Get dashboard statistics
 */
export const getAdminStats = () => adminApi.get('/admin/stats');

/**
 * Update fundraising progress
 */
export const updateProgress = (data) => adminApi.patch('/admin/progress', data);

/**
 * Get current progress (admin version with more details)
 */
export const getAdminProgress = () => adminApi.get('/admin/progress');

export default api;