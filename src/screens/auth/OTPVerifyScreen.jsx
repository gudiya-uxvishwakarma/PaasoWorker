import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
  Animated,
  ScrollView,
  Platform,
  Clipboard
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFCMToken, registerFCMToken } from '../../services/fcm.service';

const OTPVerifyScreen = ({ route, navigation }) => {
  const { mobile, generatedOTP } = route.params;
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // Refs for OTP inputs
  const inputRefs = useRef([]);
  
  // Animation
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotating ring animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Auto-fill generated OTP if available
    if (generatedOTP && generatedOTP.length === 6) {
      setTimeout(() => {
        const otpDigits = generatedOTP.split('');
        setOtp(otpDigits);
        console.log('✅ Auto-filled OTP in boxes:', generatedOTP);
      }, 800);
    } else {
      // Focus first input on mount if no OTP
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 400);
    }

    // Auto-fill from clipboard if OTP detected
    if (!generatedOTP) {
      checkClipboardForOTP();
    }
  }, [generatedOTP]);

  // Check clipboard for OTP
  const checkClipboardForOTP = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      // Check if clipboard contains 6 digit OTP
      const otpMatch = clipboardContent.match(/\b\d{6}\b/);
      if (otpMatch) {
        const otpDigits = otpMatch[0].split('');
        setOtp(otpDigits);
        // Auto-verify
        setTimeout(() => {
          verifyOTP(otpMatch[0]);
        }, 500);
      }
    } catch (error) {
      console.log('Clipboard check failed:', error);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOTPChange = (value, index) => {
    // Handle paste - distribute digits across boxes
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      const newOTP = [...otp];
      
      digits.forEach((digit, i) => {
        if (index + i < 6 && /^\d$/.test(digit)) {
          newOTP[index + i] = digit;
        }
      });
      
      setOtp(newOTP);
      
      // Focus last filled box or next empty box
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      
      // Auto-verify if all 6 digits filled
      const fullOTP = newOTP.join('');
      if (fullOTP.length === 6) {
        setTimeout(() => verifyOTP(fullOTP), 300);
      }
      return;
    }

    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits entered
    if (index === 5 && value) {
      const fullOTP = newOTP.join('');
      if (fullOTP.length === 6) {
        setTimeout(() => verifyOTP(fullOTP), 300);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
    ]).start();
  };

  const verifyOTP = async (otpCode = null) => {
    const codeToVerify = otpCode || otp.join('');
    
    if (codeToVerify.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Verifying OTP:', codeToVerify);
      
      // Get FCM token before verification
      let fcmToken = null;
      try {
        fcmToken = await getFCMToken();
        console.log('📱 FCM Token obtained for OTP verification');
      } catch (fcmError) {
        console.warn('⚠️ Could not get FCM token:', fcmError.message);
      }
      
      // Verify OTP with backend (include FCM token)
      const response = await api.verifyOTP(
        mobile, 
        codeToVerify,
        fcmToken,
        Platform.OS,
        {
          model: Platform.constants?.Model || 'unknown',
          osVersion: Platform.Version?.toString() || 'unknown'
        }
      );
      
      console.log('📦 Verify OTP Response:', response);

      if (!response.success) {
        setLoading(false);
        shakeError();
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        Alert.alert('Verification Failed', response.message || 'Invalid OTP. Please try again.');
        return;
      }

      console.log('✅ OTP verified successfully');

      setLoading(false);

      if (response.exists && response.worker) {
        // Existing user - check status
        console.log('✅ Existing user found');
        console.log('👤 Worker Status:', response.worker.status);

        // ✅ Store JWT token if provided
        if (response.token) {
          await AsyncStorage.setItem('authToken', response.token);
          console.log('🔑 JWT token stored');
        }

        // Store auth data
        const authData = {
          mobile: mobile,
          workerId: response.worker._id,
          verified: true,
          token: response.token // ✅ Include token in auth data
        };
        await AsyncStorage.setItem('userAuth', JSON.stringify(authData));
        console.log('💾 Auth data saved');

        // ✅ CRITICAL: Register FCM token for push notifications
        // This ensures notifications work even when app is closed/background
        try {
          console.log('🔔 Registering FCM token for user:', response.worker._id);
          
          // Store user ID for token refresh
          await AsyncStorage.setItem('@user_id', response.worker._id);
          
          // Get fresh FCM token
          const fcmToken = await getFCMToken();
          
          if (fcmToken && response.worker._id) {
            console.log('📱 FCM Token obtained, registering with backend...');
            const registered = await registerFCMToken(response.worker._id, fcmToken);
            
            if (registered) {
              console.log('✅ FCM token registered successfully');
              console.log('📲 Push notifications enabled for background/closed app');
              
              // Store registration status
              await AsyncStorage.setItem('@fcm_registered', 'true');
              await AsyncStorage.setItem('@fcm_last_registered', new Date().toISOString());
            } else {
              console.warn('⚠️ FCM token registration failed, but continuing...');
            }
          } else {
            console.warn('⚠️ FCM token or worker ID not available');
          }
        } catch (fcmError) {
          console.error('❌ FCM token registration error:', fcmError.message);
          // Don't block login flow for FCM errors
        }

        if (response.worker.status === 'Approved' || response.worker.status === 'Pending') {
          // Navigate to dashboard for existing users
          Alert.alert(
            'Welcome Back!',
            `Hello ${response.worker.name}`,
            [
              {
                text: 'Continue',
                onPress: () => {
                  // Navigate to home/dashboard with user data
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'home' }],
                  });
                  // Pass user data through navigation
                  navigation.navigate('home', response.worker);
                }
              }
            ]
          );
        } else if (response.worker.status === 'Rejected') {
          Alert.alert(
            'Registration Rejected',
            response.worker.rejectionReason || 'Your registration was rejected. Please contact support.'
          );
        } else if (response.worker.status === 'Blocked') {
          Alert.alert(
            'Account Blocked',
            'Your account has been blocked. Please contact support.'
          );
        } else {
          Alert.alert(
            'Account Issue',
            `Your account status is ${response.worker.status}. Please contact support.`
          );
        }
      } else {
        // New user - redirect to registration flow
        console.log('🆕 New user - redirecting to registration');
        
        const authData = {
          mobile: mobile,
          verified: true
        };
        await AsyncStorage.setItem('userAuth', JSON.stringify(authData));

        Alert.alert(
          'Welcome to Paaso!',
          'Let\'s complete your profile',
          [
            {
              text: 'Continue',
              onPress: () => {
                // Navigate to WorkerTypeSelection for new users
                navigation.navigate('workerTypeSelection', { mobile });
              }
            }
          ]
        );
      }
    } catch (error) {
      setLoading(false);
      shakeError();
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      console.error('❌ OTP Verification Error:', error);
      Alert.alert(
        'Verification Failed',
        error.message || 'Unable to verify OTP. Please try again.'
      );
    }
  };

  const resendOTP = async () => {
    if (!canResend) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Resending OTP');
      
      const response = await api.sendOTP(mobile);
      
      if (response.success) {
        console.log('✅ OTP resent successfully');
        console.log('📱 New OTP:', response.otp);
        
        setResendTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        Alert.alert(
          'OTP Sent',
          `New OTP: ${response.otp}\n\nOTP has been sent successfully.`
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('❌ Resend OTP Error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Animated Gradient Header Background */}
      <View style={styles.headerBackground}>
        <View style={styles.headerCircle1} />
        <View style={styles.headerCircle2} />
        <View style={styles.headerCircle3} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Animated Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Premium Icon with Pulse Effect */}
          <View style={styles.iconContainer}>
            {/* Rotating Ring */}
            <Animated.View 
              style={[
                styles.iconRotatingRing,
                { transform: [{ rotate: spin }] }
              ]}
            />
            {/* Pulse Background */}
            <View style={styles.iconPulse} />
            {/* Main Icon Circle with Pulse */}
            <Animated.View 
              style={[
                styles.iconCircle,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <View style={styles.iconInner}>
                <Icon name="shield-checkmark" size={50} color={COLORS.white} />
              </View>
            </Animated.View>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Verification Code</Text>
            <View style={styles.titleUnderline} />
          </View>
          
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to
          </Text>
          <View style={styles.phoneContainer}>
            <Icon name="call" size={16} color={COLORS.primary} />
            <Text style={styles.phoneNumber}>+91 {mobile}</Text>
          </View>

          {/* Premium OTP Input */}
          <View style={styles.otpSection}>
            <Text style={styles.otpLabel}>Enter Code</Text>

           

            <Animated.View 
              style={[
                styles.otpContainer,
                { transform: [{ translateX: shakeAnimation }] }
              ]}
            >
              {otp.map((digit, index) => (
                <View key={index} style={styles.otpInputWrapper}>
                  <View style={[
                    styles.otpInputBorder,
                    digit && styles.otpInputBorderFilled
                  ]}>
                    <TextInput
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        digit && styles.otpInputFilled
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOTPChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      autoComplete="sms-otp"
                      textContentType="oneTimeCode"
                    />
                  </View>
                  {digit && (
                    <View style={styles.otpInputCheck}>
                      <Icon name="checkmark" size={12} color={COLORS.white} />
                    </View>
                  )}
                </View>
              ))}
            </Animated.View>
          </View>

          {/* Premium Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (loading || otp.join('').length !== 6) && styles.verifyButtonDisabled
            ]}
            onPress={() => verifyOTP()}
            disabled={loading || otp.join('').length !== 6}
            activeOpacity={0.8}
          >
            <View style={styles.buttonGradient}>
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.verifyButtonText}>Verifying...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Icon name="shield-checkmark-outline" size={24} color={COLORS.white} />
                  <Text style={styles.verifyButtonText}>
                    {otp.join('').length === 6 ? 'Verify & Continue' : `${6 - otp.join('').length} digits remaining`}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Premium Resend Section */}
          <View style={styles.resendSection}>
            <View style={styles.resendDivider}>
              <View style={styles.resendLine} />
              <Text style={styles.resendDividerText}>or</Text>
              <View style={styles.resendLine} />
            </View>
            
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              {canResend ? (
                <TouchableOpacity 
                  style={styles.resendButton}
                  onPress={resendOTP} 
                  disabled={loading} 
                  activeOpacity={0.7}
                >
                  <Icon name="refresh-circle" size={20} color={COLORS.accent} />
                  <Text style={styles.resendLink}>Resend Code</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.timerContainer}>
                  <View style={styles.timerCircle}>
                    <Icon name="time" size={14} color={COLORS.accent} />
                  </View>
                  <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  headerCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.12)',
    top: -80,
    right: -60,
  },
  headerCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -40,
    left: -40,
  },
  headerCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: 60,
    left: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 24,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerPlaceholder: {
    width: 44,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 32,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRotatingRing: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.accent,
    borderBottomColor: '#26a6da',
    borderLeftColor: COLORS.accent,
  },
  iconPulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  iconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  testCodeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: `${COLORS.accent}30`,
  },
  testCodeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.accent,
    letterSpacing: 5,
  },
  otpSection: {
    width: '100%',
    marginBottom: 32,
  },
  otpLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  otpHintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#26a6da15',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#26a6da30',
  },
  otpHintText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#26a6da',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    paddingHorizontal: 4,
  },
  otpInputWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputBorder: {
    padding: 3,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  otpInputBorderFilled: {
    backgroundColor: '#26a6da',
    elevation: 6,
    shadowColor: '#26a6da',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 16,
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#333333',
    backgroundColor: COLORS.white,
    padding: 0,
    paddingTop: Platform.OS === 'android' ? 2 : 0,
    includeFontPadding: false,
    lineHeight: 60,
  },
  otpInputFilled: {
    color: COLORS.primary,
    backgroundColor: COLORS.white,
    fontSize: 34,
    fontWeight: '900',
  },
  otpInputCheck: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#26a6da',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#26a6da',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  verifyButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  verifyButtonDisabled: {
    elevation: 2,
    opacity: 0.7,
  },
  buttonGradient: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  resendSection: {
    width: '100%',
    marginTop: 32,
  },
  resendDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  resendDividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  resendContainer: {
    alignItems: 'center',
    gap: 12,
  },
  resendText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: `${COLORS.accent}15`,
    borderWidth: 1,
    borderColor: `${COLORS.accent}30`,
  },
  resendLink: {
    color: COLORS.accent,
    fontSize: 15,
    fontWeight: 'bold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  timerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${COLORS.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendTimer: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default OTPVerifyScreen;
