import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Register background handler for notifications when app is in background or terminated
// This MUST be registered BEFORE AppRegistry.registerComponent
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background/Terminated notification received:', remoteMessage);
  console.log('   Title:', remoteMessage.notification?.title);
  console.log('   Body:', remoteMessage.notification?.body);
  console.log('   Data:', remoteMessage.data);
  
  // The notification will be automatically displayed by the native layer
  // You can perform additional background tasks here if needed
  // For example: save to local database, update badge count, etc.
  
  return Promise.resolve();
});

AppRegistry.registerComponent(appName, () => App);
