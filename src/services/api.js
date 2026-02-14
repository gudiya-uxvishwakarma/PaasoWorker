/**
 * API Service - Centralized API communication
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
const { getApiBaseUrl, STORAGE_KEYS, REQUEST_TIMEOUT } = require('../config/api.config');

// Backend API URL
const API_BASE_URL = getApiBaseUrl();

// Storage keys
const TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
const USER_KEY = STORAGE_KEYS.USER_DATA;

/**
 * Get stored auth token
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Store auth token
 */
export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

/**
 * Remove auth token
 */
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

/**
 * Get stored user data
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Store user data
 */
export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Remove user data
 */
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    // Handle token expiration
    if (response.status === 401 && data.message?.includes('expired')) {
      await removeAuthToken();
      await removeUserData();
      throw new Error('SESSION_EXPIRED');
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ============================================
// AUTH API ENDPOINTS
// ============================================

/**
 * Send OTP to mobile number
 */
export const sendOTP = async (mobile) => {
  // For demo: simulate OTP send
  // In production, implement actual OTP service (Firebase, Twilio, etc.)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'OTP sent successfully',
        otp: '123456', // Remove in production
      });
    }, 1000);
  });
};

/**
 * Verify OTP and login/register worker
 */
export const verifyOTP = async (mobile, otp) => {
  try {
    // Check if worker exists
    const response = await apiRequest('/workers/check-mobile', {
      method: 'POST',
      body: JSON.stringify({ mobile }),
    });

    return {
      success: true,
      isRegistered: response.exists,
      worker: response.worker || null,
    };
  } catch (error) {
    console.error('Verify OTP Error:', error);
    throw error;
  }
};

/**
 * Worker login with mobile and password
 */
export const workerLogin = async (mobile, password) => {
  try {
    console.log('🌐 API: Calling worker login endpoint');
    console.log('📱 Mobile:', mobile);
    console.log('🔗 URL:', `${API_BASE_URL}/auth/worker/login`);
    
    const data = await apiRequest('/auth/worker/login', {
      method: 'POST',
      body: JSON.stringify({ mobile, password }),
    });

    console.log('📦 API Response:', data);

    if (data.success && data.token) {
      console.log('💾 Saving token and user data');
      await setAuthToken(data.token);
      await setUserData(data.worker);
      console.log('✅ Token and user data saved');
    }

    return data;
  } catch (error) {
    console.error('❌ Worker Login Error:', error);
    throw error;
  }
};

/**
 * Register new worker
 */
export const registerWorker = async (workerData) => {
  try {
    const data = await apiRequest('/auth/worker/register', {
      method: 'POST',
      body: JSON.stringify(workerData),
    });

    return data;
  } catch (error) {
    console.error('Worker Registration Error:', error);
    throw error;
  }
};

/**
 * Logout worker
 */
export const logout = async () => {
  try {
    await removeAuthToken();
    await removeUserData();
    
    // Optional: Call backend logout endpoint
    // await apiRequest('/auth/logout', { method: 'POST' });
    
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

// ============================================
// WORKER API ENDPOINTS
// ============================================

/**
 * Get current worker profile
 */
export const getWorkerProfile = async () => {
  try {
    const data = await apiRequest('/workers/me', {
      method: 'GET',
    });

    if (data.success && data.worker) {
      await setUserData(data.worker);
    }

    return data;
  } catch (error) {
    console.error('Get Worker Profile Error:', error);
    throw error;
  }
};

/**
 * Update worker profile
 */
export const updateWorkerProfile = async (updates) => {
  try {
    const data = await apiRequest('/workers/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (data.success && data.worker) {
      await setUserData(data.worker);
    }

    return data;
  } catch (error) {
    console.error('Update Worker Profile Error:', error);
    throw error;
  }
};

/**
 * Get all workers with filters
 */
export const getWorkers = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    return await apiRequest(`/workers?${queryParams}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Workers Error:', error);
    throw error;
  }
};

/**
 * Get worker by ID
 */
export const getWorkerById = async (workerId) => {
  try {
    return await apiRequest(`/workers/${workerId}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Worker By ID Error:', error);
    throw error;
  }
};

/**
 * Update worker online status
 */
export const updateOnlineStatus = async (isOnline) => {
  try {
    return await apiRequest('/workers/me/status', {
      method: 'PUT',
      body: JSON.stringify({ online: isOnline }),
    });
  } catch (error) {
    console.error('Update Online Status Error:', error);
    throw error;
  }
};

/**
 * Update worker subscription
 */
export const updateSubscription = async (plan) => {
  try {
    return await apiRequest('/workers/me/subscription', {
      method: 'PUT',
      body: JSON.stringify({ plan }),
    });
  } catch (error) {
    console.error('Update Subscription Error:', error);
    throw error;
  }
};

/**
 * Get worker stats
 */
export const getWorkerStats = async () => {
  try {
    return await apiRequest('/workers/me/stats', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Worker Stats Error:', error);
    throw error;
  }
};

/**
 * Upload worker document
 */
export const uploadDocument = async (documentType, fileData) => {
  try {
    const formData = new FormData();
    formData.append('document', fileData);
    formData.append('type', documentType);

    return await apiRequest('/workers/me/documents', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Upload Document Error:', error);
    throw error;
  }
};

/**
 * Get worker dashboard data
 */
export const getDashboardData = async () => {
  try {
    return await apiRequest('/workers/dashboard', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Dashboard Data Error:', error);
    throw error;
  }
};

/**
 * Update worker availability (deprecated - use updateOnlineStatus)
 */
export const updateAvailability = async (isAvailable) => {
  try {
    return await updateOnlineStatus(isAvailable);
  } catch (error) {
    console.error('Update Availability Error:', error);
    throw error;
  }
};

/**
 * Get worker bookings
 */
export const getBookings = async (status = 'all') => {
  try {
    return await apiRequest(`/workers/bookings?status=${status}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Bookings Error:', error);
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    return await apiRequest(`/workers/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    throw error;
  }
};

/**
 * Get worker reviews
 */
export const getWorkerReviews = async () => {
  try {
    return await apiRequest('/workers/me/reviews', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Worker Reviews Error:', error);
    throw error;
  }
};

/**
 * Get worker earnings
 */
export const getWorkerEarnings = async (period = 'month') => {
  try {
    return await apiRequest(`/workers/me/earnings?period=${period}`, {
      method: 'GET',
    });
  } catch (error) {
    console.error('Get Worker Earnings Error:', error);
    throw error;
  }
};

export default {
  // Auth
  sendOTP,
  verifyOTP,
  workerLogin,
  registerWorker,
  getWorkerProfile,
  updateWorkerProfile,
  logout,
  
  // Worker Management
  getWorkers,
  getWorkerById,
  updateOnlineStatus,
  updateSubscription,
  getWorkerStats,
  uploadDocument,
  getDashboardData,
  updateAvailability,
  
  // Bookings
  getBookings,
  updateBookingStatus,
  
  // Reviews & Earnings
  getWorkerReviews,
  getWorkerEarnings,
  
  // Token management
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserData,
  setUserData,
  removeUserData,
};
