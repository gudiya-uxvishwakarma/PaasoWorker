import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Switch,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';

const NotificationSettingsScreen = ({ onBack, userData }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' or 'history'
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchNotifications();
    }
  }, [activeTab]);

  const loadPreferences = async () => {
    try {
      const response = await api.getNotificationPreferences();
      if (response.success && response.preferences) {
        const prefs = response.preferences;
        setPushEnabled(prefs.pushEnabled ?? true);
        setJobAlerts(prefs.jobAlerts ?? true);
        setMessageAlerts(prefs.messageAlerts ?? true);
        setPaymentAlerts(prefs.paymentAlerts ?? true);
        setPromotions(prefs.promotions ?? false);
        setEmailNotifications(prefs.emailNotifications ?? true);
        setSmsNotifications(prefs.smsNotifications ?? false);
      }
    } catch (error) {
      console.error('❌ Load Preferences Error:', error);
    }
  };

  const savePreferences = async (key, value) => {
    try {
      setSaving(true);
      const preferences = {
        [key]: value
      };
      const response = await api.updateNotificationPreferences(preferences);
      if (response.success) {
        console.log('✅ Preferences saved');
      }
    } catch (error) {
      console.error('❌ Save Preferences Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (setter, key) => (value) => {
    setter(value);
    savePreferences(key, value);
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const workerId = userData?._id || userData?.id;
      
      if (!workerId) {
        console.log('⚠️ No worker ID available');
        setLoading(false);
        return;
      }
      
      const response = await api.getWorkerNotifications(workerId);
      
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (error) {
      console.error('❌ Fetch Notifications Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      const workerId = userData?._id || userData?.id;
      if (workerId && notification._id) {
        await api.markNotificationRead(notification._id, workerId);
      }
      
      // If notification has a link, you could open it here
      if (notification.bannerLink) {
        console.log('🔗 Opening link:', notification.bannerLink);
        // Linking.openURL(notification.bannerLink);
      }
    } catch (error) {
      console.error('❌ Mark Notification Read Error:', error);
    }
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
          <Text style={styles.headerTitle}>Notification Settings</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.8}
        >
          <Icon name="settings-outline" size={18} color={activeTab === 'settings' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
          activeOpacity={0.8}
        >
          <Icon name="time-outline" size={18} color={activeTab === 'history' ? COLORS.primary : COLORS.textSecondary} />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'settings' ? (
          <>
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="notifications" size={22} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Push Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="notifications-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Enable Push Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive notifications on your device</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={handleToggle(setPushEnabled, 'pushEnabled')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="briefcase" size={22} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Job Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="briefcase-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>New Job Alerts</Text>
                <Text style={styles.settingSubtitle}>Get notified about new jobs</Text>
              </View>
            </View>
            <Switch
              value={jobAlerts}
              onValueChange={handleToggle(setJobAlerts, 'jobAlerts')}
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
              <Icon name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Message Alerts</Text>
                <Text style={styles.settingSubtitle}>New messages from clients</Text>
              </View>
            </View>
            <Switch
              value={messageAlerts}
              onValueChange={handleToggle(setMessageAlerts, 'messageAlerts')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="wallet" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Payment Notifications</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="cash-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Payment Updates</Text>
                <Text style={styles.settingSubtitle}>Payment received & pending alerts</Text>
              </View>
            </View>
            <Switch
              value={paymentAlerts}
              onValueChange={handleToggle(setPaymentAlerts, 'paymentAlerts')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="megaphone" size={22} color="#f59e0b" />
            <Text style={styles.cardTitle}>Marketing</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="pricetag-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Promotions & Offers</Text>
                <Text style={styles.settingSubtitle}>Special deals and discounts</Text>
              </View>
            </View>
            <Switch
              value={promotions}
              onValueChange={handleToggle(setPromotions, 'promotions')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="mail" size={22} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Other Channels</Text>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="mail-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive updates via email</Text>
              </View>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={handleToggle(setEmailNotifications, 'emailNotifications')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Icon name="phone-portrait-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>SMS Notifications</Text>
                <Text style={styles.settingSubtitle}>Receive updates via SMS</Text>
              </View>
            </View>
            <Switch
              value={smsNotifications}
              onValueChange={handleToggle(setSmsNotifications, 'smsNotifications')}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
              disabled={saving}
            />
          </View>
        </View>

        <View style={styles.bottomPadding} />
        </>
        ) : (
          // Notification History Tab
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading notifications...</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="notifications-off-outline" size={64} color={COLORS.textSecondary} />
              <Text style={styles.emptyText}>No notifications yet</Text>
              <Text style={styles.emptySubtext}>You'll see notifications from admin here</Text>
            </View>
          ) : (
            <View>
              {notifications.map((notification, index) => (
                <TouchableOpacity 
                  key={notification._id || index} 
                  style={styles.notificationCard}
                  onPress={() => handleNotificationPress(notification)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationHeader}>
                    <Icon 
                      name={notification.type === 'Banner' ? 'image-outline' : notification.type === 'Announcement' ? 'megaphone-outline' : 'notifications'} 
                      size={20} 
                      color={COLORS.primary} 
                    />
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  {notification.type === 'Banner' && notification.bannerImage && (
                    <View style={styles.bannerBadge}>
                      <Icon name="image" size={12} color={COLORS.white} />
                      <Text style={styles.bannerBadgeText}>Banner</Text>
                    </View>
                  )}
                  <Text style={styles.notificationTime}>
                    {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={styles.bottomPadding} />
            </View>
          )
        )}
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
  bottomPadding: {
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: COLORS.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  notificationCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 4,
  },
  bannerBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default NotificationSettingsScreen;
