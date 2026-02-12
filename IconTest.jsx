/**
 * Icon Test Component
 * Use this to verify react-native-vector-icons is working properly
 * 
 * To test: Import this in App.jsx temporarily
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IconTest = () => {
  const testIcons = [
    { name: 'home', label: 'Home' },
    { name: 'person', label: 'Person' },
    { name: 'people', label: 'People' },
    { name: 'construct', label: 'Construct' },
    { name: 'business', label: 'Business' },
    { name: 'checkmark-circle', label: 'Checkmark' },
    { name: 'arrow-back', label: 'Back' },
    { name: 'arrow-forward', label: 'Forward' },
    { name: 'star', label: 'Star' },
    { name: 'rocket', label: 'Rocket' },
    { name: 'diamond', label: 'Diamond' },
    { name: 'shield-checkmark', label: 'Shield' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Icon Test - Ionicons</Text>
      <Text style={styles.subtitle}>
        If you see icons below, react-native-vector-icons is working!
      </Text>
      
      <View style={styles.grid}>
        {testIcons.map((icon, index) => (
          <View key={index} style={styles.iconBox}>
            <Icon name={icon.name} size={40} color="#2e2b6d" />
            <Text style={styles.iconLabel}>{icon.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.successBox}>
        <Icon name="checkmark-circle" size={30} color="#10b981" />
        <Text style={styles.successText}>
          Icons are working correctly!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  iconBox: {
    width: '30%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  iconLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
});

export default IconTest;
