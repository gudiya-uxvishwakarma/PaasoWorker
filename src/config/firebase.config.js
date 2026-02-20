import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

/**
 * Initialize Firebase
 * This should be called before any Firebase operations
 */
export const initializeFirebase = async () => {
  try {
    console.log('🔥 Initializing Firebase...');
    
    // Check if Firebase is available
    const isSupported = await messaging().isDeviceRegisteredForRemoteMessages();
    console.log('📱 Device registered for remote messages:', isSupported);
    
    // Register device if not already registered
    if (!isSupported) {
      await messaging().registerDeviceForRemoteMessages();
      console.log('✅ Device registered for remote messages');
    }
    
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    return false;
  }
};

/**
 * Check if Firebase is properly configured
 */
export const checkFirebaseConfig = async () => {
  try {
    // Try to get instance
    const messagingInstance = messaging();
    console.log('✅ Firebase Messaging instance available');
    return true;
  } catch (error) {
    console.error('❌ Firebase Messaging not available:', error);
    return false;
  }
};

export default {
  initializeFirebase,
  checkFirebaseConfig
};
