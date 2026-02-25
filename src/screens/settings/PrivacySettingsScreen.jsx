import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Switch,
  Alert,
  Linking,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';

const PrivacySettingsScreen = ({ onBack, userData }) => {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🔒 Loading privacy settings from backend');
      const response = await api.getPrivacySettings();
      if (response.success && response.settings) {
        const settings = response.settings;
        setProfileVisible(settings.profileVisible ?? true);
        setShowPhone(settings.showPhone ?? false);
        setShowLocation(settings.showLocation ?? true);
        setAllowMessages(settings.allowMessages ?? true);
        setShowOnlineStatus(settings.showOnlineStatus ?? true);
        setShareAnalytics(settings.shareAnalytics ?? true);
        console.log('✅ Privacy settings loaded successfully');
      } else {
        console.log('⚠️ No settings found, using defaults');
      }
    } catch (error) {
      console.error('❌ Load Settings Error:', error);
      // Keep default values on error
    }
  };

  const saveSettings = async (key, value) => {
    try {
      setSaving(true);
      console.log(`💾 Saving privacy setting: ${key} = ${value}`);
      const settings = {
        [key]: value
      };
      const response = await api.updatePrivacySettings(settings);
      if (response.success) {
        console.log('✅ Privacy settings saved successfully');
      } else {
        console.log('⚠️ Failed to save settings');
      }
    } catch (error) {
      console.error('❌ Save Settings Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (setter, key) => (value) => {
    setter(value);
    saveSettings(key, value);
  };

  const handleDownloadData = async () => {
    try {
      setDownloading(true);
      
      console.log('📥 Fetching data from backend...');
      
      // Fetch data from backend
      const response = await api.downloadWorkerData();
      
      if (!response.success) {
        Alert.alert('Error', 'Failed to fetch your data from server.');
        setDownloading(false);
        return;
      }
      
      const dataToDownload = response.data;
      
      // Convert to formatted JSON string
      const jsonData = JSON.stringify(dataToDownload, null, 2);
      
      // Create a blob URL and trigger download
      const fileName = `PaasoWork_Data_${new Date().getTime()}.json`;
      
      // For React Native, we'll use the Linking API to open email with data
      const emailSubject = 'My PaasoWork Data Export';
      const emailBody = `Please find my data export below:\n\n${jsonData}`;
      
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      Alert.alert(
        'Download Data',
        'Your data has been fetched from the server. Choose how you want to save it.',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Send via Email',
            onPress: async () => {
              try {
                const canOpen = await Linking.canOpenURL(mailtoUrl);
                if (canOpen) {
                  await Linking.openURL(mailtoUrl);
                } else {
                  Alert.alert('Error', 'Unable to open email app');
                }
              } catch (error) {
                console.error('Email error:', error);
                Alert.alert('Error', 'Failed to open email app');
              }
            }
          },
          {
            text: 'View Data',
            onPress: () => {
              // Show data in alert for user to copy
              Alert.alert(
                'Your Data Export',
                `Export Date: ${new Date(dataToDownload.exportDate).toLocaleString()}\n\nYou can copy this data from the console or request it via email.`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      console.log('=== YOUR DATA EXPORT ===');
                      console.log(jsonData);
                      console.log('=== END OF DATA EXPORT ===');
                      Alert.alert('Success', 'Your data has been logged to the console. You can also request it via email.');
                    }
                  }
                ]
              );
            }
          }
        ]
      );

    } catch (error) {
      console.error('Download Data Error:', error);
      Alert.alert('Error', `Failed to download data: ${error.message || 'Unknown error'}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Deletion',
              'Please contact support to delete your account. Email: support@paasowork.com',
              [
                {
                  text: 'Cancel',
                  style: 'cancel'
                },
                {
                  text: 'Contact Support',
                  onPress: () => {
                    Linking.openURL(`mailto:support@paasowork.com?subject=Account Deletion Request&body=Name: ${userData?.name}%0AMobile: ${userData?.mobile}`);
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

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
              onValueChange={handleToggle(setProfileVisible, 'profileVisible')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
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
              onValueChange={handleToggle(setShowPhone, 'showPhone')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
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
              onValueChange={handleToggle(setShowLocation, 'showLocation')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
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
              onValueChange={handleToggle(setAllowMessages, 'allowMessages')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
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
              onValueChange={handleToggle(setShowOnlineStatus, 'showOnlineStatus')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
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
              onValueChange={handleToggle(setShareAnalytics, 'shareAnalytics')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="shield-checkmark" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Account Security</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'Change Password',
                'Enter your current password and new password to change.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Change', 
                    onPress: () => {
                      Alert.alert('Coming Soon', 'Password change feature will be available soon. Please contact support for now.');
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="key-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.actionButtonText}>Change Password</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'Two-Factor Authentication',
                'Add an extra layer of security to your account with 2FA.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Enable', 
                    onPress: () => {
                      Alert.alert('Coming Soon', 'Two-factor authentication will be available in the next update.');
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="finger-print-outline" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Two-Factor Authentication</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'Trusted Devices',
                'Manage devices that have access to your account.\n\nCurrent Device: ' + Platform.OS + '\n\nYou can remove access from other devices here.',
                [
                  { text: 'OK' }
                ]
              );
            }}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="phone-portrait-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionButtonText}>Trusted Devices</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="document-text" size={22} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Data Management</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.dangerButton} 
            activeOpacity={0.7}
            onPress={handleDownloadData}
            disabled={downloading}
          >
            <Icon name="download-outline" size={20} color={COLORS.accent} />
            <Text style={styles.dangerButtonText}>
              {downloading ? 'Processing...' : 'Download My Data'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dangerButton} 
            activeOpacity={0.7}
            onPress={handleDeleteAccount}
          >
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
