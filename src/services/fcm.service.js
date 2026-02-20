import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api.config';

const FCM_TOKEN_KEY = '@fcm_token';

/**
 * Check if Firebase is properly initialized
 */
const checkFirebaseInitialization = async () => {
  try {
    // Check if Firebase app is initialized
    const apps = firebase.apps;
    if (apps.length === 0) {
      console.error('❌ Firebase not initialized');
      return false;
    }
    
    console.log('✅ Firebase app initialized:', apps[0].name);
    
    // Check if messaging is available
    const isMessagingAvailable = await messaging().isDeviceRegisteredForRemoteMessages;
    console.log('📱 Device registered for remote messages:', isMessagingAvailable);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase check failed:', error);
    return false;
  }
};

/**
 * Request notification permissions
 */
export const requestNotificationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        console.log('📱 Notification permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      console.log('📱 Android < 13, permission granted by default');
      return true; // Android < 13 doesn't need runtime permission
    } else {
      // iOS
      const authStatus = await messaging().requestPermission();
      const enabled = 
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log('📱 iOS permission status:', authStatus, 'Enabled:', enabled);
      return enabled;
    }
  } catch (error) {
    console.error('❌ Permission request failed:', error);
    return false;
  }
};

/**
 * Get FCM token with retry logic
 */
export const getFCMToken = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔑 Attempting to get FCM token (attempt ${attempt}/${retries})...`);
      
      // Register device for remote messages if not already registered
      if (!messaging().isDeviceRegisteredForRemoteMessages) {
        await messaging().registerDeviceForRemoteMessages();
        console.log('✅ Device registered for remote messages');
      }
      
      // Get the token
      const token = await messaging().getToken();
      
      if (token) {
        console.log('✅ FCM Token obtained successfully');
        console.log('Token preview:', token.substring(0, 30) + '...');
        
        // Save token locally
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        
        return token;
      } else {
        console.warn('⚠️ Token is empty, retrying...');
      }
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ All retry attempts exhausted');
        throw error;
      }
    }
  }
  
  throw new Error('Failed to get FCM token after all retries');
};

/**
 * Register FCM token with backend
 */
export const registerFCMToken = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/workers/fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        fcmToken: token,
        platform: Platform.OS,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to register FCM token');
    }

    console.log('✅ FCM token registered with backend');
    return true;
  } catch (error) {
    console.error('❌ Failed to register FCM token:', error);
    return false;
  }
};

/**
 * Initialize FCM with proper error handling
 */
export const initializeFCM = async () => {
  try {
    console.log('🚀 Starting FCM initialization...');
    
    // Step 1: Check Firebase initialization
    const isFirebaseReady = await checkFirebaseInitialization();
    if (!isFirebaseReady) {
      throw new Error('Firebase is not properly initialized');
    }
    
    // Step 2: Request notification permission
    console.log('📱 Requesting notification permission...');
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('⚠️ Notification permission denied by user');
      return null;
    }
    
    // Step 3: Get FCM token with retry logic
    console.log('🔑 Getting FCM token...');
    const token = await getFCMToken();
    
    // Step 4: Setup token refresh listener
    messaging().onTokenRefresh(async newToken => {
      console.log('🔄 FCM Token refreshed');
      console.log('New token preview:', newToken.substring(0, 30) + '...');
      await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
      
      // Update token on backend if user is logged in
      const userId = await AsyncStorage.getItem('@user_id');
      if (userId) {
        await registerFCMToken(userId, newToken);
      }
    });
    
    console.log('✅ FCM initialization completed successfully');
    return token;
    
  } catch (error) {
    console.error('❌ FCM initialization failed:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Provide user-friendly error messages
    if (error.message.includes('SERVICE_NOT_AVAILABLE')) {
      console.error('💡 Google Play Services may need to be updated');
    } else if (error.message.includes('TOO_MANY_REGISTRATIONS')) {
      console.error('💡 Too many apps registered, try clearing app data');
    } else if (error.message.includes('INVALID_SENDER')) {
      console.error('💡 Check google-services.json configuration');
    }
    
    throw error;
  }
};

/**
 * Setup notification handlers
 */
export const setupNotificationHandlers = () => {
  // Foreground message handler
  messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground notification:', remoteMessage);
    
    // Show local notification or custom UI
    Alert.alert(
      remoteMessage.notification?.title || 'New Notification',
      remoteMessage.notification?.body || '',
    );
  });

  // Background/Quit state notification handler
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('📱 Notification opened app:', remoteMessage);
    // Handle navigation based on notification data
  });

  // Check if app was opened from a notification (quit state)
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 App opened from notification:', remoteMessage);
        // Handle navigation based on notification data
      }
    });
};

/**
 * Get stored FCM token
 */
export const getStoredFCMToken = async () => {
  try {
    return await AsyncStorage.getItem(FCM_TOKEN_KEY);
  } catch (error) {
    console.error('❌ Failed to get stored FCM token:', error);
    return null;
  }
};

/**
 * Clear FCM token (on logout)
 */
export const clearFCMToken = async () => {
  try {
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    await messaging().deleteToken();
    console.log('✅ FCM token cleared');
  } catch (error) {
    console.error('❌ Failed to clear FCM token:', error);
  }
};
