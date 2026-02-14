/**
 * Authentication Context - Manages user authentication state
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication state from storage
   */
  const initializeAuth = async () => {
    try {
      const [storedToken, storedUser] = await Promise.all([
        api.getAuthToken(),
        api.getUserData(),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        setIsAuthenticated(true);
        
        // Optionally refresh user data from backend
        try {
          const response = await api.getWorkerProfile();
          if (response.success) {
            setUser(response.worker);
          }
        } catch (error) {
          console.log('Could not refresh user data:', error);
        }
      }
    } catch (error) {
      console.error('Initialize Auth Error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with mobile and password
   */
  const login = async (mobile, password) => {
    try {
      console.log('🔐 AuthContext: Starting login');
      console.log('📱 Mobile:', mobile);
      
      const response = await api.workerLogin(mobile, password);
      
      console.log('📥 AuthContext: Login response received');
      console.log('✅ Success:', response.success);
      
      if (response.success) {
        console.log('💾 AuthContext: Updating state');
        setToken(response.token);
        setUser(response.worker);
        setIsAuthenticated(true);
        console.log('✅ AuthContext: State updated successfully');
        return { success: true, worker: response.worker };
      }
      
      console.log('❌ AuthContext: Login failed -', response.message);
      return { success: false, message: response.message };
    } catch (error) {
      console.error('💥 AuthContext Login Error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  };

  /**
   * Register new worker
   */
  const register = async (workerData) => {
    try {
      const response = await api.registerWorker(workerData);
      
      if (response.success) {
        // Registration successful but pending approval
        return { 
          success: true, 
          message: response.message,
          requiresApproval: true,
        };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Registration Error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await api.logout();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      console.error('Logout Error:', error);
      return { success: false, message: error.message };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates) => {
    try {
      const response = await api.updateWorkerProfile(updates);
      
      if (response.success) {
        setUser(response.worker);
        return { success: true, worker: response.worker };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Update Profile Error:', error);
      return { 
        success: false, 
        message: error.message || 'Update failed. Please try again.' 
      };
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async () => {
    try {
      const response = await api.getWorkerProfile();
      
      if (response.success) {
        setUser(response.worker);
        return { success: true, worker: response.worker };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Refresh User Error:', error);
      
      // Handle session expiration
      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [{ text: 'OK', onPress: logout }]
        );
      }
      
      return { 
        success: false, 
        message: error.message || 'Failed to refresh user data.' 
      };
    }
  };

  /**
   * Check if user is authenticated
   */
  const checkAuth = () => {
    return isAuthenticated && token && user;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
