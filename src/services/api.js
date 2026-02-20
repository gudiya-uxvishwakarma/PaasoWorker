/**
 * API Service - Centralized API communication with Axios
 */

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { getApiBaseUrl, API_CONFIG, STORAGE_KEYS, REQUEST_TIMEOUT } = require('../config/api.config');

// Backend API URL
const API_BASE_URL = getApiBaseUrl();

// Storage keys
const TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
const USER_KEY = STORAGE_KEYS.USER_DATA;

// Fallback URL index
let currentFallbackIndex = 0;

// Create axios instance with fallback support
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT, // 30 seconds for Render cold starts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Retry configuration for Render cold starts
  validateStatus: (status) => {
    return status >= 200 && status < 500; // Don't throw on 4xx errors
  },
});

// Helper function to try fallback URLs
const tryFallbackUrl = async (config, originalError) => {
  if (currentFallbackIndex < API_CONFIG.FALLBACK_URLS.length) {
    const fallbackUrl = API_CONFIG.FALLBACK_URLS[currentFallbackIndex];
    currentFallbackIndex++;
    
    console.log(`🔄 Trying fallback URL ${currentFallbackIndex}/${API_CONFIG.FALLBACK_URLS.length}: ${fallbackUrl}`);
    
    try {
      const response = await axios({
        ...config,
        baseURL: fallbackUrl,
      });
      
      console.log(`✅ Fallback URL ${currentFallbackIndex} succeeded`);
      currentFallbackIndex = 0; // Reset on success
      return response;
    } catch (error) {
      if (currentFallbackIndex < API_CONFIG.FALLBACK_URLS.length) {
        return tryFallbackUrl(config, error);
      }
      throw originalError; // All fallbacks failed
    }
  }
  throw originalError;
};

// Request interceptor - Add auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`🌐 API Request: ${config.method.toUpperCase()} ${config.url}`);
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally with fallback support
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`);
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ Data:`, JSON.stringify(response.data, null, 2));
    currentFallbackIndex = 0; // Reset fallback index on success
    
    // Ensure we always return the data object
    if (response.data) {
      return response.data;
    }
    
    // Fallback if no data
    console.warn('⚠️ Response has no data field');
    return {
      success: false,
      message: 'Empty response from server'
    };
  },
  async (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method
      }
    });
    
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      // List of public endpoints that don't require authentication
      const publicEndpoints = [
        '/workers/check-mobile',
        '/auth/worker/register',
        '/auth/worker/login',
        '/workers/public',
        '/health'
      ];
      
      // Check if current request is to a public endpoint
      const isPublicEndpoint = publicEndpoints.some(endpoint => 
        error.config?.url?.includes(endpoint)
      );
      
      if (status === 401 && !isPublicEndpoint) {
        // Only clear auth for protected endpoints
        console.log('🔒 Session expired - clearing auth data');
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
        throw new Error('SESSION_EXPIRED');
      }
      
      // Preserve full error data for proper error handling
      const errorWithData = new Error(data.message || 'Request failed');
      errorWithData.response = error.response; // Preserve full response
      throw errorWithData;
    } else if (error.request) {
      // Request made but no response - try fallback URLs
      console.error('❌ Network Error - No response received');
      console.error('Request URL:', error.config?.baseURL + error.config?.url);
      
      // Try fallback URLs before giving up
      try {
        return await tryFallbackUrl(error.config, error);
      } catch (fallbackError) {
        console.error('❌ All fallback URLs failed');
        
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please try again.');
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new Error('Cannot connect to server. Please check:\n1. Backend server is running\n2. Your internet connection\n3. API URL is correct');
        }
        
        throw new Error('Network error. Please check your connection.');
      }
    } else {
      // Something else happened
      throw new Error(error.message || 'An error occurred');
    }
  }
);

// ============================================
// STORAGE HELPERS
// ============================================

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

export const setUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// ============================================
// CONNECTION TEST
// ============================================

/**
 * Test backend connection
 */
export const testConnection = async () => {
  try {
    console.log('🔍 Testing backend connection...');
    console.log('📍 API Base URL:', API_BASE_URL);
    
    // Health endpoint is at root level, not under /api
    const healthUrl = API_BASE_URL.replace('/api', '/health');
    console.log('📍 Health Check URL:', healthUrl);
    
    const response = await axios.get(healthUrl, {
      timeout: 10000 // 10 second timeout for health check
    });
    
    console.log('✅ Backend connection successful:', response.data);
    return {
      success: true,
      message: 'Connected to backend',
      data: response.data
    };
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      url: error.config?.url
    });
    return {
      success: false,
      message: error.message,
      error: error.code
    };
  }
};

// ============================================
// AUTH API ENDPOINTS
// ============================================

/**
 * Send OTP to mobile number
 */
export const sendOTP = async (mobile) => {
  try {
    console.log('📱 Sending OTP to:', mobile);
    
    // For demo mode: Accept any mobile and return success
    // In production, this would call backend OTP service
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ OTP sent successfully (Demo mode)');
        resolve({
          success: true,
          message: 'OTP sent successfully',
          otp: '123456', // Demo OTP
        });
      }, 1000);
    });
  } catch (error) {
    console.error('❌ Send OTP Error:', error);
    throw error;
  }
};

/**
 * Check if mobile number is registered
 */
export const checkMobile = async (mobile) => {
  try {
    console.log('📞 Checking mobile:', mobile);
    console.log('🌐 API Base URL:', API_BASE_URL);
    console.log('🌐 Full URL:', `${API_BASE_URL}/workers/check-mobile`);
    
    const response = await axiosInstance.post('/workers/check-mobile', { mobile });
    
    console.log('✅ Check mobile response:', JSON.stringify(response, null, 2));
    console.log('✅ Response type:', typeof response);
    console.log('✅ Response keys:', Object.keys(response || {}));
    
    // Ensure response has expected structure
    if (!response) {
      throw new Error('No response received from server');
    }
    
    if (typeof response.success === 'undefined') {
      console.warn('⚠️ Response missing success field:', response);
      // Try to handle malformed response
      return {
        success: false,
        exists: false,
        worker: null,
        message: 'Invalid response from server'
      };
    }
    
    return response;
  } catch (error) {
    console.error('❌ Check Mobile Error:', error);
    console.error('❌ Error type:', error.constructor.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Verify OTP and check registration
 */
export const verifyOTP = async (mobile, otp) => {
  try {
    console.log('🔐 Verifying OTP:', otp, 'for mobile:', mobile);
    
    // For demo mode: Accept any 6-digit OTP
    if (otp.length !== 6) {
      throw new Error('Invalid OTP format');
    }
    
    console.log('✅ OTP format valid, checking mobile registration...');
    
    // Check if mobile is registered in backend
    const response = await checkMobile(mobile);
    
    console.log('📦 Mobile check result:', response);
    
    return {
      success: true,
      isRegistered: response.exists,
      worker: response.worker || null,
    };
  } catch (error) {
    console.error('❌ Verify OTP Error:', error);
    throw error;
  }
};

/**
 * Complete OTP verification flow with backend validation
 */
export const verifyOTPWithBackend = async (mobile, otp) => {
  try {
    console.log('🔐 Starting OTP verification flow...');
    console.log('📱 Mobile:', mobile);
    console.log('🔢 OTP:', otp);
    
    // Step 1: Validate OTP format
    if (!otp || otp.length !== 6) {
      throw new Error('Please enter a valid 6-digit OTP');
    }
    
    // Step 2: Check mobile in backend
    console.log('📞 Checking mobile in backend...');
    const mobileCheck = await checkMobile(mobile);
    
    if (!mobileCheck.success) {
      throw new Error('Failed to verify mobile number');
    }
    
    console.log('✅ Mobile verification complete');
    console.log('📊 User exists:', mobileCheck.exists);
    
    // Step 3: Return verification result
    return {
      success: true,
      verified: true,
      isRegistered: mobileCheck.exists,
      worker: mobileCheck.worker,
      message: mobileCheck.exists ? 'User found' : 'New user',
    };
  } catch (error) {
    console.error('❌ OTP Verification Flow Error:', error);
    throw error;
  }
};

/**
 * Worker login with mobile and password
 */
export const workerLogin = async (mobile, password) => {
  try {
    console.log('🔐 Worker login attempt:', mobile);
    const response = await axiosInstance.post('/auth/worker/login', {
      mobile,
      password,
    });

    console.log('✅ Login response:', response);

    if (response.success && response.token) {
      console.log('💾 Saving auth token and user data');
      await setAuthToken(response.token);
      await setUserData(response.worker);
    }

    return response;
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
    console.log('📤 Registering new worker...');
    console.log('📦 Worker data:', JSON.stringify(workerData, null, 2));
    
    // Map frontend workerType to backend enum
    const workerTypeMap = {
      individual: 'Worker',
      crew_leader: 'Crew / Team',
      contractor: 'Contractor',
      service_provider: 'Service Provider',
    };

    // Prepare data for backend - send exactly what backend expects
    const mappedData = {
      name: workerData.name,
      mobile: workerData.mobile,
      password: workerData.password,
      email: workerData.email || '',
      workerType: workerTypeMap[workerData.workerType] || workerData.workerType || 'Worker',
      category: Array.isArray(workerData.category) 
        ? workerData.category 
        : [workerData.category || 'General'],
      serviceArea: workerData.serviceArea || '',
      city: workerData.city || '',
      languages: workerData.languages || [],
      teamSize: workerData.teamSize || 1,
      gstNumber: workerData.gstNumber || '',
      msmeNumber: workerData.msmeNumber || '',
      onboardingFee: workerData.onboardingFee || '',
      availability: workerData.availability || 'online',
      online: workerData.online !== undefined ? workerData.online : true,
      // Documents
      profilePhoto: workerData.profilePhoto || null,
      aadhaarDoc: workerData.aadhaarDoc || null,
      panCard: workerData.panCard || null,
      paymentScreenshot: workerData.paymentScreenshot || null,
    };

    console.log('📦 Mapped data for backend:', JSON.stringify(mappedData, null, 2));

    const response = await axiosInstance.post('/auth/worker/register', mappedData);
    
    console.log('✅ Registration successful:', response);
    
    // Don't save token for pending workers - they need admin approval
    // Token will be provided after login once approved
    
    return response;
  } catch (error) {
    console.error('❌ Worker Registration Error:', error);
    console.error('Error Response:', error.response?.data);
    console.error('Error Status:', error.response?.status);
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
    console.log('👤 Fetching worker profile...');
    const response = await axiosInstance.get('/workers/me');
    
    console.log('✅ Profile fetched:', response);
    
    if (response.success && response.worker) {
      await setUserData(response.worker);
    }

    return response;
  } catch (error) {
    console.error('❌ Get Worker Profile Error:', error);
    throw error;
  }
};

/**
 * Update worker profile
 */
export const updateWorkerProfile = async (updates) => {
  try {
    const response = await axiosInstance.put('/workers/me', updates);
    
    if (response.success && response.worker) {
      await setUserData(response.worker);
    }

    return response;
  } catch (error) {
    console.error('Update Worker Profile Error:', error);
    throw error;
  }
};

/**
 * Update worker online status
 */
export const updateOnlineStatus = async (isOnline) => {
  try {
    const response = await axiosInstance.put('/workers/me/status', {
      online: isOnline,
    });
    return response;
  } catch (error) {
    console.error('Update Online Status Error:', error);
    throw error;
  }
};

/**
 * Update worker availability status (online/busy/offline)
 */
export const updateAvailabilityStatus = async (status) => {
  try {
    const isOnline = status === 'online';
    const response = await axiosInstance.put('/workers/me/status', {
      availability: status,
      online: isOnline,
    });
    return response;
  } catch (error) {
    console.error('Update Availability Status Error:', error);
    throw error;
  }
};

/**
 * Get worker stats
 */
export const getWorkerStats = async () => {
  try {
    const response = await axiosInstance.get('/workers/me/stats');
    return response;
  } catch (error) {
    console.error('Get Worker Stats Error:', error);
    throw error;
  }
};

/**
 * Get worker dashboard data
 */
export const getDashboardData = async () => {
  try {
    console.log('📊 Fetching dashboard data...');
    const response = await axiosInstance.get('/workers/dashboard');
    console.log('✅ Dashboard data:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Dashboard Data Error:', error);
    throw error;
  }
};

/**
 * Get all workers with filters
 */
export const getWorkers = async (filters = {}) => {
  try {
    const response = await axiosInstance.get('/workers', { params: filters });
    return response;
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
    const response = await axiosInstance.get(`/workers/${workerId}`);
    return response;
  } catch (error) {
    console.error('Get Worker By ID Error:', error);
    throw error;
  }
};

/**
 * Update worker subscription
 */
export const updateSubscription = async (plan) => {
  try {
    const response = await axiosInstance.put('/workers/me/subscription', { plan });
    return response;
  } catch (error) {
    console.error('Update Subscription Error:', error);
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

    const response = await axiosInstance.post('/workers/me/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Upload Document Error:', error);
    throw error;
  }
};

/**
 * Get worker reviews
 */
export const getWorkerReviews = async () => {
  try {
    const response = await axiosInstance.get('/workers/me/reviews');
    return response;
  } catch (error) {
    console.error('Get Worker Reviews Error:', error);
    throw error;
  }
};

/**
 * Get worker notifications
 */
export const getWorkerNotifications = async (workerId) => {
  try {
    console.log('📬 Fetching notifications for worker:', workerId);
    const response = await axiosInstance.get('/notifications/worker', {
      params: { workerId }
    });
    console.log('✅ Notifications fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Notifications Error:', error);
    throw error;
  }
};

/**
 * Get active banners
 */
export const getActiveBanners = async () => {
  try {
    console.log('🎨 Fetching active banners...');
    const response = await axiosInstance.get('/notifications/banners/active');
    console.log('✅ Banners fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Banners Error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markNotificationRead = async (notificationId, workerId) => {
  try {
    console.log('✅ Marking notification as read:', notificationId);
    const response = await axiosInstance.post('/notifications/mark-read', {
      notificationId,
      workerId
    });
    console.log('✅ Notification marked as read:', response);
    return response;
  } catch (error) {
    console.error('❌ Mark Notification Read Error:', error);
    throw error;
  }
};

/**
 * Get subscription plans
 */
export const getSubscriptionPlans = async () => {
  try {
    console.log('💰 Fetching subscription plans...');
    const response = await axiosInstance.get('/pricing/plans');
    console.log('✅ Plans fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Plans Error:', error);
    throw error;
  }
};

/**
 * Get add-ons
 */
export const getAddOns = async () => {
  try {
    console.log('⚡ Fetching add-ons...');
    const response = await axiosInstance.get('/pricing/addons');
    console.log('✅ Add-ons fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Add-ons Error:', error);
    throw error;
  }
};

/**
 * Get CMS content by type
 */
export const getCMSContent = async (type) => {
  try {
    console.log('📄 Fetching CMS content for type:', type);
    const response = await axiosInstance.get(`/cms/${type}`);
    console.log('✅ CMS content fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get CMS Content Error:', error);
    throw error;
  }
};

/**
 * Get notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    console.log('🔔 Fetching notification preferences...');
    const response = await axiosInstance.get('/workers/me/notification-preferences');
    console.log('✅ Notification preferences fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Notification Preferences Error:', error);
    throw error;
  }
};

/**
 * Update notification preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    console.log('🔔 Updating notification preferences...');
    const response = await axiosInstance.put('/workers/me/notification-preferences', preferences);
    console.log('✅ Notification preferences updated:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Notification Preferences Error:', error);
    throw error;
  }
};

/**
 * Get privacy settings
 */
export const getPrivacySettings = async () => {
  try {
    console.log('🔒 Fetching privacy settings...');
    const response = await axiosInstance.get('/workers/me/privacy-settings');
    console.log('✅ Privacy settings fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Privacy Settings Error:', error);
    throw error;
  }
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (settings) => {
  try {
    console.log('🔒 Updating privacy settings...');
    const response = await axiosInstance.put('/workers/me/privacy-settings', settings);
    console.log('✅ Privacy settings updated:', response);
    return response;
  } catch (error) {
    console.error('❌ Update Privacy Settings Error:', error);
    throw error;
  }
};

// ============================================
// TRANSACTION API ENDPOINTS
// ============================================

/**
 * Get worker transactions
 */
export const getWorkerTransactions = async () => {
  try {
    console.log('💰 Fetching worker transactions...');
    const response = await axiosInstance.get('/transactions/me');
    console.log('✅ Transactions fetched:', response);
    return response;
  } catch (error) {
    console.error('❌ Get Transactions Error:', error);
    throw error;
  }
};

/**
 * Create subscription transaction
 */
export const createSubscriptionTransaction = async (plan, duration, amount) => {
  try {
    console.log('💳 Creating subscription transaction...');
    const response = await axiosInstance.post('/transactions/subscription', {
      plan,
      duration,
      amount
    });
    console.log('✅ Transaction created:', response);
    return response;
  } catch (error) {
    console.error('❌ Create Subscription Transaction Error:', error);
    throw error;
  }
};

/**
 * Confirm subscription payment
 */
export const confirmSubscriptionPayment = async (transactionId, paymentDetails) => {
  try {
    console.log('✅ Confirming subscription payment...');
    const response = await axiosInstance.post('/transactions/subscription/confirm', {
      transactionId,
      ...paymentDetails
    });
    console.log('✅ Payment confirmed:', response);
    return response;
  } catch (error) {
    console.error('❌ Confirm Payment Error:', error);
    throw error;
  }
};

/**
 * Create featured listing transaction
 */
export const createFeaturedTransaction = async (plan, duration, amount) => {
  try {
    console.log('⭐ Creating featured listing transaction...');
    const response = await axiosInstance.post('/transactions/featured', {
      plan,
      duration,
      amount
    });
    console.log('✅ Transaction created:', response);
    return response;
  } catch (error) {
    console.error('❌ Create Featured Transaction Error:', error);
    throw error;
  }
};

// Export all functions
export default {
  // Connection Test
  testConnection,
  
  // Auth
  sendOTP,
  checkMobile,
  verifyOTP,
  verifyOTPWithBackend,
  workerLogin,
  registerWorker,
  logout,
  
  // Worker Management
  getWorkerProfile,
  updateWorkerProfile,
  updateOnlineStatus,
  updateAvailabilityStatus,
  getWorkerStats,
  getDashboardData,
  getWorkers,
  getWorkerById,
  updateSubscription,
  uploadDocument,
  
  // Reviews
  getWorkerReviews,
  
  // Notifications
  getWorkerNotifications,
  getActiveBanners,
  markNotificationRead,
  getNotificationPreferences,
  updateNotificationPreferences,
  
  // Privacy
  getPrivacySettings,
  updatePrivacySettings,
  
  // Transactions
  getWorkerTransactions,
  createSubscriptionTransaction,
  confirmSubscriptionPayment,
  createFeaturedTransaction,
  
  // Pricing
  getSubscriptionPlans,
  getAddOns,
  
  // CMS
  getCMSContent,
  
  // Storage
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserData,
  setUserData,
  removeUserData,
};
