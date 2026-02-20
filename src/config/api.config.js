
// Use typeof check to avoid errors when __DEV__ is not defined
const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

// Backend API URLs - Hybrid Configuration (Local + Render Fallback)
const API_CONFIG = {
  BASE_URL: 'https://passo-backend.onrender.com/api', // Local backend on PC (primary)
  TIMEOUT: 30000, // 30 seconds timeout
  FALLBACK_URLS: [
    'https://passo-backend.onrender.com/api', // Primary local URL
    'https://passo-backend.onrender.com/api', // Fallback to Render production
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
    VERIFY_OTP: '/auth/verify-otp',
    SEND_OTP: '/auth/send-otp',
  },
  WORKER: {
    CHECK_MOBILE: '/worker/check-mobile',
    PROFILE: '/worker/me',
    UPDATE_PROFILE: '/worker/me',
    STATS: '/worker/me/stats',
    STATUS: '/worker/me/status',
    DASHBOARD: '/worker/dashboard',
    LIST: '/worker',
    BY_ID: (id) => `/worker/${id}`,
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
  API_CONFIG,
  getApiBaseUrl,
  ENDPOINTS,
  REQUEST_TIMEOUT,
  STORAGE_KEYS,
  HTTP_STATUS,
};
