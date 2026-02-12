import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet,
  StatusBar,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import NotificationSettingsScreen from '../settings/NotificationSettingsScreen';
import PrivacySettingsScreen from '../settings/PrivacySettingsScreen';
import HelpSupportScreen from '../settings/HelpSupportScreen';
import TermsPrivacyScreen from '../settings/TermsPrivacyScreen';

const ProfileScreen = ({ userData, onNavigate, onBack, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [skills, setSkills] = useState(userData?.skills || '');
  const [serviceAreas, setServiceAreas] = useState(userData?.serviceAreas || '');
  const [currentScreen, setCurrentScreen] = useState('profile');

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (onLogout) {
              onLogout();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getWorkerTypeInfo = () => {
    const types = {
      individual: { icon: 'person', label: 'Individual Worker', color: COLORS.accent },
      crew_leader: { icon: 'people', label: 'Crew Leader', color: COLORS.secondary },
      contractor: { icon: 'construct', label: 'Contractor', color: COLORS.primary },
      service_provider: { icon: 'business', label: 'Service Provider', color: '#f59e0b' },
    };
    return types[userData?.workerType] || { icon: 'person', label: 'Worker', color: COLORS.accent };
  };

  const workerTypeInfo = getWorkerTypeInfo();

  if (currentScreen === 'notifications') {
    return <NotificationSettingsScreen onBack={() => setCurrentScreen('profile')} />;
  }

  if (currentScreen === 'privacy') {
    return <PrivacySettingsScreen onBack={() => setCurrentScreen('profile')} />;
  }

  if (currentScreen === 'help') {
    return <HelpSupportScreen onBack={() => setCurrentScreen('profile')} />;
  }

  if (currentScreen === 'terms') {
    return <TermsPrivacyScreen onBack={() => setCurrentScreen('profile')} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => onBack ? onBack() : onNavigate('home')}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
            activeOpacity={0.8}
          >
            <Icon 
              name={isEditing ? 'checkmark' : 'create-outline'} 
              size={20} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarContainer, { backgroundColor: workerTypeInfo.color }]}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <View style={styles.workerTypeBadge}>
            <Icon name={workerTypeInfo.icon} size={16} color={workerTypeInfo.color} />
            <Text style={[styles.workerTypeText, { color: workerTypeInfo.color }]}>
              {workerTypeInfo.label}
            </Text>
          </View>
          <View style={styles.badgeContainer}>
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark-circle" size={14} color={COLORS.primary} />
              <Text style={styles.verifiedText}>Phone Verified</Text>
            </View>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="information-circle-outline" size={22} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Basic Information</Text>
          </View>
          
          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Full Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textLight}
              />
            ) : (
              <Text style={styles.infoValue}>{name}</Text>
            )}
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Email ID</Text>
            <View style={styles.infoValueRow}>
              <Icon name="mail-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.infoValue}>{userData?.email || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Mobile Number</Text>
            <View style={styles.infoValueRow}>
              <Icon name="call-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.infoValue}>{userData?.mobile || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Worker Type</Text>
            <View style={styles.infoValueRow}>
              <Icon name={workerTypeInfo.icon} size={18} color={workerTypeInfo.color} />
              <Text style={styles.infoValue}>{workerTypeInfo.label}</Text>
            </View>
          </View>

          <View style={styles.infoGroup}>
            <Text style={styles.infoLabel}>Member Since</Text>
            <View style={styles.infoValueRow}>
              <Icon name="calendar-outline" size={18} color={COLORS.textSecondary} />
              <Text style={styles.infoValue}>January 2025</Text>
            </View>
          </View>
        </View>

        {/* Languages */}
        {userData?.selectedLanguages && userData.selectedLanguages.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Languages</Text>
            </View>
            
            <View style={styles.skillsContainer}>
              {userData.selectedLanguages.map((language, index) => (
                <View key={index} style={[styles.skillChip, { backgroundColor: '#8b5cf615', borderColor: '#8b5cf640' }]}>
                  <Text style={[styles.skillText, { color: '#8b5cf6' }]}>{language}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skills & Services */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="construct-outline" size={22} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Services</Text>
          </View>
          
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={skills}
              onChangeText={setSkills}
              multiline
              numberOfLines={4}
              placeholder="Enter your services"
              placeholderTextColor={COLORS.textLight}
            />
          ) : (
            <View style={styles.skillsContainer}>
              {(userData?.services || skills).split(',').map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Icon name="checkmark-circle" size={14} color={COLORS.accent} />
                  <Text style={styles.skillText}>{skill.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Service Areas / Location */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="location-outline" size={22} color="#ef4444" />
            <Text style={styles.cardTitle}>Location / Service Areas</Text>
          </View>
          
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={serviceAreas}
              onChangeText={setServiceAreas}
              multiline
              numberOfLines={4}
              placeholder="Enter service areas"
              placeholderTextColor={COLORS.textLight}
            />
          ) : (
            <View style={styles.areasContainer}>
              {(userData?.serviceAreas || serviceAreas).split(',').map((area, index) => (
                <View key={index} style={styles.areaChip}>
                  <Icon name="location" size={14} color={COLORS.primary} />
                  <Text style={styles.areaText}>{area.trim()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Verification Status */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="shield-checkmark-outline" size={22} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Verification Status</Text>
          </View>
          
          <View style={styles.verificationItem}>
            <View style={[styles.verificationIcon, { backgroundColor: `${COLORS.primary}20` }]}>
              <Icon name="checkmark-circle" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationTitle}>Phone Number</Text>
              <Text style={styles.verificationStatus}>Verified</Text>
            </View>
          </View>

          <View style={styles.verificationItem}>
            <View style={[styles.verificationIcon, { backgroundColor: '#fef3c7' }]}>
              <Icon name="time-outline" size={24} color="#ca8a04" />
            </View>
            <View style={styles.verificationInfo}>
              <Text style={styles.verificationTitle}>KYC Documents</Text>
              <Text style={styles.verificationStatusPending}>Not Uploaded</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.uploadButton} activeOpacity={0.8}>
            <Icon name="cloud-upload-outline" size={20} color={COLORS.accent} />
            <Text style={styles.uploadButtonText}>Upload KYC Documents</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.premiumTitle}>Premium Verification Badges</Text>
          
          <TouchableOpacity style={styles.premiumBadge} activeOpacity={0.7}>
            <View style={styles.premiumBadgeContent}>
              <View style={styles.premiumBadgeIconContainer}>
                <Icon name="star" size={20} color="#f59e0b" />
              </View>
              <View style={styles.premiumBadgeInfo}>
                <Text style={styles.premiumBadgeTitle}>Trusted Pro</Text>
                <Text style={styles.premiumBadgeSubtitle}>KYC verified + Priority support</Text>
              </View>
            </View>
            <View style={styles.premiumBadgePrice}>
              <Text style={styles.premiumBadgePriceAmount}>₹499</Text>
              <Text style={styles.premiumBadgePricePeriod}>/year</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.premiumBadge} activeOpacity={0.7}>
            <View style={styles.premiumBadgeContent}>
              <View style={styles.premiumBadgeIconContainer}>
                <Icon name="briefcase" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.premiumBadgeInfo}>
                <Text style={styles.premiumBadgeTitle}>Business Verified</Text>
                <Text style={styles.premiumBadgeSubtitle}>GST verified + Business badge</Text>
              </View>
            </View>
            <View style={styles.premiumBadgePrice}>
              <Text style={styles.premiumBadgePriceAmount}>₹999</Text>
              <Text style={styles.premiumBadgePricePeriod}>/year</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Working Schedule */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="calendar-outline" size={22} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Working Schedule</Text>
          </View>
          
          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleLeft}>
              <Icon name="calendar" size={18} color={COLORS.textSecondary} />
              <Text style={styles.scheduleLabel}>Working Days</Text>
            </View>
            <Text style={styles.scheduleValue}>Mon - Sat</Text>
          </View>
          
          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleLeft}>
              <Icon name="time" size={18} color={COLORS.textSecondary} />
              <Text style={styles.scheduleLabel}>Working Hours</Text>
            </View>
            <Text style={styles.scheduleValue}>9:00 AM - 6:00 PM</Text>
          </View>

          <TouchableOpacity style={styles.scheduleButton} activeOpacity={0.8}>
            <Icon name="create-outline" size={18} color={COLORS.accent} />
            <Text style={styles.scheduleButtonText}>Update Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Crew Management (for Crew Leaders) */}
        {userData?.workerType === 'crew_leader' && (
          <View style={styles.card}>
            <View style={styles.cardTitleContainer}>
              <Icon name="people-outline" size={22} color={COLORS.secondary} />
              <Text style={styles.cardTitle}>Crew Management</Text>
            </View>
            
            <View style={styles.crewInfo}>
              <View style={styles.crewLeft}>
                <Icon name="people" size={18} color={COLORS.textSecondary} />
                <Text style={styles.crewLabel}>Team Size</Text>
              </View>
              <Text style={styles.crewValue}>{userData?.crewSize || 0} members</Text>
            </View>

            <TouchableOpacity style={styles.manageButton} activeOpacity={0.8}>
              <Icon name="settings-outline" size={18} color={COLORS.accent} />
              <Text style={styles.manageButtonText}>Manage Team Members</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Account Actions */}
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="settings-outline" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Account Settings</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => setCurrentScreen('notifications')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="notifications-outline" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.actionButtonText}>Notification Settings</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => setCurrentScreen('privacy')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="lock-closed-outline" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.actionButtonText}>Privacy Settings</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => setCurrentScreen('help')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="help-circle-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.actionButtonText}>Help & Support</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => setCurrentScreen('terms')}
          >
            <View style={styles.actionIconContainer}>
              <Icon name="document-text-outline" size={20} color="#64748b" />
            </View>
            <Text style={styles.actionButtonText}>Terms & Privacy Policy</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileHeader: {
    backgroundColor: COLORS.surface,
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  workerTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  workerTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  infoGroup: {
    marginBottom: 18,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  infoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${COLORS.accent}15`,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
  },
  skillText: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '500',
  },
  areasContainer: {
    gap: 10,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${COLORS.primary}40`,
  },
  areaText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  verificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  verificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  verificationInfo: {
    flex: 1,
  },
  verificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  verificationStatus: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '500',
  },
  verificationStatusPending: {
    fontSize: 13,
    color: '#ca8a04',
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${COLORS.accent}15`,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
  },
  uploadButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },
  premiumTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  premiumBadge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  premiumBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumBadgeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  premiumBadgeInfo: {
    flex: 1,
  },
  premiumBadgeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  premiumBadgeSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  premiumBadgePrice: {
    alignItems: 'flex-end',
  },
  premiumBadgePriceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  premiumBadgePricePeriod: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  scheduleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scheduleLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  scheduleValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${COLORS.accent}15`,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
  },
  scheduleButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  crewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 12,
  },
  crewLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crewLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  crewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: `${COLORS.accent}15`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.accent}40`,
  },
  manageButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fee2e2',
  },
  logoutButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 24,
  },
});

export default ProfileScreen;
