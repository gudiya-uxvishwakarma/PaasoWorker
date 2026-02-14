/**
 * API Configuration
 * Update these values based on your environment
 */

// Determine if running in development mode
// Use typeof check to avoid errors when __DEV__ is not defined
const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

// Backend API URLs
const API_CONFIG = {
  // Local backend (port 5000)
  local: {
    baseURL: 'http://10.0.2.2:5000/api', // Android Emulator
    // baseURL: 'http://localhost:5000/api', // iOS Simulator
    // baseURL: 'http://192.168.1.100:5000/api', // Physical Device (replace with your IP)
  },
  // Render production backend
  render: {
    baseURL: 'https://passo-backend.onrender.com/api',
  },
};

// Get current API base URL
const getApiBaseUrl = () => {
  // ⚙️ CHANGE THIS TO SWITCH BETWEEN LOCAL AND RENDER
  
  // Option 1: Use Local backend (Development) - CURRENTLY ACTIVE
  return API_CONFIG.local.baseURL;
  
  // Option 2: Use Render backend (Production)
  // return API_CONFIG.render.baseURL;
  
  // Option 3: Auto switch based on __DEV__
  // return IS_DEV ? API_CONFIG.local.baseURL : API_CONFIG.render.baseURL;
};

// API Endpoints
const ENDPOINTS = {
  // Auth
  AUTH: {
    WORKER_LOGIN: '/auth/worker/login',
    WORKER_REGISTER: '/auth/worker/register',
    LOGOUT: '/auth/logout',
  },
  
  // Workers
  WORKERS: {
    CHECK_MOBILE: '/workers/check-mobile',
    PROFILE: '/workers/me',
    UPDATE_PROFILE: '/workers/me',
    STATS: '/workers/me/stats',
    STATUS: '/workers/me/status',
    DASHBOARD: '/workers/dashboard',
    LIST: '/workers',
    BY_ID: (id) => `/workers/${id}`,
  },
  
  // Bookings
  BOOKINGS: {
    LIST: '/workers/bookings',
    UPDATE: (id) => `/workers/bookings/${id}`,
  },
  
  // Reviews
  REVIEWS: {
    LIST: '/workers/me/reviews',
  },
  
  // Earnings
  EARNINGS: {
    GET: '/workers/me/earnings',
  },
};

// Request timeout (in milliseconds)
const REQUEST_TIMEOUT = 5000; // 5 seconds

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
