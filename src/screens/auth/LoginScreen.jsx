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
  Animated,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import SuccessModal from '../../components/SuccessModal';
import * as api from '../../services/api';

const LoginScreen = ({ onLogin, onNewUser, onNavigateToOTPVerify }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showOtpSentModal, setShowOtpSentModal] = useState(false);

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
      console.log('📱 Sending OTP to:', phoneNumber);
      
      // Send OTP using backend API
      const result = await api.sendOTP(phoneNumber);
      
      if (result.success) {
        console.log('✅ OTP generated successfully');
        console.log('📱 Generated OTP:', result.otp);
        
        setLoading(false);
        
        // Show OTP sent modal
        setShowOtpSentModal(true);
        
        // Navigate to OTP Verify Screen after 1500ms
        setTimeout(() => {
          setShowOtpSentModal(false);
          onNavigateToOTPVerify(phoneNumber, result.otp);
        }, 1500);
      } else {
        setLoading(false);
        console.error('❌ OTP generation failed:', result.message);
        Alert.alert('Error', result.message || 'Failed to generate OTP. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('❌ OTP Generation Error:', error);
      Alert.alert('Error', 'Failed to generate OTP. Please check your connection and try again.');
    }
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
              <View style={[styles.formIconContainer, { backgroundColor: `${COLORS.secondary}15` }]}>
                <Icon 
                  name="sparkles" 
                  size={28} 
                  color={COLORS.secondary} 
                />
              </View>
              <View style={styles.formTitleContent}>
                <Text style={styles.formTitle}>Welcome Back</Text>
                <Text style={styles.formSubtitle}>
                  Enter your mobile number to continue
                </Text>
              </View>
            </View>

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

            <TouchableOpacity
              style={[
                styles.button, 
                loading && styles.buttonDisabled
              ]}
              onPress={sendOTP}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.buttonText}>Generating OTP...</Text>
                </>
              ) : (
                <>
                
                  <Text style={styles.buttonText}>Generate OTP</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
      </View>
      </ScrollView>

      {/* OTP Generated Success Modal */}
      <SuccessModal
        visible={showOtpSentModal}
        onClose={() => setShowOtpSentModal(false)}
        message="OTP generated successfully"
        duration={1500}
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    padding: 16,
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
});

export default LoginScreen;
