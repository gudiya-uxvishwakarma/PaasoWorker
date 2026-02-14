/**
 * useApi Hook Usage Examples
 * Demonstrates different ways to use the useApi hook
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useApi, usePaginatedApi } from '../../hooks/useApi';
import * as api from '../../services/api';
import COLORS from '../../constants/colors';

// Example 1: Simple API call with loading state
export const SimpleExample = () => {
  const { data, loading, error, execute } = useApi(api.getWorkerProfile);

  useEffect(() => {
    execute();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Data</Text>
      <Text style={styles.text}>Name: {data?.name}</Text>
      <Text style={styles.text}>Mobile: {data?.mobile}</Text>
      <TouchableOpacity style={styles.button} onPress={execute}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 2: API call with success/error callbacks
export const CallbackExample = () => {
  const { data, loading, execute } = useApi(
    api.updateWorkerProfile,
    {
      onSuccess: (data) => {
        console.log('Profile updated successfully:', data);
      },
      onError: (error) => {
        console.error('Update failed:', error);
      },
      showErrorAlert: true, // Show alert on error
    }
  );

  const handleUpdate = () => {
    execute({
      name: 'Updated Name',
      city: 'New City',
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 3: Paginated list with infinite scroll
export const PaginatedExample = () => {
  const {
    data,
    loading,
    refreshing,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedApi(
    (page, limit) => api.getBookings({ page, limit, status: 'all' }),
    { pageSize: 10 }
  );

  useEffect(() => {
    loadMore();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubtitle}>{item.status}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="small" color={COLORS.primary} />;
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[COLORS.primary]}
        />
      }
    />
  );
};

// Example 4: Dashboard with multiple API calls
export const DashboardExample = () => {
  const profileApi = useApi(api.getWorkerProfile);
  const dashboardApi = useApi(api.getDashboardData);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      profileApi.execute(),
      dashboardApi.execute(),
    ]);
  };

  const isLoading = profileApi.loading || dashboardApi.loading;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <Text style={styles.text}>Name: {profileApi.data?.name}</Text>
        <Text style={styles.text}>Mobile: {profileApi.data?.mobile}</Text>
      </View>

      {/* Dashboard Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dashboard</Text>
        <Text style={styles.text}>
          Total Bookings: {dashboardApi.data?.totalBookings || 0}
        </Text>
        <Text style={styles.text}>
          Completed: {dashboardApi.data?.completed || 0}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={loadData}>
        <Text style={styles.buttonText}>Refresh All</Text>
      </TouchableOpacity>
    </View>
  );
};

// Example 5: Form submission with loading state
export const FormExample = () => {
  const { loading, execute } = useApi(api.updateWorkerProfile, {
    onSuccess: () => {
      Alert.alert('Success', 'Profile updated successfully');
    },
    showErrorAlert: true,
  });

  const [formData, setFormData] = React.useState({
    name: '',
    city: '',
  });

  const handleSubmit = async () => {
    const result = await execute(formData);
    if (result.success) {
      // Reset form or navigate
      setFormData({ name: '', city: '' });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={formData.city}
        onChangeText={(text) => setFormData({ ...formData, city: text })}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.textSecondary,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error || '#ef4444',
    textAlign: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  listItem: {
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border || '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});

export default {
  SimpleExample,
  CallbackExample,
  PaginatedExample,
  DashboardExample,
  FormExample,
};
