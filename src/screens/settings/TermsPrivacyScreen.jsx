import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const TermsPrivacyScreen = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('terms');

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
          <Text style={styles.headerTitle}>Terms & Privacy</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'terms' && styles.activeTab]}
          onPress={() => setActiveTab('terms')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'terms' && styles.activeTabText]}>
            Terms of Service
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'privacy' && styles.activeTab]}
          onPress={() => setActiveTab('privacy')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'privacy' && styles.activeTabText]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'terms' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Terms of Service</Text>
            <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

            <Text style={styles.heading}>1. Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By accessing and using PaasoWork, you accept and agree to be bound by the terms and provision of this agreement.
            </Text>

            <Text style={styles.heading}>2. Use License</Text>
            <Text style={styles.paragraph}>
              Permission is granted to temporarily use PaasoWork for personal, non-commercial transitory viewing only.
            </Text>

            <Text style={styles.heading}>3. User Accounts</Text>
            <Text style={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </Text>

            <Text style={styles.heading}>4. Service Providers</Text>
            <Text style={styles.paragraph}>
              Workers registered on PaasoWork are independent contractors. PaasoWork does not employ workers directly and acts as a platform connecting workers with clients.
            </Text>

            <Text style={styles.heading}>5. Payment Terms</Text>
            <Text style={styles.paragraph}>
              All payments are processed through our secure payment gateway. PaasoWork charges a service fee on completed transactions as per the subscription plan.
            </Text>

            <Text style={styles.heading}>6. Prohibited Activities</Text>
            <Text style={styles.paragraph}>
              You may not use PaasoWork for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction.
            </Text>

            <Text style={styles.heading}>7. Termination</Text>
            <Text style={styles.paragraph}>
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service.
            </Text>

            <Text style={styles.heading}>8. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              PaasoWork shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
            </Text>

            <Text style={styles.heading}>9. Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last updated" date.
            </Text>

            <Text style={styles.heading}>10. Contact Information</Text>
            <Text style={styles.paragraph}>
              For questions about these Terms, please contact us at legal@paasowork.com
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

            <Text style={styles.heading}>1. Information We Collect</Text>
            <Text style={styles.paragraph}>
              We collect information you provide directly to us, including name, phone number, email address, location, skills, and work preferences.
            </Text>

            <Text style={styles.heading}>2. How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you.
            </Text>

            <Text style={styles.heading}>3. Information Sharing</Text>
            <Text style={styles.paragraph}>
              We share your profile information with potential clients when you apply for jobs. We do not sell your personal information to third parties.
            </Text>

            <Text style={styles.heading}>4. Data Security</Text>
            <Text style={styles.paragraph}>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </Text>

            <Text style={styles.heading}>5. Location Data</Text>
            <Text style={styles.paragraph}>
              We collect location data to show you relevant job opportunities in your area. You can disable location services in your device settings.
            </Text>

            <Text style={styles.heading}>6. Cookies and Tracking</Text>
            <Text style={styles.paragraph}>
              We use cookies and similar tracking technologies to track activity on our service and hold certain information to improve user experience.
            </Text>

            <Text style={styles.heading}>7. Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us.
            </Text>

            <Text style={styles.heading}>8. Data Retention</Text>
            <Text style={styles.paragraph}>
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations.
            </Text>

            <Text style={styles.heading}>9. Children's Privacy</Text>
            <Text style={styles.paragraph}>
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from children.
            </Text>

            <Text style={styles.heading}>10. Changes to Privacy Policy</Text>
            <Text style={styles.paragraph}>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </Text>

            <Text style={styles.heading}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have questions about this Privacy Policy, please contact us at privacy@paasowork.com
            </Text>
          </View>
        )}

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
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.white,
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 24,
  },
});

export default TermsPrivacyScreen;
