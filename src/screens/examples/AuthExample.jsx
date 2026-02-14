/**
 * Authentication Usage Example
 * This file demonstrates how to use authentication in your screens
 */

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import COLORS from '../../constants/colors';

const AuthExample = ({ navigation }) => {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data when component mounts
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  /**
   * Example: Fetch dashboard data with authentication
   */
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.getDashboardData();
      if (response.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Load Dashboard Error:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Example: Update user profile
   */
  const handleUpdateProfile = async () => {
    try {
      const response = await api.updateWorkerProfile({
        name: 'Updated Name',
        city: 'New City',
      });

      if (response.success) {
        Alert.alert('Success', 'Profile updated successfully');
        // Refresh user data in context
        await refreshUser();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  /**
   * Example: Update availability status
   */
  const handleToggleAvailability = async () => {
    try {
      const newStatus = !user.available;
      const response = await api.updateAvailability(newStatus);

      if (response.success) {
        Alert.alert('Success', `You are now ${newStatus ? 'available' : 'unavailable'}`);
        await refreshUser();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  /**
   * Example: Logout
   */
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (result.success) {
              navigation.replace('Login');
            }
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Not authenticated</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Example</Text>

      {/* Display User Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Information</Text>
        <Text style={styles.text}>Name: {user?.name}</Text>
        <Text style={styles.text}>Mobile: {user?.mobile}</Text>
        <Text style={styles.text}>Status: {user?.status}</Text>
        <Text style={styles.text}>Category: {user?.category}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={loadDashboardData}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Refresh Dashboard'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdateProfile}
        >
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleToggleAvailability}
        >
          <Text style={styles.buttonText}>Toggle Availability</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Dashboard Data */}
      {dashboardData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dashboard Data</Text>
          <Text style={styles.text}>
            {JSON.stringify(dashboardData, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: COLORS.error || '#ef4444',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuthExample;
