/**
 * Debug Helper Utilities
 * Helps debug API calls and authentication issues
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { getApiBaseUrl } = require('../config/api.config');

/**
 * Log API request details
 */
export const logApiRequest = (endpoint, method, data) => {
  if (__DEV__) {
    console.log('\n🔵 ===== API REQUEST =====');
    console.log('📍 Endpoint:', endpoint);
    console.log('🔧 Method:', method);
    console.log('📦 Data:', JSON.stringify(data, null, 2));
    console.log('🕐 Time:', new Date().toISOString());
    console.log('========================\n');
  }
};

/**
 * Log API response details
 */
export const logApiResponse = (endpoint, status, data) => {
  if (__DEV__) {
    console.log('\n🟢 ===== API RESPONSE =====');
    console.log('📍 Endpoint:', endpoint);
    console.log('📊 Status:', status);
    console.log('📦 Data:', JSON.stringify(data, null, 2));
    console.log('🕐 Time:', new Date().toISOString());
    console.log('=========================\n');
  }
};

/**
 * Log API error details
 */
export const logApiError = (endpoint, error) => {
  if (__DEV__) {
    console.log('\n🔴 ===== API ERROR =====');
    console.log('📍 Endpoint:', endpoint);
    console.log('❌ Error:', error.message);
    console.log('📋 Stack:', error.stack);
    console.log('🕐 Time:', new Date().toISOString());
    console.log('=======================\n');
  }
};

/**
 * Log authentication state
 */
export const logAuthState = async () => {
  if (__DEV__) {
    try {
      const token = await AsyncStorage.getItem('@paaso_auth_token');
      const userData = await AsyncStorage.getItem('@paaso_user_data');
      
      console.log('\n🔐 ===== AUTH STATE =====');
      console.log('🎫 Token:', token ? `${token.substring(0, 20)}...` : 'None');
      console.log('👤 User:', userData ? JSON.parse(userData).name : 'None');
      console.log('🕐 Time:', new Date().toISOString());
      console.log('========================\n');
    } catch (error) {
      console.error('Error reading auth state:', error);
    }
  }
};

/**
 * Log storage contents
 */
export const logStorageContents = async () => {
  if (__DEV__) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      
      console.log('\n💾 ===== STORAGE CONTENTS =====');
      items.forEach(([key, value]) => {
        console.log(`📦 ${key}:`, value ? value.substring(0, 100) : 'null');
      });
      console.log('==============================\n');
    } catch (error) {
      console.error('Error reading storage:', error);
    }
  }
};

/**
 * Clear all storage (for testing)
 */
export const clearAllStorage = async () => {
  if (__DEV__) {
    try {
      await AsyncStorage.clear();
      console.log('✅ Storage cleared');
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
    }
  }
};

/**
 * Test backend connection
 */
export const testBackendConnection = async () => {
  if (__DEV__) {
    const baseUrl = getApiBaseUrl();
    const healthUrl = baseUrl.replace('/api', '/health');
    
    console.log('\n🔍 ===== TESTING CONNECTION =====');
    console.log('🌐 Base URL:', baseUrl);
    console.log('❤️ Health URL:', healthUrl);
    
    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      console.log('✅ Connection successful!');
      console.log('📊 Status:', response.status);
      console.log('📦 Response:', data);
      console.log('================================\n');
      
      return { success: true, data };
    } catch (error) {
      console.log('❌ Connection failed!');
      console.log('🔴 Error:', error.message);
      console.log('================================\n');
      
      return { success: false, error: error.message };
    }
  }
};

/**
 * Log network info
 */
export const logNetworkInfo = () => {
  if (__DEV__) {
    const baseUrl = getApiBaseUrl();
    
    console.log('\n🌐 ===== NETWORK INFO =====');
    console.log('📍 API Base URL:', baseUrl);
    console.log('🔧 Environment:', __DEV__ ? 'Development' : 'Production');
    console.log('📱 Platform:', Platform.OS);
    console.log('==========================\n');
  }
};

/**
 * Debug authentication flow
 */
export const debugAuth = async (action, data) => {
  if (__DEV__) {
    console.log('\n🔐 ===== AUTH DEBUG =====');
    console.log('🎬 Action:', action);
    console.log('📦 Data:', JSON.stringify(data, null, 2));
    
    await logAuthState();
    
    console.log('========================\n');
  }
};

/**
 * Measure API call duration
 */
export const measureApiCall = async (apiFunction, ...args) => {
  if (__DEV__) {
    const startTime = Date.now();
    
    try {
      const result = await apiFunction(...args);
      const duration = Date.now() - startTime;
      
      console.log('\n⏱️ ===== API TIMING =====');
      console.log('⚡ Duration:', `${duration}ms`);
      console.log('✅ Success:', result.success);
      console.log('========================\n');
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.log('\n⏱️ ===== API TIMING =====');
      console.log('⚡ Duration:', `${duration}ms`);
      console.log('❌ Failed:', error.message);
      console.log('========================\n');
      
      throw error;
    }
  } else {
    return await apiFunction(...args);
  }
};

/**
 * Pretty print object
 */
export const prettyPrint = (label, obj) => {
  if (__DEV__) {
    console.log(`\n📋 ${label}:`);
    console.log(JSON.stringify(obj, null, 2));
    console.log('');
  }
};

/**
 * Log component lifecycle
 */
export const logLifecycle = (componentName, lifecycle) => {
  if (__DEV__) {
    console.log(`🔄 [${componentName}] ${lifecycle}`);
  }
};

/**
 * Create debug panel data
 */
export const getDebugInfo = async () => {
  if (__DEV__) {
    try {
      const token = await AsyncStorage.getItem('@paaso_auth_token');
      const userData = await AsyncStorage.getItem('@paaso_user_data');
      const baseUrl = getApiBaseUrl();
      
      return {
        apiUrl: baseUrl,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 20)}...` : null,
        user: userData ? JSON.parse(userData) : null,
        environment: __DEV__ ? 'Development' : 'Production',
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  }
  return null;
};

/**
 * Enable verbose logging
 */
let verboseLogging = false;

export const enableVerboseLogging = () => {
  verboseLogging = true;
  console.log('✅ Verbose logging enabled');
};

export const disableVerboseLogging = () => {
  verboseLogging = false;
  console.log('❌ Verbose logging disabled');
};

export const isVerboseLogging = () => verboseLogging;

/**
 * Log only if verbose logging is enabled
 */
export const verboseLog = (...args) => {
  if (__DEV__ && verboseLogging) {
    console.log(...args);
  }
};

// Export all utilities
export default {
  logApiRequest,
  logApiResponse,
  logApiError,
  logAuthState,
  logStorageContents,
  clearAllStorage,
  testBackendConnection,
  logNetworkInfo,
  debugAuth,
  measureApiCall,
  prettyPrint,
  logLifecycle,
  getDebugInfo,
  enableVerboseLogging,
  disableVerboseLogging,
  isVerboseLogging,
  verboseLog,
};
