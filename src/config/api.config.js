
// Use typeof check to avoid errors when __DEV__ is not defined
const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

// Backend API URLs - Local Development (for testing)
// Use WiFi IP for physical device, 10.0.2.2 for Android Emulator
const API_BASE_URL = 'https://passo-backend.onrender.com/api'; // Physical device on same WiFi
// const API_BASE_URL = 'http://10.0.2.2:5000/api'; // Android Emulator
// const API_BASE_URL = 'https://passo-backend.onrender.com/api'; // Render Production

console.log('🔧 API Configuration:');
console.log('📍 Using Backend:', API_BASE_URL);

// Backend API Configuration
const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  FALLBACK_URLS: [
    'https://passo-backend.onrender.com/api',
  ],
};

// Get current API base URL
const getApiBaseUrl = () => {
  return API_CONFIG.BASE_URL;
};

// API Endpoints
const ENDPOINTS = {
  AUTH: {
    WORKER_LOGIN: '/auth/worker/login',
    WORKER_REGISTER: '/auth/worker/register',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/workers/verify-otp',
    SEND_OTP: '/workers/send-otp',
  },
  WORKER: {
    CHECK_MOBILE: '/workers/check-mobile',
    PROFILE: '/worker/me',
    UPDATE_PROFILE: '/worker/me',
    STATS: '/worker/me/stats',
    STATUS: '/worker/me/status',
    DASHBOARD: '/worker/dashboard',
    LIST: '/workers',
    BY_ID: (id) => `/workers/${id}`,
    PUBLIC: '/workers/public',
    FCM_TOKEN: '/workers/fcm-token',
  },
  REVIEWS: {
    LIST: '/worker/me/reviews',
  },
};

// Request timeout (in milliseconds)
const REQUEST_TIMEOUT = API_CONFIG.TIMEOUT;

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: '@paaso_auth_token',
  USER_DATA: '@paaso_user_data',
  LANGUAGE: '@paaso_language',
  ONBOARDING_COMPLETE: '@paaso_onboarding_complete',
};

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Export using CommonJS for React Native compatibility
module.exports = {
  IS_DEV,
  API_BASE_URL,
  API_CONFIG,
  getApiBaseUrl,
  ENDPOINTS,
  REQUEST_TIMEOUT,
  STORAGE_KEYS,
  HTTP_STATUS,
};
