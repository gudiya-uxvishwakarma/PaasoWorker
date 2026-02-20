import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';

const PhoneInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder = 'Enter 10-digit number',
  required = false,
  requiredText = '*'
}) => {
  const handleChange = (text) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    onChangeText(numericValue);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>{requiredText}</Text>}
        </Text>
      )}
      <View style={styles.phoneInputContainer}>
        <View style={styles.countryCode}>
          <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
        </View>
        <TextInput
          style={styles.phoneInput}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChange}
          keyboardType="phone-pad"
          maxLength={10}
          placeholderTextColor="#94a3b8"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCode: {
    backgroundColor: `${COLORS.secondary}15`,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: `${COLORS.secondary}40`,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
});

export default PhoneInput;
