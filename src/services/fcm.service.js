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
      
      // For Android, register device for remote messages
      if (Platform.OS === 'android') {
        try {
          const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
          console.log('📱 Device registration status:', isRegistered);
          
          if (!isRegistered) {
            console.log('📱 Registering device for remote messages...');
            await messaging().registerDeviceForRemoteMessages();
            console.log('✅ Device registered for remote messages');
          }
        } catch (regError) {
          console.warn('⚠️ Device registration check failed, continuing...', regError.message);
          // Continue anyway, token might still work
        }
      }
      
      // Get the token
      console.log('🔑 Requesting FCM token from Firebase...');
      const token = await messaging().getToken();
      
      if (token && token.length > 0) {
        console.log('✅ FCM Token obtained successfully');
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 30) + '...');
        
        // Save token locally
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        console.log('✅ Token saved to AsyncStorage');
        
        return token;
      } else {
        console.warn('⚠️ Token is empty or invalid, retrying...');
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error);
      
      // Check for specific error codes
      if (error.code === 'messaging/unknown') {
        console.error('💡 Firebase Messaging not initialized properly');
        console.error('💡 Check google-services.json and Firebase setup');
      } else if (error.code === 'messaging/registration-token-not-registered') {
        console.error('💡 Device not registered with FCM');
      }
      
      if (attempt < retries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('❌ All retry attempts exhausted');
        // Don't throw error, return null to allow app to continue
        return null;
      }
    }
  }
  
  console.error('❌ Failed to get FCM token after all retries');
  return null; // Return null instead of throwing
};

/**
 * Register FCM token with backend
 */
export const registerFCMToken = async (userId, token = null) => {
  try {
    console.log('📤 Registering FCM token with backend...');
    console.log('   User ID:', userId);
    
    // If token not provided, get it
    let fcmToken = token;
    if (!fcmToken) {
      console.log('   Token not provided, fetching...');
      fcmToken = await getFCMToken();
    }
    
    if (!fcmToken) {
      console.error('❌ No FCM token available - skipping registration');
      console.log('💡 App will work without notifications');
      return false;
    }
    
    console.log('   Token preview:', fcmToken.substring(0, 30) + '...');
    console.log('   Token length:', fcmToken.length);
    
    const requestBody = {
      userId,
      fcmToken,
      platform: Platform.OS,
      deviceInfo: {
        os: Platform.OS,
        version: Platform.Version
      }
    };
    
    console.log('📤 Sending request to backend...');
    console.log('   URL:', `${API_BASE_URL}/api/workers/fcm-token`);
    
    const response = await fetch(`${API_BASE_URL}/api/workers/fcm-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
    if (!response.ok) {
      console.error('❌ Backend returned error:', data.message);
      console.error('   Status:', response.status);
      console.error('   Response:', JSON.stringify(data, null, 2));
      return false;
    }

    console.log('✅ FCM token registered with backend successfully');
    console.log('   Response:', data.message);
    
    // Store registration status locally
    await AsyncStorage.setItem('@fcm_registered', 'true');
    await AsyncStorage.setItem('@fcm_user_id', userId);
    await AsyncStorage.setItem('@fcm_token_last_sent', new Date().toISOString());
    
    console.log('✅ Registration status saved locally');
    
    return true;
  } catch (error) {
    console.error('❌ Failed to register FCM token:', error.message);
    console.error('   Error details:', error);
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
    console.log('📱 Checking Firebase initialization...');
    const isFirebaseReady = await checkFirebaseInitialization();
    if (!isFirebaseReady) {
      console.error('❌ Firebase is not properly initialized');
      console.log('💡 Check google-services.json file');
      return null;
    }
    
    // Step 2: Request notification permission
    console.log('📱 Requesting notification permission...');
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.log('⚠️ Notification permission denied by user');
      console.log('💡 User can enable it later from settings');
      return null;
    }
    console.log('✅ Notification permission granted');
    
    // Step 3: Get FCM token with retry logic
    console.log('🔑 Getting FCM token...');
    const token = await getFCMToken();
    
    if (!token) {
      console.error('❌ Failed to get FCM token');
      console.log('💡 App will continue without push notifications');
      return null;
    }
    
    console.log('✅ FCM token obtained successfully');
    
    // Step 4: Setup token refresh listener
    console.log('🔄 Setting up token refresh listener...');
    messaging().onTokenRefresh(async newToken => {
      console.log('🔄 FCM Token refreshed');
      console.log('New token preview:', newToken.substring(0, 30) + '...');
      await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
      
      // Update token on backend if user is logged in
      const userId = await AsyncStorage.getItem('@user_id');
      if (userId) {
        console.log('📤 Updating refreshed token on backend...');
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
    } else if (error.message.includes('MISSING_INSTANCEID_SERVICE')) {
      console.error('💡 Firebase Messaging not properly configured');
    }
    
    console.log('💡 App will continue without push notifications');
    return null;
  }
};

/**
 * Setup notification handlers
 */
export const setupNotificationHandlers = (navigationRef = null) => {
  console.log('🔔 Setting up notification handlers...');
  
  // ✅ FOREGROUND: When app is open and active
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('📩 FOREGROUND notification received:', remoteMessage);
    console.log('   Title:', remoteMessage.notification?.title || remoteMessage.data?.title);
    console.log('   Body:', remoteMessage.notification?.body || remoteMessage.data?.body);
    console.log('   Data:', remoteMessage.data);
    
    // Save notification to local storage for history
    await saveNotificationToHistory(remoteMessage);
    
    // Extract title and body from notification or data payload
    const title = remoteMessage.notification?.title || remoteMessage.data?.title || 'New Notification';
    const body = remoteMessage.notification?.body || remoteMessage.data?.body || '';
    
    // Show alert dialog for foreground notifications
    Alert.alert(
      title,
      body,
      [
        {
          text: 'Dismiss',
          style: 'cancel'
        },
        {
          text: 'View',
          onPress: () => handleNotificationNavigation(remoteMessage.data, navigationRef)
        }
      ],
      { cancelable: true }
    );
    
    console.log('✅ Foreground notification displayed');
  });

  // ✅ BACKGROUND: App opened from notification (background state)
  const unsubscribeBackground = messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('📱 BACKGROUND: Notification opened app from background:', remoteMessage);
    console.log('   Title:', remoteMessage.notification?.title || remoteMessage.data?.title);
    console.log('   Body:', remoteMessage.notification?.body || remoteMessage.data?.body);
    console.log('   Data:', remoteMessage.data);
    
    // Save notification to history
    saveNotificationToHistory(remoteMessage);
    
    // Handle navigation based on notification data
    handleNotificationNavigation(remoteMessage.data, navigationRef);
  });

  // ✅ TERMINATED: App opened from notification (quit/terminated state)
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 TERMINATED: App opened from notification (terminated state):', remoteMessage);
        console.log('   Title:', remoteMessage.notification?.title || remoteMessage.data?.title);
        console.log('   Body:', remoteMessage.notification?.body || remoteMessage.data?.body);
        console.log('   Data:', remoteMessage.data);
        
        // Save notification to history
        saveNotificationToHistory(remoteMessage);
        
        // Handle navigation based on notification data
        setTimeout(() => {
          handleNotificationNavigation(remoteMessage.data, navigationRef);
        }, 2000); // Delay to ensure navigation is ready
      }
    });
  
  console.log('✅ Notification handlers setup complete');
  console.log('   - Foreground: Alert dialog');
  console.log('   - Background: System notification → Navigation');
  console.log('   - Terminated: System notification → Navigation');
  
  // Return cleanup function
  return () => {
    unsubscribeForeground();
    unsubscribeBackground();
  };
};

/**
 * Save notification to local history
 */
const saveNotificationToHistory = async (remoteMessage) => {
  try {
    const notification = {
      id: remoteMessage.messageId,
      title: remoteMessage.notification?.title || 'Notification',
      body: remoteMessage.notification?.body || '',
      data: remoteMessage.data || {},
      receivedAt: new Date().toISOString(),
      read: false
    };
    
    // Get existing notifications
    const existingNotifications = await AsyncStorage.getItem('@notifications_history');
    const notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
    
    // Add new notification at the beginning
    notifications.unshift(notification);
    
    // Keep only last 100 notifications
    const trimmedNotifications = notifications.slice(0, 100);
    
    // Save back to storage
    await AsyncStorage.setItem('@notifications_history', JSON.stringify(trimmedNotifications));
    
    console.log('✅ Notification saved to history');
  } catch (error) {
    console.error('❌ Failed to save notification to history:', error);
  }
};

/**
 * Handle notification navigation based on data payload
 */
const handleNotificationNavigation = (data, navigationRef) => {
  if (!data || !navigationRef) {
    console.log('⚠️ No navigation data or ref available');
    return;
  }
  
  try {
    console.log('🧭 Handling notification navigation:', data);
    
    // Navigate based on notification type
    if (data.type === 'job_alert' && data.job_id) {
      navigationRef.navigate('JobDetails', { jobId: data.job_id });
    } else if (data.type === 'message' && data.chat_id) {
      navigationRef.navigate('Chat', { chatId: data.chat_id });
    } else if (data.type === 'payment' && data.payment_id) {
      navigationRef.navigate('PaymentDetails', { paymentId: data.payment_id });
    } else if (data.screen) {
      // Generic screen navigation
      navigationRef.navigate(data.screen, data.params ? JSON.parse(data.params) : {});
    } else {
      // Default: navigate to notifications screen
      navigationRef.navigate('Notifications');
    }
  } catch (error) {
    console.error('❌ Navigation error:', error);
  }
};

/**
 * Get notification history from local storage
 */
export const getNotificationHistory = async () => {
  try {
    const notifications = await AsyncStorage.getItem('@notifications_history');
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('❌ Failed to get notification history:', error);
    return [];
  }
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const notifications = await getNotificationHistory();
    const updatedNotifications = notifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    await AsyncStorage.setItem('@notifications_history', JSON.stringify(updatedNotifications));
    console.log('✅ Notification marked as read');
  } catch (error) {
    console.error('❌ Failed to mark notification as read:', error);
  }
};

/**
 * Clear all notifications
 */
export const clearNotificationHistory = async () => {
  try {
    await AsyncStorage.removeItem('@notifications_history');
    console.log('✅ Notification history cleared');
  } catch (error) {
    console.error('❌ Failed to clear notification history:', error);
  }
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
