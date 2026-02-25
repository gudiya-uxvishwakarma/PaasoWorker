import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api.config';

/**
 * API Service for backend communication
 * Handles all HTTP requests with Firebase authentication
 */

console.log('🔧 API Configuration:');
console.log('📍 Base URL:', API_BASE_URL);

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add JWT auth token
 * Skip auth for public endpoints
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // List of public endpoints that don't need authentication
      const publicEndpoints = [
        '/workers/send-otp',
        '/workers/verify-otp',
        '/workers/check-mobile',
        '/workers/public',
        '/workers/fcm-token',
        '/auth/worker/login',
        '/auth/worker/register',
        '/admin/workers', // Admin panel endpoints
        '/admin/stats',
        '/admin/notifications',
        '/categories', // ✅ Categories are public
      ];
      
      // Check if this is a public endpoint - match exactly or starts with
      const isPublicEndpoint = publicEndpoints.some(endpoint => {
        const url = config.url || '';
        return url === endpoint || url.startsWith(endpoint + '/') || url.startsWith(endpoint + '?');
      });
      
      if (isPublicEndpoint) {
        console.log('🌐 Public endpoint - no auth required:', config.url);
        // Create completely fresh headers object without any auth
        config.headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        };
        console.log('🔓 Fresh headers created for public endpoint (no Authorization)');
        console.log('📋 Headers:', JSON.stringify(config.headers));
        return config;
      }
      
      // Only add auth token for non-public endpoints
      console.log('🔒 Protected endpoint - adding auth token:', config.url);
      
      // Try to get JWT token first (from OTP verification)
      let token = await AsyncStorage.getItem('authToken');
      
      // If no JWT token, try userAuth
      if (!token) {
        const userAuth = await AsyncStorage.getItem('userAuth');
        if (userAuth) {
          const parsed = JSON.parse(userAuth);
          token = parsed.token;
        }
      }
      
      // If still no token, try Firebase token (fallback)
      if (!token) {
        const authData = await AsyncStorage.getItem('firebaseAuth');
        if (authData) {
          const { idToken } = JSON.parse(authData);
          token = idToken;
        }
      }
      
      if (token) {
        // Add token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Added auth token to request');
      } else {
        console.log('⚠️ No auth token available for protected endpoint');
      }
    } catch (error) {
      console.error('❌ Error in request interceptor:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for error handling
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error:', error.response.status, error.response.data);
      
      // Handle token expiration
      if (error.response.status === 401) {
        console.log('🔄 Token expired, clearing auth data');
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('firebaseAuth');
        await AsyncStorage.removeItem('userAuth');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network Error: No response from server');
    } else {
      // Error in request setup
      console.error('❌ Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Send OTP to mobile number
 * @param {string} mobile - 10-digit mobile number
 * @returns {Promise<object>} - Response with OTP
 */
export const sendOTP = async (mobile) => {
  try {
    console.log('📱 Sending OTP request for:', mobile);
    console.log('🌐 API URL:', `${API_BASE_URL}/workers/send-otp`);
    console.log('🔓 This is a PUBLIC endpoint - no auth required');
    
    const response = await api.post('/workers/send-otp', { mobile });
    
    console.log('✅ OTP sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Send OTP error details:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Request URL:', error.config?.url);
    console.error('Base URL:', error.config?.baseURL);
    console.error('Request headers:', error.config?.headers);
    
    // Provide user-friendly error messages
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        message: 'Request timeout. Please check your internet connection.'
      };
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      return {
        success: false,
        message: 'Network error. Please check if backend server is running.'
      };
    } else if (error.response?.status === 404) {
      return {
        success: false,
        message: 'API endpoint not found. Please check backend configuration.'
      };
    } else if (error.response?.status === 401) {
      console.error('⚠️ 401 Error on PUBLIC endpoint - this should not happen!');
      console.error('⚠️ Check if Authorization header is being added incorrectly');
      return {
        success: false,
        message: 'Authentication error on public endpoint. Configuration issue.'
      };
    } else if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message
      };
    } else {
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  }
};

/**
 * Verify OTP
 * @param {string} mobile - 10-digit mobile number
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<object>} - Response with user data
 */
export const verifyOTP = async (mobile, otp, fcmToken = null, platform = null, deviceInfo = null) => {
  try {
    console.log('🔐 Verifying OTP for:', mobile);
    
    const payload = { mobile, otp };
    
    // Add FCM token if provided
    if (fcmToken) {
      payload.fcmToken = fcmToken;
      payload.platform = platform || 'android';
      payload.deviceInfo = deviceInfo || {};
      console.log('📱 Including FCM token in OTP verification');
    }
    
    const response = await api.post('/workers/verify-otp', payload);
    
    console.log('✅ OTP verified successfully');
    return response.data;
  } catch (error) {
    console.error('❌ Verify OTP error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

/**
 * Check if mobile number exists in database
 * @param {string} mobile - Mobile number (10 digits)
 * @returns {Promise<object>} - Response with exists flag and worker data
 */
export const checkMobile = async (mobile) => {
  try {
    console.log('📞 Checking mobile:', mobile);
    const response = await api.post('/workers/check-mobile', { mobile });
    return response.data;
  } catch (error) {
    console.error('❌ Check mobile error:', error);
    throw error;
  }
};

/**
 * Register new worker
 * @param {object} workerData - Worker registration data
 * @returns {Promise<object>} - Created worker data
 */
export const registerWorker = async (workerData) => {
  try {
    console.log('📝 Registering worker:', workerData.name);
    console.log('📍 API Endpoint: /auth/worker/register');
    console.log('📦 Sending data:', JSON.stringify(workerData, null, 2));
    
    const response = await api.post('/auth/worker/register', workerData);
    
    console.log('✅ Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Register worker error:', error.response?.data || error.message);
    console.error('❌ Error details:', error.response?.status, error.response?.statusText);
    throw error;
  }
};

/**
 * Update worker profile
 * @param {string} workerId - Worker ID
 * @param {object} updates - Profile updates
 * @returns {Promise<object>} - Updated worker data
 */
export const updateWorker = async (workerId, updates) => {
  try {
    console.log('📝 Updating worker:', workerId);
    const response = await api.put(`/workers/${workerId}`, updates);
    return response.data;
  } catch (error) {
    console.error('❌ Update worker error:', error);
    throw error;
  }
};

/**
 * Get worker by ID
 * @param {string} workerId - Worker ID
 * @returns {Promise<object>} - Worker data
 */
export const getWorker = async (workerId) => {
  try {
    console.log('🔍 Getting worker:', workerId);
    const response = await api.get(`/workers/${workerId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Get worker error:', error);
    throw error;
  }
};

/**
 * Get all workers (public)
 * @param {object} filters - Filter options
 * @returns {Promise<object>} - Workers list
 */
export const getWorkers = async (filters = {}) => {
  try {
    console.log('🔍 Getting workers with filters:', filters);
    const response = await api.get('/workers/public', { params: filters });
    return response.data;
  } catch (error) {
    console.error('❌ Get workers error:', error);
    throw error;
  }
};

/**
 * Update worker availability status
 * @param {string} workerId - Worker ID
 * @param {string} availability - Availability status (online/busy/offline)
 * @returns {Promise<object>} - Updated status
 */
export const updateAvailability = async (workerId, availability) => {
  try {
    console.log('📝 Updating availability:', workerId, availability);
    
    // Set online status based on availability
    // online: true for 'online' and 'busy'
    // online: false only for 'offline'
    const isOnline = availability === 'online' || availability === 'busy';
    
    const response = await api.put(`/workers/${workerId}`, { 
      availability,
      online: isOnline
    });
    
    console.log('✅ Availability updated:', { availability, online: isOnline });
    
    return response.data;
  } catch (error) {
    console.error('❌ Update availability error:', error);
    throw error;
  }
};

/**
 * Register FCM token for push notifications
 * @param {string} userId - User ID
 * @param {string} fcmToken - FCM token
 * @param {string} platform - Platform (android/ios)
 * @returns {Promise<object>} - Success response
 */
export const registerFCMToken = async (userId, fcmToken, platform = 'android') => {
  try {
    console.log('📱 Registering FCM token for user:', userId);
    const response = await api.post('/workers/fcm-token', {
      userId,
      fcmToken,
      platform
    });
    return response.data;
  } catch (error) {
    console.error('❌ Register FCM token error:', error);
    throw error;
  }
};

/**
 * Upload profile photo
 * @param {string} workerId - Worker ID
 * @param {object} imageData - Image data (uri, type, name)
 * @returns {Promise<object>} - Upload response with URL
 */
export const uploadProfilePhoto = async (workerId, imageData) => {
  try {
    console.log('📸 Uploading profile photo for worker:', workerId);
    
    const formData = new FormData();
    formData.append('photo', {
      uri: imageData.uri,
      type: imageData.type || 'image/jpeg',
      name: imageData.name || 'profile.jpg'
    });
    
    const response = await api.post(`/workers/${workerId}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Upload photo error:', error);
    throw error;
  }
};

/**
 * Upload KYC documents
 * @param {string} workerId - Worker ID
 * @param {object} documents - KYC documents (aadhar, pan, etc.)
 * @returns {Promise<object>} - Upload response
 */
export const uploadKYCDocuments = async (workerId, documents) => {
  try {
    console.log('📄 Uploading KYC documents for worker:', workerId);
    
    const formData = new FormData();
    
    if (documents.aadhar) {
      formData.append('aadhar', {
        uri: documents.aadhar.uri,
        type: documents.aadhar.type || 'image/jpeg',
        name: documents.aadhar.name || 'aadhar.jpg'
      });
    }
    
    if (documents.pan) {
      formData.append('pan', {
        uri: documents.pan.uri,
        type: documents.pan.type || 'image/jpeg',
        name: documents.pan.name || 'pan.jpg'
      });
    }
    
    const response = await api.post(`/workers/${workerId}/kyc`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Upload KYC error:', error);
    throw error;
  }
};

export default api;


/**
 * Get worker notifications
 * @param {string} workerId - Worker ID
 * @returns {Promise<object>} - Notifications list
 */
export const getWorkerNotifications = async (workerId) => {
  try {
    console.log('🔔 Fetching notifications for worker:', workerId);
    const response = await api.get(`/workers/${workerId}/notifications`);
    console.log('✅ Notifications fetched:', response.data.notifications?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Get notifications error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} workerId - Worker ID
 * @returns {Promise<object>} - Success response
 */
export const markNotificationRead = async (notificationId, workerId) => {
  try {
    console.log('✅ Marking notification as read:', notificationId);
    const response = await api.put(`/workers/${workerId}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('❌ Mark notification read error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get all categories from backend
 * @param {boolean} activeOnly - Get only active categories
 * @returns {Promise<object>} - Categories list
 */
export const getCategories = async (activeOnly = true) => {
  try {
    console.log('📂 Fetching categories from backend');
    const params = activeOnly ? { active: 'true' } : {};
    const response = await api.get('/categories', { params });
    console.log('✅ Categories fetched:', response.data.data?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Get categories error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get notification preferences
 * @returns {Promise<object>} - Notification preferences
 */
export const getNotificationPreferences = async () => {
  try {
    console.log('🔔 Fetching notification preferences');
    const response = await api.get('/workers/me/notification-preferences');
    return response.data;
  } catch (error) {
    console.error('❌ Get preferences error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update notification preferences
 * @param {object} preferences - Notification preferences
 * @returns {Promise<object>} - Updated preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  try {
    console.log('🔔 Updating notification preferences');
    const response = await api.put('/workers/me/notification-preferences', preferences);
    return response.data;
  } catch (error) {
    console.error('❌ Update preferences error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get privacy settings
 * @returns {Promise<object>} - Privacy settings
 */
export const getPrivacySettings = async () => {
  try {
    console.log('🔒 Fetching privacy settings');
    const response = await api.get('/workers/me/privacy-settings');
    return response.data;
  } catch (error) {
    console.error('❌ Get privacy settings error:', error.response?.data || error.message);
    return { success: false, settings: {} };
  }
};

/**
 * Update privacy settings
 * @param {object} settings - Privacy settings
 * @returns {Promise<object>} - Updated settings
 */
export const updatePrivacySettings = async (settings) => {
  try {
    console.log('🔒 Updating privacy settings');
    const response = await api.put('/workers/me/privacy-settings', settings);
    return response.data;
  } catch (error) {
    console.error('❌ Update privacy settings error:', error.response?.data || error.message);
    return { success: false };
  }
};

/**
 * Get CMS content (Terms, Privacy, Help, etc.)
 * @param {string} type - Content type (terms, privacy, help, about, consent)
 * @returns {Promise<object>} - CMS content
 */
export const getCMSContent = async (type) => {
  try {
    console.log('📄 Fetching CMS content for type:', type);
    const response = await api.get(`/cms/${type}`);
    return response.data;
  } catch (error) {
    console.error('❌ Get CMS content error:', error.response?.data || error.message);
    return { 
      success: false, 
      content: {
        type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Content`,
        content: 'Content will be available soon.',
        version: '1.0'
      }
    };
  }
};

/**
 * Download worker data (GDPR compliance)
 * @returns {Promise<object>} - Worker data export
 */
export const downloadWorkerData = async () => {
  try {
    console.log('📥 Downloading worker data');
    const response = await api.get('/workers/me/download-data');
    return response.data;
  } catch (error) {
    console.error('❌ Download data error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get subscription plans
 * @returns {Promise<object>} - Subscription plans list
 */
export const getSubscriptionPlans = async () => {
  try {
    console.log('💰 Fetching subscription plans');
    const response = await api.get('/pricing/plans');
    console.log('✅ Plans fetched:', response.data.plans?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Get subscription plans error:', error.response?.data || error.message);
    return { success: false, plans: [] };
  }
};

/**
 * Get add-ons (featured listings, badges, etc.)
 * @returns {Promise<object>} - Add-ons list
 */
export const getAddOns = async () => {
  try {
    console.log('⚡ Fetching add-ons');
    const response = await api.get('/pricing/addons');
    console.log('✅ Add-ons fetched:', response.data.addons?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Get add-ons error:', error.response?.data || error.message);
    return { success: false, addons: [] };
  }
};

/**
 * Get worker transactions
 * @returns {Promise<object>} - Transactions list
 */
export const getWorkerTransactions = async () => {
  try {
    console.log('💳 Fetching worker transactions');
    const response = await api.get('/transactions/me');
    console.log('✅ Transactions fetched:', response.data.transactions?.length || 0);
    return response.data;
  } catch (error) {
    console.error('❌ Get transactions error:', error.response?.data || error.message);
    return { success: false, transactions: [] };
  }
};

/**
 * Create subscription transaction
 * @param {string} plan - Plan name
 * @param {string} billingCycle - Billing cycle (monthly/yearly)
 * @param {number} amount - Amount
 * @returns {Promise<object>} - Transaction data
 */
export const createSubscriptionTransaction = async (plan, billingCycle, amount) => {
  try {
    console.log('💳 Creating subscription transaction');
    const response = await api.post('/transactions/subscription', {
      plan,
      billingCycle,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('❌ Create subscription transaction error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create featured listing transaction
 * @param {string} addonName - Add-on name
 * @param {string} duration - Duration (weekly/monthly)
 * @param {number} amount - Amount
 * @returns {Promise<object>} - Transaction data
 */
export const createFeaturedTransaction = async (addonName, duration, amount) => {
  try {
    console.log('⭐ Creating featured transaction');
    const response = await api.post('/transactions/featured', {
      addonName,
      duration,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('❌ Create featured transaction error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Upload document for verification
 * @param {string} documentType - Document type (aadhaar, pan, gst, etc.)
 * @param {object} documentData - Document file data
 * @returns {Promise<object>} - Upload response
 */
export const uploadDocument = async (documentType, documentData) => {
  try {
    console.log('📄 Uploading document:', documentType);
    
    // In production, this would upload to cloud storage
    // For now, simulate successful upload
    const response = {
      success: true,
      message: 'Document uploaded successfully',
      documentUrl: `https://storage.example.com/${documentType}_${Date.now()}.jpg`
    };
    
    console.log('✅ Document uploaded:', response.documentUrl);
    return response;
  } catch (error) {
    console.error('❌ Upload document error:', error);
    throw error;
  }
};

/**
 * Get worker verification status
 * @param {string} workerId - Worker ID
 * @returns {Promise<object>} - Verification status
 */
export const getVerificationStatus = async (workerId) => {
  try {
    console.log('🛡️ Fetching verification status for:', workerId);
    const response = await api.get(`/workers/${workerId}/verification-status`);
    return response.data;
  } catch (error) {
    console.error('❌ Get verification status error:', error.response?.data || error.message);
    return { success: false, status: {} };
  }
};

/**
 * Submit KYC documents for verification
 * @param {string} workerId - Worker ID
 * @param {object} documents - KYC documents
 * @returns {Promise<object>} - Submission response
 */
export const submitKYCDocuments = async (workerId, documents) => {
  try {
    console.log('📋 Submitting KYC documents for worker:', workerId);
    const response = await api.post(`/workers/${workerId}/kyc/submit`, documents);
    return response.data;
  } catch (error) {
    console.error('❌ Submit KYC documents error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Confirm subscription payment
 * @param {string} transactionId - Transaction ID
 * @param {object} paymentDetails - Payment details (razorpay IDs)
 * @returns {Promise<object>} - Confirmation response
 */
export const confirmSubscriptionPayment = async (transactionId, paymentDetails) => {
  try {
    console.log('✅ Confirming subscription payment');
    const response = await api.post('/transactions/subscription/confirm', {
      transactionId,
      ...paymentDetails
    });
    return response.data;
  } catch (error) {
    console.error('❌ Confirm payment error:', error.response?.data || error.message);
    throw error;
  }
};
