import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const PrivacySettingsScreen = ({ onBack }) => {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Settings</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="eye" size={22} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Profile Visibility</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="person-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Public Profile</Text>
                <Text style={styles.settingSubtitle}>Make your profile visible to clients</Text>
              </View>
            </View>
            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="call-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show Phone Number</Text>
                <Text style={styles.settingSubtitle}>Display phone on profile</Text>
              </View>
            </View>
            <Switch
              value={showPhone}
              onValueChange={setShowPhone}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="location-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show Location</Text>
                <Text style={styles.settingSubtitle}>Display service areas</Text>
              </View>
            </View>
            <Switch
              value={showLocation}
              onValueChange={setShowLocation}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="chatbubbles" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Communication</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="mail-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Allow Messages</Text>
                <Text style={styles.settingSubtitle}>Receive messages from clients</Text>
              </View>
            </View>
            <Switch
              value={allowMessages}
              onValueChange={setAllowMessages}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="radio-button-on-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show Online Status</Text>
                <Text style={styles.settingSubtitle}>Let others see when you're active</Text>
              </View>
            </View>
            <Switch
              value={showOnlineStatus}
              onValueChange={setShowOnlineStatus}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="analytics" size={22} color="#f59e0b" />
            <Text style={styles.cardTitle}>Data & Analytics</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="stats-chart-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Share Analytics</Text>
                <Text style={styles.settingSubtitle}>Help us improve the app</Text>
              </View>
            </View>
            <Switch
              value={shareAnalytics}
              onValueChange={setShareAnalytics}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="shield-checkmark" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Account Security</Text>
          </View>
          
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <Icon name="key-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <Icon name="finger-print-outline" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Two-Factor Authentication</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <View style={styles.actionIconContainer}>
              <Icon name="phone-portrait-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionButtonText}>Trusted Devices</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="trash" size={22} color="#dc2626" />
            <Text style={styles.cardTitle}>Data Management</Text>
          </View>
          
          <TouchableOpacity style={styles.dangerButton} activeOpacity={0.7}>
            <Icon name="download-outline" size={20} color={COLORS.accent} />
            <Text style={styles.dangerButtonText}>Download My Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} activeOpacity={0.7}>
            <Icon name="trash-outline" size={20} color="#dc2626" />
            <Text style={[styles.dangerButtonText, { color: '#dc2626' }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.accent,
  },
  bottomPadding: {
    height: 24,
  },
});

export default PrivacySettingsScreen;
