/**
 * Protected Route Component
 * Wraps screens that require authentication
 */

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import COLORS from '../constants/colors';

const ProtectedRoute = ({ children, navigation, redirectTo = 'Login' }) => {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Redirect to login if not authenticated
      navigation.replace(redirectTo);
    }
  }, [isAuthenticated, loading, navigation, redirectTo]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Check if user account is approved
  if (user && user.status !== 'Approved') {
    return (
      <View style={styles.pendingContainer}>
        <Text style={styles.pendingText}>
          Your account is pending approval. Please wait for admin verification.
        </Text>
      </View>
    );
  }

  // Render children if authenticated
  return children;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  pendingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ProtectedRoute;
