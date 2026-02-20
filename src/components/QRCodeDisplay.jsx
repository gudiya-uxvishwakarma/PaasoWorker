import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';

const QRCodeDisplay = ({ onScanComplete, amount = 499 }) => {
  const handleScanConfirm = () => {
    Alert.alert(
      'QR Code Scanned ✅',
      'Please complete the payment and enter the transaction details below.',
      [
        {
          text: 'OK',
          onPress: () => onScanComplete && onScanComplete()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* QR Code Display */}
      <View style={styles.qrCodePlaceholder}>
        <View style={styles.qrCodeImageContainer}>
          {/* ASCII QR Code Pattern - Replace with actual QR image */}
          <View style={styles.qrCodePattern}>
            <Text style={styles.qrCodePatternText}>
              {`█▀▀▀▀▀█ ▀▀█▄▀ █▀▀▀▀▀█\n█ ███ █ ▄▀▀▄█ █ ███ █\n█ ▀▀▀ █ █▀▄▀█ █ ▀▀▀ █\n▀▀▀▀▀▀▀ █▄▀▄█ ▀▀▀▀▀▀▀\n▀█▄█▀▀▀▀▄▀▀▄▀▀▀█▄█▀▀▀\n ▀▀▄▀▀▀█▄▀▀▄█▀▀▄▀▀▀█▄\n█▀▀▀▀▀█ ▀▀█▄▀ ▀▀█▄▀▀\n█ ███ █ ▄▀▀▄█ ▄▀▀▄█▄\n█ ▀▀▀ █ █▀▄▀█ █▀▄▀█▀`}
            </Text>
          </View>
          <Text style={styles.qrCodeAmount}>₹{amount}</Text>
        </View>
        <Text style={styles.qrCodeText}>Scan to Pay ₹{amount}</Text>
        <Text style={styles.qrCodeHint}>Use any UPI app to scan</Text>
      </View>

      {/* Scan Confirmation Button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={handleScanConfirm}
        activeOpacity={0.7}
      >
        <Icon name="checkmark-circle" size={22} color={COLORS.white} />
        <Text style={styles.scanButtonText}>I've Scanned & Paid</Text>
      </TouchableOpacity>

      {/* Payment Instructions */}
      <View style={styles.paymentInstructions}>
        <Text style={styles.instructionsTitle}>📱 How to Pay:</Text>
        <Text style={styles.instructionItem}>1. Open any UPI app (GPay, PhonePe, Paytm)</Text>
        <Text style={styles.instructionItem}>2. Scan the QR code above</Text>
        <Text style={styles.instructionItem}>3. Enter amount: ₹{amount}</Text>
        <Text style={styles.instructionItem}>4. Complete payment</Text>
        <Text style={styles.instructionItem}>5. Enter transaction ID below</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  qrCodePlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 15,
  },
  qrCodeImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodePattern: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  qrCodePatternText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: 'monospace',
    color: '#000',
    letterSpacing: 0,
  },
  qrCodeAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 8,
  },
  qrCodeText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  qrCodeHint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 16,
    width: '90%',
  },
  scanButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  paymentInstructions: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 10,
  },
  instructionItem: {
    fontSize: 13,
    color: '#92400e',
    marginBottom: 6,
    lineHeight: 18,
  },
});

export default QRCodeDisplay;
