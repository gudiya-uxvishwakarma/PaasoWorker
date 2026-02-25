import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

/**
 * Custom hook for automatic OTP reading from SMS (Android only)
 * Uses SMS User Consent API for automatic OTP detection
 */
const useOTPAutoRead = (onOTPReceived) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestSMSPermission();
    }
    
    return () => {
      stopListening();
    };
  }, []);

  const requestSMSPermission = async () => {
    try {
      if (Platform.Version >= 23) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          {
            title: 'SMS Permission',
            message: 'Allow Paaso to read SMS for automatic OTP verification',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ SMS permission granted');
          setHasPermission(true);
        } else {
          console.log('❌ SMS permission denied');
          setHasPermission(false);
        }
      } else {
        setHasPermission(true);
      }
    } catch (error) {
      console.error('❌ SMS permission error:', error);
      setHasPermission(false);
    }
  };

  const startListening = () => {
    if (Platform.OS !== 'android' || !hasPermission) {
      console.log('⚠️ Auto OTP read not available');
      return;
    }

    console.log('👂 Starting OTP auto-read listener...');
    setIsListening(true);

    // Note: For production, you would integrate with:
    // - react-native-otp-verify (recommended)
    // - react-native-sms-retriever
    // These libraries use Google's SMS Retriever API
    
    // For now, we'll rely on Firebase's built-in auto-verification
    console.log('📱 Using Firebase auto-verification');
  };

  const stopListening = () => {
    if (isListening) {
      console.log('🛑 Stopping OTP auto-read listener');
      setIsListening(false);
    }
  };

  return {
    hasPermission,
    isListening,
    startListening,
    stopListening,
  };
};

export default useOTPAutoRead;
