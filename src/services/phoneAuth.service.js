import auth from '@react-native-firebase/auth';
import { Platform } from 'react-native';

/**
 * Firebase Phone Authentication Service
 * Handles OTP sending, verification, and auto-read functionality
 */

class PhoneAuthService {
  constructor() {
    this.confirmation = null;
    this.verificationId = null;
  }

  /**
   * Send OTP to phone number
   * @param {string} phoneNumber - Phone number with country code (e.g., +919876543210)
   * @returns {Promise<object>} - Confirmation object
   */
  async sendOTP(phoneNumber) {
    try {
      console.log('📱 Starting OTP send process...');
      console.log('📱 Phone number:', phoneNumber);

      // Format phone number with country code
      const formattedPhone = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      console.log('📱 Formatted phone:', formattedPhone);

      // Check if Firebase Auth is initialized
      const authInstance = auth();
      console.log('🔥 Firebase Auth instance:', authInstance ? 'Available' : 'Not available');

      console.log('📱 Calling signInWithPhoneNumber...');
      
      // Send verification code with forceResend parameter
      this.confirmation = await auth().signInWithPhoneNumber(
        formattedPhone,
        true // forceResend - ensures fresh OTP
      );
      
      this.verificationId = this.confirmation.verificationId;

      console.log('✅ OTP sent successfully');
      console.log('🔑 Verification ID:', this.verificationId);

      return {
        success: true,
        confirmation: this.confirmation,
        verificationId: this.verificationId,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('❌ Send OTP Error Details:');
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send OTP';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please enter a valid Indian mobile number';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again after some time';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection';
      } else if (error.code === 'auth/missing-client-identifier') {
        errorMessage = 'Firebase configuration error. Please check google-services.json';
      } else if (error.code === 'auth/app-not-authorized') {
        errorMessage = 'App not authorized. Please add SHA-1/SHA-256 fingerprints in Firebase Console';
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = 'Firebase Phone Auth not configured. Please enable Phone Authentication in Firebase Console';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: error.code || 'unknown',
        message: errorMessage,
        details: error.message
      };
    }
  }

  /**
   * Verify OTP code
   * @param {string} code - 6-digit OTP code
   * @returns {Promise<object>} - User credential and phone number
   */
  async verifyOTP(code) {
    try {
      if (!this.confirmation) {
        console.error('❌ No confirmation object available');
        throw new Error('No confirmation object. Please send OTP first');
      }

      console.log('🔐 Verifying OTP:', code);
      console.log('🔐 Confirmation object:', this.confirmation ? 'Available' : 'Not available');

      // Confirm the verification code
      const userCredential = await this.confirmation.confirm(code);
      
      console.log('✅ OTP verified successfully');
      console.log('👤 User UID:', userCredential.user.uid);
      console.log('📱 Phone Number:', userCredential.user.phoneNumber);

      // Get Firebase ID token for backend authentication
      const idToken = await userCredential.user.getIdToken();

      return {
        success: true,
        user: userCredential.user,
        phoneNumber: userCredential.user.phoneNumber,
        uid: userCredential.user.uid,
        idToken: idToken,
        message: 'OTP verified successfully'
      };
    } catch (error) {
      console.error('❌ Verify OTP Error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      // Handle specific Firebase errors
      let errorMessage = 'Invalid OTP';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code. Please check and try again';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP expired. Please request a new one';
      } else if (error.code === 'auth/session-expired') {
        errorMessage = 'Session expired. Please request a new OTP';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (error.message && error.message.includes('confirmation')) {
        errorMessage = 'Verification session expired. Please request a new OTP';
      }

      return {
        success: false,
        error: error.code || 'unknown',
        message: errorMessage
      };
    }
  }

  /**
   * Resend OTP to the same phone number
   * @param {string} phoneNumber - Phone number with country code
   * @returns {Promise<object>} - New confirmation object
   */
  async resendOTP(phoneNumber) {
    try {
      console.log('🔄 Resending OTP to:', phoneNumber);
      
      // Clear previous confirmation
      this.confirmation = null;
      this.verificationId = null;

      // Send new OTP
      return await this.sendOTP(phoneNumber);
    } catch (error) {
      console.error('❌ Resend OTP Error:', error);
      return {
        success: false,
        error: error.code || 'unknown',
        message: 'Failed to resend OTP'
      };
    }
  }

  /**
   * Get current Firebase user
   * @returns {object|null} - Current user or null
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Sign out current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await auth().signOut();
      this.confirmation = null;
      this.verificationId = null;
      console.log('✅ User signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  }

  /**
   * Get Firebase ID token for backend authentication
   * @returns {Promise<string|null>} - ID token or null
   */
  async getIdToken() {
    try {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        return await currentUser.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('❌ Get ID token error:', error);
      return null;
    }
  }

  /**
   * Verify Firebase ID token on backend
   * @param {string} idToken - Firebase ID token
   * @returns {Promise<object>} - Decoded token
   */
  async verifyIdToken(idToken) {
    // This should be called on backend
    // Frontend just sends the token to backend for verification
    return { idToken };
  }
}

// Export singleton instance
export default new PhoneAuthService();
