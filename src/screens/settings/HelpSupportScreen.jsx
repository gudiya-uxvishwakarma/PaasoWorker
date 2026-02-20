import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  StatusBar,
  Linking,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';

const HelpSupportScreen = ({ onBack, userData }) => {
  const [loading, setLoading] = useState(true);
  const [helpContent, setHelpContent] = useState(null);
  
  // Default support contact (fallback)
  const defaultSupportMobile = '9876543210';
  const defaultSupportEmail = 'support@paasowork.com';
  
  // Use backend data if available, otherwise use defaults
  const supportMobile = helpContent?.supportMobile || defaultSupportMobile;
  const supportEmail = helpContent?.supportEmail || defaultSupportEmail;

  useEffect(() => {
    loadHelpContent();
  }, []);

  const loadHelpContent = async () => {
    try {
      setLoading(true);
      const response = await api.getCMSContent('help');
      
      if (response.success && response.content) {
        // Parse content if it's JSON string
        try {
          const parsedContent = typeof response.content.content === 'string' 
            ? JSON.parse(response.content.content)
            : response.content.content;
          setHelpContent(parsedContent);
        } catch (e) {
          console.log('Content is not JSON, using as is');
          setHelpContent(response.content);
        }
      }
    } catch (error) {
      console.error('❌ Load Help Content Error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCall = () => {
    Linking.openURL(`tel:+91${supportMobile}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${supportEmail}?subject=Support Request from ${userData?.name || 'Worker'}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi, I need help with my PaasoWork account.\n\nName: ${userData?.name || 'N/A'}\nMobile: ${userData?.mobile || 'N/A'}`;
    Linking.openURL(`whatsapp://send?phone=91${supportMobile}&text=${encodeURIComponent(message)}`);
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
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading help content...</Text>
          </View>
        ) : (
          <>
        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="headset" size={22} color={COLORS.accent} />
            <Text style={styles.cardTitle}>Contact Support</Text>
          </View>
          
          <TouchableOpacity style={styles.contactButton} onPress={handleCall} activeOpacity={0.7}>
            <View style={styles.contactIconContainer}>
              <Icon name="call" size={24} color={COLORS.accent} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Call Us</Text>
              <Text style={styles.contactSubtitle}>+91 {supportMobile}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleEmail} activeOpacity={0.7}>
            <View style={styles.contactIconContainer}>
              <Icon name="mail" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>{supportEmail}</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp} activeOpacity={0.7}>
            <View style={styles.contactIconContainer}>
              <Icon name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>WhatsApp</Text>
              <Text style={styles.contactSubtitle}>Chat with us</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="help-circle" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>FAQs</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.faqItem} 
            activeOpacity={0.7}
            onPress={() => Alert.alert(
              'Get More Jobs',
              '• Complete your profile with all details\n• Add professional photos\n• Keep your profile active\n• Respond quickly to job requests\n• Maintain good ratings\n• Subscribe to premium plan for priority listing'
            )}
          >
            <Icon name="chevron-forward" size={18} color={COLORS.accent} />
            <Text style={styles.faqText}>How do I get more jobs?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.faqItem} 
            activeOpacity={0.7}
            onPress={() => Alert.alert(
              'Payment Process',
              '• Clients pay through the app\n• Payment is held securely\n• You receive payment after job completion\n• Payments are processed within 2-3 business days\n• Check payment history in your profile\n• Contact support for payment issues'
            )}
          >
            <Icon name="chevron-forward" size={18} color={COLORS.accent} />
            <Text style={styles.faqText}>How does payment work?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.faqItem} 
            activeOpacity={0.7}
            onPress={() => Alert.alert(
              'Account Verification',
              '• Go to Profile > Verification\n• Upload required documents:\n  - Aadhaar Card\n  - PAN Card\n  - Professional certificates (if any)\n• Submit for verification\n• Verification takes 24-48 hours\n• You\'ll be notified once verified'
            )}
          >
            <Icon name="chevron-forward" size={18} color={COLORS.accent} />
            <Text style={styles.faqText}>How to verify my account?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.faqItem} 
            activeOpacity={0.7}
            onPress={() => Alert.alert(
              'Subscription Plans',
              'Free Plan:\n• Basic profile listing\n• Limited job applications\n\nPremium Plan (₹299/month):\n• Priority listing\n• Unlimited job applications\n• Featured profile\n• Advanced analytics\n\nPro Plan (₹499/month):\n• All Premium features\n• Crew management\n• Multiple service areas\n• Dedicated support'
            )}
          >
            <Icon name="chevron-forward" size={18} color={COLORS.accent} />
            <Text style={styles.faqText}>What is subscription plan?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.faqItem} 
            activeOpacity={0.7}
            onPress={() => Alert.alert(
              'Crew Management',
              '• Available for Crew Leaders and Contractors\n• Go to Profile > Manage Crew\n• Add crew members with their details\n• Assign roles and responsibilities\n• Track crew performance\n• Manage crew payments\n• Requires Pro subscription'
            )}
          >
            <Icon name="chevron-forward" size={18} color={COLORS.accent} />
            <Text style={styles.faqText}>How to manage my crew?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="book" size={22} color={COLORS.secondary} />
            <Text style={styles.cardTitle}>Resources</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.resourceButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'Video Tutorials',
                'Watch our video tutorials to learn how to use PaasoWork effectively.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Watch on YouTube', 
                    onPress: () => Linking.openURL('https://youtube.com/@paasowork')
                  }
                ]
              );
            }}
          >
            <View style={styles.resourceIconContainer}>
              <Icon name="play-circle" size={20} color={COLORS.accent} />
            </View>
            <Text style={styles.resourceButtonText}>Video Tutorials</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'User Guide',
                'Complete guide to using PaasoWork:\n\n1. Complete your profile\n2. Add professional photos\n3. Set your service areas\n4. Browse and apply for jobs\n5. Communicate with clients\n6. Complete jobs and get paid\n7. Build your reputation with reviews\n\nFor detailed guide, visit our website.'
              );
            }}
          >
            <View style={styles.resourceIconContainer}>
              <Icon name="document-text" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.resourceButtonText}>User Guide</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'Tips & Best Practices',
                '✓ Keep your profile updated\n✓ Respond to messages within 1 hour\n✓ Be professional in communication\n✓ Arrive on time for jobs\n✓ Complete jobs as promised\n✓ Ask for reviews after good work\n✓ Keep learning new skills\n✓ Maintain competitive pricing\n✓ Build long-term client relationships\n✓ Stay active on the platform'
              );
            }}
          >
            <View style={styles.resourceIconContainer}>
              <Icon name="bulb" size={20} color="#f59e0b" />
            </View>
            <Text style={styles.resourceButtonText}>Tips & Best Practices</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.border} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardTitleContainer}>
            <Icon name="chatbubble-ellipses" size={22} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Feedback</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.feedbackButton} 
            activeOpacity={0.7}
            onPress={() => {
              Alert.alert(
                'Rate Our App',
                'Enjoying PaasoWork? Please rate us on the Play Store!',
                [
                  { text: 'Later', style: 'cancel' },
                  { 
                    text: 'Rate Now', 
                    onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.paasowork')
                  }
                ]
              );
            }}
          >
            <Icon name="star-outline" size={20} color={COLORS.accent} />
            <Text style={styles.feedbackButtonText}>Rate Our App</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.feedbackButton} 
            activeOpacity={0.7}
            onPress={() => {
              const feedbackEmail = 'feedback@paasowork.com';
              const subject = `Feedback from ${userData?.name || 'Worker'}`;
              const body = `Name: ${userData?.name || 'N/A'}\nMobile: ${userData?.mobile || 'N/A'}\n\nMy Feedback:\n`;
              Linking.openURL(`mailto:${feedbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
            }}
          >
            <Icon name="chatbubble-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.feedbackButtonText}>Send Feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.feedbackButton} 
            activeOpacity={0.7}
            onPress={() => {
              const supportEmail = 'support@paasowork.com';
              const subject = `Problem Report from ${userData?.name || 'Worker'}`;
              const body = `Name: ${userData?.name || 'N/A'}\nMobile: ${userData?.mobile || 'N/A'}\n\nProblem Description:\n`;
              Linking.openURL(`mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
            }}
          >
            <Icon name="bug-outline" size={20} color="#dc2626" />
            <Text style={styles.feedbackButtonText}>Report a Problem</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionCard}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2025 PaasoWork. All rights reserved.</Text>
        </View>

        <View style={styles.bottomPadding} />
        </>
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  contactSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  faqText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  resourceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  resourceButtonText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  feedbackButton: {
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
  feedbackButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  versionCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  versionSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default HelpSupportScreen;
