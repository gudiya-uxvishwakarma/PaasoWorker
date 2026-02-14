/**
 * Custom Hook for API Calls
 * Provides loading, error, and data states for API requests
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

/**
 * Custom hook for making API calls with loading and error states
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, execute, reset }
 * 
 * @example
 * const { data, loading, error, execute } = useApi(api.getWorkerProfile);
 * 
 * useEffect(() => {
 *   execute();
 * }, []);
 */
export const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    onSuccess,
    onError,
    showErrorAlert = true,
    initialData = null,
  } = options;

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(...args);

      if (response.success) {
        setData(response.data || response);
        
        if (onSuccess) {
          onSuccess(response.data || response);
        }
        
        return { success: true, data: response.data || response };
      } else {
        const errorMessage = response.message || 'Request failed';
        setError(errorMessage);
        
        if (showErrorAlert) {
          Alert.alert('Error', errorMessage);
        }
        
        if (onError) {
          onError(errorMessage);
        }
        
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorAlert) {
        Alert.alert('Error', errorMessage);
      }
      
      if (onError) {
        onError(errorMessage);
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction, onSuccess, onError, showErrorAlert]);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook for making multiple API calls in parallel
 * 
 * @param {Array} apiCalls - Array of API functions to call
 * @returns {Object} - { data, loading, error, execute }
 * 
 * @example
 * const { data, loading, execute } = useApiMultiple([
 *   api.getWorkerProfile,
 *   api.getDashboardData,
 * ]);
 */
export const useApiMultiple = (apiCalls) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const results = await Promise.all(
        apiCalls.map(apiCall => apiCall())
      );

      setData(results);
      return { success: true, data: results };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiCalls]);

  return {
    data,
    loading,
    error,
    execute,
  };
};

/**
 * Hook for paginated API calls
 * 
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Configuration options
 * @returns {Object} - { data, loading, error, hasMore, loadMore, refresh }
 * 
 * @example
 * const { data, loading, hasMore, loadMore } = usePaginatedApi(
 *   (page) => api.getBookings({ page, limit: 10 })
 * );
 */
export const usePaginatedApi = (apiFunction, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { initialPage = 1, pageSize = 10 } = options;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(page, pageSize);

      if (response.success) {
        const newData = response.data || [];
        
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
        setHasMore(newData.length === pageSize);
      }
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, page, pageSize, loading, hasMore]);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      setPage(initialPage);

      const response = await apiFunction(initialPage, pageSize);

      if (response.success) {
        const newData = response.data || [];
        setData(newData);
        setPage(initialPage + 1);
        setHasMore(newData.length === pageSize);
      }
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', err.message);
    } finally {
      setRefreshing(false);
    }
  }, [apiFunction, initialPage, pageSize]);

  return {
    data,
    loading,
    refreshing,
    error,
    hasMore,
    loadMore,
    refresh,
  };
};

export default useApi;
