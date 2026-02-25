import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Image,
  Linking,
  Switch
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';

const NotificationSettingsScreen = ({ onBack, userData }) => {
  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications', 'banner', 'settings'
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    pushEnabled: true,
    jobAlerts: true,
    messageAlerts: true,
    paymentAlerts: true,
    promotions: false,
    emailNotifications: true,
    smsNotifications: false
  });
  const [savingPreferences, setSavingPreferences] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const workerId = userData?._id || userData?.id;
      
      if (!workerId) {
        console.log('⚠️ No worker ID available');
        setLoading(false);
        return;
      }
      
      console.log('🔔 Fetching notifications for worker:', workerId);
      const response = await api.getWorkerNotifications(workerId);
      
      if (response.success) {
        const notificationsList = response.notifications || [];
        // Sort by date - newest first
        const sortedNotifications = notificationsList.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNotifications(sortedNotifications);
        console.log(`✅ Loaded ${sortedNotifications.length} notifications`);
      } else {
        console.log('⚠️ Failed to fetch notifications');
        setNotifications([]);
      }
    } catch (error) {
      console.error('❌ Fetch Notifications Error:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      console.log('🔔 Fetching notification preferences');
      const response = await api.getNotificationPreferences();
      
      if (response.success && response.preferences) {
        setPreferences(response.preferences);
        console.log('✅ Preferences loaded:', response.preferences);
      }
    } catch (error) {
      console.error('❌ Fetch Preferences Error:', error);
    }
  };

  const updatePreference = async (key, value) => {
    try {
      setSavingPreferences(true);
      
      // Update local state immediately for better UX
      const updatedPreferences = { ...preferences, [key]: value };
      setPreferences(updatedPreferences);
      
      console.log('🔔 Updating preference:', key, '=', value);
      const response = await api.updateNotificationPreferences(updatedPreferences);
      
      if (response.success) {
        console.log('✅ Preference updated successfully');
      } else {
        // Revert on failure
        setPreferences(preferences);
        console.log('⚠️ Failed to update preference');
      }
    } catch (error) {
      console.error('❌ Update Preference Error:', error);
      // Revert on error
      setPreferences(preferences);
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleNotificationPress = async (notification) => {
    try {
      const workerId = userData?._id || userData?.id;
      if (workerId && notification._id) {
        console.log('✅ Marking notification as read:', notification._id);
        await api.markNotificationRead(notification._id, workerId);
        
        // Update local state to increment click count
        setNotifications(prev => prev.map(n => 
          n._id === notification._id 
            ? { ...n, clickCount: (n.clickCount || 0) + 1 }
            : n
        ));
      }
      
      // If notification has a link, open it
      if (notification.bannerLink) {
        console.log('🔗 Opening notification link:', notification.bannerLink);
        try {
          const canOpen = await Linking.canOpenURL(notification.bannerLink);
          if (canOpen) {
            await Linking.openURL(notification.bannerLink);
          }
        } catch (error) {
          console.error('❌ Error opening link:', error);
        }
      }
    } catch (error) {
      console.error('❌ Mark Notification Read Error:', error);
    }
  };

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    if (activeTab === 'notifications') {
      // Show Push and Announcement notifications
      return notifications.filter(n => n.type === 'Push' || n.type === 'Announcement');
    } else if (activeTab === 'banner') {
      // Show only banner notifications
      return notifications.filter(n => n.type === 'Banner');
    }
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();

  // Get notification counts
  const notificationCount = notifications.filter(n => n.type === 'Push' || n.type === 'Announcement').length;
  const bannerCount = notifications.filter(n => n.type === 'Banner').length;

  // Render Settings Tab
  const renderSettingsTab = () => (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Push Notifications</Text>
        <Text style={styles.sectionDescription}>
          Manage your notification preferences
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="notifications" size={20} color={COLORS.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingDescription}>Enable all push notifications</Text>
            </View>
          </View>
          <Switch
            value={preferences.pushEnabled}
            onValueChange={(value) => updatePreference('pushEnabled', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="briefcase" size={20} color={COLORS.accent} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Job Alerts</Text>
              <Text style={styles.settingDescription}>Get notified about new job opportunities</Text>
            </View>
          </View>
          <Switch
            value={preferences.jobAlerts}
            onValueChange={(value) => updatePreference('jobAlerts', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="chatbubbles" size={20} color={COLORS.secondary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Message Alerts</Text>
              <Text style={styles.settingDescription}>Notifications for new messages</Text>
            </View>
          </View>
          <Switch
            value={preferences.messageAlerts}
            onValueChange={(value) => updatePreference('messageAlerts', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="card" size={20} color={COLORS.success} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Payment Alerts</Text>
              <Text style={styles.settingDescription}>Updates about payments and transactions</Text>
            </View>
          </View>
          <Switch
            value={preferences.paymentAlerts}
            onValueChange={(value) => updatePreference('paymentAlerts', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="pricetag" size={20} color={COLORS.warning} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Promotions</Text>
              <Text style={styles.settingDescription}>Special offers and promotional content</Text>
            </View>
          </View>
          <Switch
            value={preferences.promotions}
            onValueChange={(value) => updatePreference('promotions', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Other Channels</Text>
        <Text style={styles.sectionDescription}>
          Manage notifications via email and SMS
        </Text>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="mail" size={20} color={COLORS.primary} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>Receive updates via email</Text>
            </View>
          </View>
          <Switch
            value={preferences.emailNotifications}
            onValueChange={(value) => updatePreference('emailNotifications', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Icon name="phone-portrait" size={20} color={COLORS.accent} />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>SMS Notifications</Text>
              <Text style={styles.settingDescription}>Receive updates via SMS</Text>
            </View>
          </View>
          <Switch
            value={preferences.smsNotifications}
            onValueChange={(value) => updatePreference('smsNotifications', value)}
            trackColor={{ false: COLORS.border, true: COLORS.primary }}
            thumbColor={COLORS.white}
            disabled={savingPreferences}
          />
        </View>
      </View>

      {savingPreferences && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.savingText}>Saving preferences...</Text>
        </View>
      )}
    </View>
  );

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
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Tabs - 3 tabs now */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}
          activeOpacity={0.7}
        >
          <Icon 
            name="notifications" 
            size={20} 
            color={activeTab === 'notifications' ? COLORS.white : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            Alerts ({notificationCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'banner' && styles.activeTab]}
          onPress={() => setActiveTab('banner')}
          activeOpacity={0.7}
        >
          <Icon 
            name="image" 
            size={20} 
            color={activeTab === 'banner' ? COLORS.white : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'banner' && styles.activeTabText]}>
            Banners ({bannerCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.7}
        >
          <Icon 
            name="settings" 
            size={20} 
            color={activeTab === 'settings' ? COLORS.white : COLORS.textSecondary} 
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'settings' ? (
          renderSettingsTab()
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="notifications-off-outline" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>
              {activeTab === 'notifications' ? 'No notifications yet' : 'No banner notifications'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'notifications' 
                ? "You'll see push notifications and announcements here" 
                : "Banner notifications with images will appear here"}
            </Text>
          </View>
        ) : (
          <View>
            {filteredNotifications.map((notification, index) => (
              <TouchableOpacity 
                key={notification._id || index} 
                style={[
                  styles.notificationCard,
                  notification.type === 'Banner' && styles.bannerNotificationCard
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View style={styles.notificationHeader}>
                  <View style={[
                    styles.notificationIconContainer,
                    { backgroundColor: 
                      notification.type === 'Banner' ? `${COLORS.accent}15` :
                      notification.type === 'Announcement' ? `${COLORS.secondary}15` :
                      `${COLORS.primary}15`
                    }
                  ]}>
                    <Icon 
                      name={
                        notification.type === 'Banner' ? 'image' : 
                        notification.type === 'Announcement' ? 'megaphone' : 
                        'notifications'
                      } 
                      size={18} 
                      color={
                        notification.type === 'Banner' ? COLORS.accent :
                        notification.type === 'Announcement' ? COLORS.secondary :
                        COLORS.primary
                      } 
                    />
                  </View>
                  <View style={styles.notificationTitleContainer}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor:
                        notification.type === 'Banner' ? COLORS.accent :
                        notification.type === 'Announcement' ? COLORS.secondary :
                        COLORS.primary
                      }
                    ]}>
                      <Text style={styles.typeBadgeText}>{notification.type}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.notificationMessage}>{notification.message}</Text>

                {/* Banner Image */}
                {notification.type === 'Banner' && notification.bannerImage && (
                  <View style={styles.bannerImageContainer}>
                    <Image 
                      source={{ uri: notification.bannerImage }} 
                      style={styles.bannerImage}
                      resizeMode="cover"
                    />
                    {notification.bannerLink && (
                      <View style={styles.linkBadge}>
                        <Icon name="link" size={12} color={COLORS.white} />
                        <Text style={styles.linkBadgeText}>Tap to open</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Stats */}
                <View style={styles.notificationFooter}>
                  <View style={styles.statsRow}>
                    <Icon name="time-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.notificationTime}>
                      {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })} at {new Date(notification.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                  {notification.clickCount > 0 && (
                    <View style={styles.statsRow}>
                      <Icon name="eye-outline" size={14} color={COLORS.textLight} />
                      <Text style={styles.statsText}>{notification.clickCount} views</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.bottomPadding} />
          </View>
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: `${COLORS.primary}10`,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  bottomPadding: {
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
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
    marginTop: 60,
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
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
  },
  bannerNotificationCard: {
    borderLeftColor: COLORS.accent,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  bannerImageContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: 160,
    borderRadius: 10,
  },
  linkBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  linkBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  statsText: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  settingsContainer: {
    padding: 16,
  },
  settingsSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 10,
    marginTop: 8,
  },
  savingText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default NotificationSettingsScreen;
