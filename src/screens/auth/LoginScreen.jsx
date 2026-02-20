import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView,
  StatusBar,
  Image,
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import SuccessModal from '../../components/SuccessModal';
import * as api from '../../services/api';
import { getFCMToken, registerFCMToken } from '../../services/fcm.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ onLogin, onNewUser }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // Modal states
  const [showOtpSentModal, setShowOtpSentModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Animation values for bubbles
  const bubble1 = useRef(new Animated.Value(0)).current;
  const bubble2 = useRef(new Animated.Value(0)).current;
  const bubble3 = useRef(new Animated.Value(0)).current;
  const bubble4 = useRef(new Animated.Value(0)).current;
  const bubble5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create floating bubble animations
    const createBubbleAnimation = (animValue, duration, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Start all bubble animations with different durations and delays
    Animated.parallel([
      createBubbleAnimation(bubble1, 4000, 0),
      createBubbleAnimation(bubble2, 5000, 500),
      createBubbleAnimation(bubble3, 4500, 1000),
      createBubbleAnimation(bubble4, 5500, 1500),
      createBubbleAnimation(bubble5, 4800, 2000),
    ]).start();
  }, []);

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const getBubbleStyle = (animValue, left, size) => ({
    position: 'absolute',
    left: left,
    bottom: -20,
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -600],
        }),
      },
      {
        scale: animValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.1, 0.8],
        }),
      },
    ],
    opacity: animValue.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    }),
  });

  const sendOTP = async () => {
    if (phoneNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate OTP send (Demo mode - no Firebase)
      setTimeout(() => {
        setLoading(false);
        setResendTimer(30);
        
        // Show professional OTP sent modal
        setShowOtpSentModal(true);
        
        // Auto-navigate to OTP screen after 800ms
        setTimeout(() => {
          setShowOtpSentModal(false);
          setOtpSent(true);
        }, 800);
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error('OTP Send Error:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔐 Verifying OTP:', otp, 'for mobile:', phoneNumber);
      
      // Accept any 6-digit OTP (Demo mode)
      console.log('✅ OTP accepted:', otp);
      
      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if user is registered in database
      console.log('📞 Checking mobile number in database...');
      const response = await api.checkMobile(phoneNumber);
      
      console.log('📦 Check Mobile Response:', JSON.stringify(response, null, 2));
      
      setLoading(false);
      
      if (response && response.success && response.exists && response.worker) {
        // Existing user - check if approved
        console.log('✅ Existing user found');
        console.log('👤 Worker Status:', response.worker.status);
        console.log('👤 Worker Name:', response.worker.name);
        
        // Allow login for Pending and Approved users
        // Only block Rejected and Blocked users
        if (response.worker.status === 'Approved' || response.worker.status === 'Pending') {
          // Approved or Pending user - allow login
          console.log('✅ User is Approved/Pending - Logging in...');
          
          // Register FCM token for push notifications (non-blocking)
          try {
            console.log('📱 Getting FCM token...');
            const fcmToken = await getFCMToken();
            
            if (fcmToken && response.worker._id) {
              console.log('📱 Registering FCM token with backend...');
              await registerFCMToken(response.worker._id, fcmToken);
              console.log('✅ FCM token registered successfully');
            }
          } catch (error) {
            console.log('⚠️ FCM token registration failed, but login successful:', error.message);
            // Don't block login if FCM fails
          }
          
          setIsNewUser(false);
          setShowWelcomeModal(true);
          
          // Auto close and navigate after 1200ms
          setTimeout(() => {
            setShowWelcomeModal(false);
            setTimeout(() => {
              onLogin(phoneNumber, response.worker);
            }, 200);
          }, 1200);
        } else if (response.worker.status === 'Rejected') {
          // Rejected
          console.log('❌ User status: Rejected');
          Alert.alert(
            'Registration Rejected',
            response.worker.rejectionReason || 'Your registration was rejected. Please contact support.',
            [{ text: 'OK' }]
          );
        } else if (response.worker.status === 'Blocked') {
          // Blocked
          console.log('🚫 User status: Blocked');
          Alert.alert(
            'Account Blocked',
            'Your account has been blocked. Please contact support.',
            [{ text: 'OK' }]
          );
        } else {
          // Other status
          console.log('⚠️ User status:', response.worker.status);
          Alert.alert(
            'Account Issue',
            `Your account status is ${response.worker.status}. Please contact support.`,
            [{ text: 'OK' }]
          );
        }
      } else if (response && response.success && !response.exists) {
        // New user - show welcome to Paaso message
        console.log('🆕 New user detected - redirecting to registration');
        setIsNewUser(true);
        setShowWelcomeModal(true);
        
        // Auto close and navigate after 1200ms
        setTimeout(() => {
          setShowWelcomeModal(false);
          setTimeout(() => {
            onNewUser(phoneNumber);
          }, 200);
        }, 1200);
      } else {
        // Unexpected response
        console.error('❌ Unexpected response structure:', response);
        Alert.alert(
          'Verification Failed',
          'Unable to verify your account. Please try again.'
        );
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ OTP Verification Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      
      // Handle different error types gracefully
      if (error.message === 'SESSION_EXPIRED') {
        console.log('⚠️ Session expired error - ignoring for login flow');
        Alert.alert(
          'Verification Failed',
          'Unable to verify. Please try again.'
        );
      } else if (error.message && error.message.includes('Cannot connect to server')) {
        console.error('🌐 Network connection error');
        Alert.alert(
          'Connection Error',
          'Cannot connect to server. Please check:\n\n1. Your internet connection\n2. Backend server is running\n3. Try again in a moment',
          [{ text: 'OK' }]
        );
      } else if (error.message && error.message.includes('Network error')) {
        console.error('🌐 Network error');
        Alert.alert(
          'Network Error',
          'Please check your internet connection and try again.',
          [{ text: 'OK' }]
        );
      } else {
        console.error('❌ Unknown error type');
        Alert.alert(
          'Verification Failed', 
          error.message || 'Unable to verify. Please check your connection and try again.'
        );
      }
    }
  };

  const resendOTP = async () => {
    if (resendTimer > 0) {
      return;
    }
    
    try {
      setResendTimer(30);
      
      // Simulate OTP resend (Demo mode - no Firebase)
      setShowOtpSentModal(true);
      
      // Auto-close modal after 800ms
      setTimeout(() => {
        setShowOtpSentModal(false);
      }, 800);
    } catch (error) {
      console.error('OTP Resend Error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleWelcomeModalClose = () => {
    // This function is no longer needed as auto-close is handled in verifyOTP
    setShowWelcomeModal(false);
  };

  return (
    <>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Top Section with Animated Bubbles */}
      <View style={styles.topSection}>
        {/* Animated Bubbles */}
        <Animated.View style={getBubbleStyle(bubble1, '10%', 60)} />
        <Animated.View style={getBubbleStyle(bubble2, '25%', 80)} />
        <Animated.View style={getBubbleStyle(bubble3, '50%', 50)} />
        <Animated.View style={getBubbleStyle(bubble4, '75%', 70)} />
        <Animated.View style={getBubbleStyle(bubble5, '85%', 55)} />

        <View style={styles.logoWrapper}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Paaso</Text>
        <Text style={styles.subtitle}>Find Work, Grow Your Business</Text>
      </View>

      {/* Bottom Section with Form */}
      <View style={styles.bottomSection}>
        <View style={styles.formCard}>
            <View style={styles.formTitleContainer}>
              <View style={[styles.formIconContainer, { backgroundColor: otpSent ? `${COLORS.accent}15` : `${COLORS.secondary}15` }]}>
                <Icon 
                  name={otpSent ? 'shield-checkmark' : 'hand-right'} 
                  size={28} 
                  color={otpSent ? COLORS.accent : COLORS.secondary} 
                />
              </View>
              <View style={styles.formTitleContent}>
                <Text style={styles.formTitle}>
                  {otpSent ? 'Verify OTP' : 'Welcome Back'}
                </Text>
                <Text style={styles.formSubtitle}>
                  {otpSent 
                    ? `Enter the 6-digit code sent to +91 ${phoneNumber}`
                    : 'Enter your mobile number to continue'
                  }
                </Text>
              </View>
            </View>

            {!otpSent ? (
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter 10-digit number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholderTextColor={COLORS.textLight}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Enter OTP</Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="• • • • • •"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  placeholderTextColor="#cbd5e1"
                  autoFocus
                />
                <TouchableOpacity 
                  style={styles.changeNumberButton}
                  onPress={() => {
                    setOtpSent(false);
                    setOtp('');
                  }}
                  activeOpacity={0.7}
                >
                  <Icon name="arrow-back" size={16} color={COLORS.accent} />
                  <Text style={styles.changeNumberText}>Change Number</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={otpSent ? verifyOTP : sendOTP}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <>
                  <Icon name="hourglass-outline" size={20} color={COLORS.white} />
                  <Text style={styles.buttonText}>Please wait...</Text>
                </>
              ) : otpSent ? (
                <>
                  <Icon name="checkmark-circle" size={20} color={COLORS.white} />
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                </>
              ) : (
                <>
                  
                  <Text style={styles.buttonText}>Send OTP</Text>
                </>
              )}
            </TouchableOpacity>

            {otpSent && (
              <View style={styles.resendContainer}>
                <Icon name="time-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.resendText}>Didn't receive code? </Text>
                {resendTimer > 0 ? (
                  <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
                ) : (
                  <TouchableOpacity onPress={resendOTP} activeOpacity={0.7}>
                    <Text style={styles.resendLink}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
      </View>
      </ScrollView>

      {/* OTP Sent Success Modal */}
      <SuccessModal
        visible={showOtpSentModal}
        onClose={() => setShowOtpSentModal(false)}
        message="OTP sent successfully"
        duration={800}
      />

      {/* Welcome Modal */}
      <SuccessModal
        visible={showWelcomeModal}
        onClose={handleWelcomeModalClose}
        message={isNewUser ? "Welcome to Paaso" : "Welcome back"}
        autoClose={false}
        duration={600}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 40,
    paddingBottom: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  logoWrapper: {
    width: 140,
    height: 140,
    borderRadius: 80,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  logo: {
    width: 110,
    height: 110,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: 1,
    zIndex: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '500',
    zIndex: 10,
  },
  bottomSection: {
    backgroundColor: COLORS.background,
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  formIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  formTitleContent: {
    flex: 1,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: `${COLORS.secondary}15`,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginRight: 12,
    borderWidth: 2,
    borderColor: `${COLORS.secondary}40`,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: `${COLORS.secondary}40`,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
    fontWeight: '500',
  },
  otpInput: {
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 16,
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    backgroundColor: `${COLORS.accent}10`,
  },
  changeNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    marginTop: 12,
  },
  changeNumberText: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    padding: 11,
    borderRadius: 14,
    elevation: 3,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  resendTimer: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});

export default LoginScreen;
