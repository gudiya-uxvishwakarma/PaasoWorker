import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';

/**
 * Run comprehensive Firebase diagnostics
 */
export const runFirebaseDiagnostics = async () => {
  console.log('🔍 ========================================');
  console.log('🔍 Firebase Diagnostics Started');
  console.log('🔍 ========================================');
  
  try {
    // 1. Check Firebase App Initialization
    console.log('\n📱 [1/6] Checking Firebase App...');
    const apps = firebase.apps;
    if (apps.length > 0) {
      console.log('✅ Firebase app initialized');
      console.log('   App name:', apps[0].name);
      console.log('   Total apps:', apps.length);
    } else {
      console.error('❌ Firebase app NOT initialized');
      return;
    }

    // 2. Check Platform Info
    console.log('\n📱 [2/6] Platform Information...');
    console.log('   OS:', Platform.OS);
    console.log('   Version:', Platform.Version);
    console.log('   Is Android:', Platform.OS === 'android');

    // 3. Check Firebase Messaging
    console.log('\n📱 [3/6] Checking Firebase Messaging...');
    const isAutoInitEnabled = messaging().isAutoInitEnabled;
    console.log('   Auto Init Enabled:', isAutoInitEnabled);
    
    const isDeviceRegistered = messaging().isDeviceRegisteredForRemoteMessages;
    console.log('   Device Registered:', isDeviceRegistered);

    // 4. Check Device Registration
    console.log('\n📱 [4/6] Registering Device...');
    if (!isDeviceRegistered) {
      try {
        await messaging().registerDeviceForRemoteMessages();
        console.log('✅ Device registered successfully');
      } catch (regError) {
        console.error('❌ Device registration failed:', regError.message);
      }
    } else {
      console.log('✅ Device already registered');
    }

    // 5. Check FCM Token
    console.log('\n📱 [5/6] Checking FCM Token...');
    try {
      const token = await messaging().getToken();
      if (token) {
        console.log('✅ FCM Token obtained successfully');
        console.log('   Token preview:', token);
        console.log('   Token length:', token.length);
      } else {
        console.error('❌ FCM Token is empty');
      }
    } catch (tokenError) {
      console.error('❌ Failed to get FCM token');
      console.error('   Error code:', tokenError.code);
      console.error('   Error message:', tokenError.message);
      
      // Provide specific guidance based on error
      if (tokenError.message.includes('SERVICE_NOT_AVAILABLE')) {
        console.error('   💡 Google Play Services may need updating');
      } else if (tokenError.message.includes('TOO_MANY_REGISTRATIONS')) {
        console.error('   💡 Too many apps registered, clear app data');
      } else if (tokenError.message.includes('INVALID_SENDER')) {
        console.error('   💡 Check google-services.json configuration');
      }
    }

    // 6. Summary
    console.log('\n📱 [6/6] Diagnostic Summary...');
    console.log('✅ Firebase diagnostics completed');
    
  } catch (error) {
    console.error('\n❌ Diagnostics failed with error:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
  }
  
  console.log('\n🔍 ========================================');
  console.log('🔍 Firebase Diagnostics Completed');
  console.log('🔍 ========================================\n');
};

