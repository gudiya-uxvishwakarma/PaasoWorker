import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../constants/colors';

const { width } = Dimensions.get('window');

const SuccessModal = ({ visible, onClose, message, autoClose = true, duration = 2000 }) => {
  useEffect(() => {
    if (visible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, autoClose, duration, onClose]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            <Icon name="checkmark-circle" size={64} color={COLORS.secondary} />
          </View>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    width: width - 80,
    maxWidth: 340,
    alignItems: 'center',
    elevation: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '700',
  },
});

export default SuccessModal;
