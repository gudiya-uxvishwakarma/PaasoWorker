/**
 * PaasoWork - Worker App
 * @format
 */

import { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, Platform, PermissionsAndroid, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { LanguageProvider } from './src/context/LanguageContext';
import { initializeFCM, setupNotificationHandlers } from './src/services/fcm.service';
import { runFirebaseDiagnostics } from './src/utils/firebaseDiagnostics';


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Initialize FCM on app start with delay to ensure Firebase is ready
    const setupFCM = async () => {
      try {
        console.log('🚀 Starting FCM setup...');
        
        // Wait a bit for Firebase to fully initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Run diagnostics first (only in development) - but don't block on errors
        if (__DEV__) {
          console.log('🔍 Running Firebase diagnostics...');
          try {
            await runFirebaseDiagnostics();
          } catch (diagError) {
            console.warn('⚠️ Diagnostics failed:', diagError.message);
            // Continue anyway - diagnostics are informational only
          }
        }
        
        // Initialize FCM with proper error handling
        const token = await initializeFCM();
        
        if (token) {
          console.log('✅ FCM Token obtained successfully');
          console.log('📱 Device registered for push notifications');
          
          // Setup notification handlers
          setupNotificationHandlers();
          console.log('✅ FCM setup completed successfully');
          console.log('📲 App is ready to receive notifications');
          
          // Show success message in development (only if successful)
          if (__DEV__) {
            setTimeout(() => {
              Alert.alert(
                '✅ Firebase Connected',
                `Push notifications enabled!\n\nToken: ${token.substring(0, 20)}...`,
                [{ text: 'OK' }]
              );
            }, 1500);
          }
        } else {
          console.log('⚠️ FCM token not obtained (permission denied or service unavailable)');
          // Don't show alert for permission denied - it's expected behavior
        }
        
      } catch (error) {
        console.error('❌ FCM setup failed:', error);
        
        // Safely extract error message
        const errorMessage = error?.message || error?.toString() || 'Unknown error';
        const errorCode = error?.code || 'unknown';
        
        console.error('Error code:', errorCode);
        console.error('Error message:', errorMessage);
        
        if (error?.stack) {
          console.error('Error stack:', error.stack);
        }
        
        // Check if it's a Google Play Services issue
        const isPlayServicesIssue = errorMessage.includes('SERVICE_NOT_AVAILABLE');
        
        // Only show alert in dev mode AND only for Play Services issues
        // This prevents annoying alerts for other issues
        if (__DEV__ && isPlayServicesIssue) {
          setTimeout(() => {
            Alert.alert(
              '⚠️ Google Play Services Required',
              'Push notifications need Google Play Services.\n\n' +
              'To fix:\n' +
              '1. Use emulator with "Google Play" image\n' +
              '2. Or update Play Services on device\n\n' +
              'App works fine without notifications.',
              [
                { text: 'Fix It', onPress: () => console.log('Run: fix-google-play-services.bat') },
                { text: 'Continue Anyway', style: 'cancel' }
              ]
            );
          }, 1500);
        } else {
          // For non-Play Services errors, just log and continue silently
          console.log('⚠️ Firebase unavailable - app will continue without push notifications');
        }
      }
    };

    // Run FCM setup without blocking app startup
    setupFCM();
  }, []);

  if (showSplash) {
    return (
      <>
        <StatusBar barStyle="light-content" backgroundColor="#2e2b6d" />
        <SplashScreen onFinish={() => setShowSplash(false)} />
      </>
    );
  }

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppNavigator />
      </SafeAreaProvider>
    </LanguageProvider>
  );
}

export default App;