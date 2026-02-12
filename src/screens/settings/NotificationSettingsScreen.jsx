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

const NotificationSettingsScreen = ({ onBack }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              onValueChange={setPushEnabled}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
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
              onValueChange={setJobAlerts}
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
              <Icon name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Message Alerts</Text>
                <Text style={styles.settingSubtitle}>New messages from clients</Text>
              </View>
            </View>
            <Switch
              value={messageAlerts}
              onValueChange={setMessageAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
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
              onValueChange={setPaymentAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
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
              onValueChange={setPromotions}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
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
              onValueChange={setEmailNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
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
              onValueChange={setSmsNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
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
  bottomPadding: {
    height: 24,
  },
});

export default NotificationSettingsScreen;
