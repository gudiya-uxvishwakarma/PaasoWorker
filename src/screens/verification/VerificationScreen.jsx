import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const VerificationScreen = ({ onBack, userData }) => {
  const [documents, setDocuments] = useState({
    aadhaar: null,
    drivingLicense: null,
    gst: null,
  });

  const verificationBadges = [
    {
      id: 'basic_verified',
      name: 'Verified Badge',
      icon: 'shield-checkmark',
      color: COLORS.secondary,
      price: 499,
      period: '/year',
      requirements: ['Aadhaar Card', 'Phone Verification'],
      benefits: [
        'Verified badge on profile',
        '2x more customer trust',
        'Higher search ranking',
        'Priority in listings',
      ],
      status: 'available',
    },
    {
      id: 'trusted_pro',
      name: 'Trusted Pro',
      icon: 'ribbon',
      color: COLORS.primary,
      price: 999,
      period: '/year',
      requirements: ['Basic Verification', 'Driving License', 'Work History'],
      benefits: [
        'Premium trust badge',
        '5x more visibility',
        'Featured in "Trusted" section',
        'Dedicated support',
      ],
      status: 'locked',
    },
    {
      id: 'business_verified',
      name: 'Business Verified',
      icon: 'business',
      color: '#f59e0b',
      price: 1499,
      period: '/year',
      requirements: ['GST Certificate', 'Business License', 'Address Proof'],
      benefits: [
        'Business verified badge',
        'Corporate client access',
        'Bulk order priority',
        'Invoice generation',
      ],
      status: userData?.workerType === 'service_provider' ? 'available' : 'not_applicable',
    },
  ];

  const documentTypes = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      icon: 'card',
      required: true,
      description: 'Government ID for identity verification',
    },
    {
      id: 'drivingLicense',
      name: 'Driving License',
      icon: 'car',
      required: false,
      description: 'Additional ID proof (optional)',
    },
    {
      id: 'gst',
      name: 'GST Certificate',
      icon: 'document-text',
      required: userData?.workerType === 'service_provider',
      description: 'For business verification',
    },
  ];

  const handleUploadDocument = (docType) => {
    Alert.alert(
      'Upload Document',
      `Select ${docType} document to upload`,
      [
        { text: 'Take Photo', onPress: () => console.log('Camera') },
        { text: 'Choose from Gallery', onPress: () => console.log('Gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePurchaseBadge = (badge) => {
    Alert.alert(
      'Purchase Badge',
      `Get ${badge.name} for ₹${badge.price}${badge.period}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Purchase') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
            >
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.title}>🛡️ Get Verified</Text>
            <Text style={styles.subtitle}>Build trust with customers</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Trust Score Card */}
        <View style={styles.trustScoreCard}>
          <View style={styles.trustScoreHeader}>
            <View style={styles.trustScoreIconContainer}>
              <Icon name="shield-checkmark" size={32} color={COLORS.secondary} />
            </View>
            <View style={styles.trustScoreInfo}>
              <Text style={styles.trustScoreLabel}>Trust Score</Text>
              <Text style={styles.trustScoreValue}>45/100</Text>
            </View>
          </View>
          
          <View style={styles.trustScoreBar}>
            <View style={[styles.trustScoreProgress, { width: '45%' }]} />
          </View>
          
          <Text style={styles.trustScoreHint}>
            Complete verification to increase your trust score and get more customers
          </Text>
        </View>

        {/* Verification Badges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⭐ Verification Badges</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the right badge for your business
          </Text>

          {verificationBadges.map((badge) => (
            <View
              key={badge.id}
              style={[
                styles.badgeCard,
                badge.status === 'locked' && styles.badgeCardLocked,
              ]}
            >
              <View style={styles.badgeHeader}>
                <View style={[styles.badgeIconContainer, { backgroundColor: `${badge.color}15` }]}>
                  <Icon name={badge.icon} size={32} color={badge.color} />
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                  <View style={styles.badgePriceRow}>
                    <Text style={styles.badgePrice}>₹{badge.price}</Text>
                    <Text style={styles.badgePeriod}>{badge.period}</Text>
                  </View>
                </View>
                {badge.status === 'locked' && (
                  <Icon name="lock-closed" size={24} color={COLORS.textSecondary} />
                )}
              </View>

              <View style={styles.badgeSection}>
                <Text style={styles.badgeSectionTitle}>Requirements:</Text>
                {badge.requirements.map((req, index) => (
                  <View key={index} style={styles.badgeRequirement}>
                    <Icon name="checkmark-circle-outline" size={16} color={badge.color} />
                    <Text style={styles.badgeRequirementText}>{req}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.badgeSection}>
                <Text style={styles.badgeSectionTitle}>Benefits:</Text>
                {badge.benefits.map((benefit, index) => (
                  <View key={index} style={styles.badgeBenefit}>
                    <Icon name="star" size={14} color="#f59e0b" />
                    <Text style={styles.badgeBenefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              {badge.status === 'available' && (
                <TouchableOpacity
                  style={[styles.badgeButton, { backgroundColor: badge.color }]}
                  onPress={() => handlePurchaseBadge(badge)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.badgeButtonText}>Get This Badge</Text>
                  <Icon name="arrow-forward" size={18} color={COLORS.white} />
                </TouchableOpacity>
              )}

              {badge.status === 'locked' && (
                <View style={styles.badgeLockedInfo}>
                  <Icon name="information-circle" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.badgeLockedText}>
                    Complete Basic Verification first
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Document Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📄 Upload Documents</Text>
          <Text style={styles.sectionSubtitle}>
            Upload your documents for KYC verification
          </Text>

          {documentTypes.map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentIconContainer}>
                  <Icon name={doc.icon} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.documentInfo}>
                  <View style={styles.documentTitleRow}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    {doc.required && (
                      <View style={styles.requiredBadge}>
                        <Text style={styles.requiredBadgeText}>Required</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.documentDescription}>{doc.description}</Text>
                </View>
              </View>

              {documents[doc.id] ? (
                <View style={styles.documentUploaded}>
                  <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
                  <Text style={styles.documentUploadedText}>Document uploaded</Text>
                  <TouchableOpacity onPress={() => handleUploadDocument(doc.name)}>
                    <Text style={styles.documentChangeText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleUploadDocument(doc.name)}
                  activeOpacity={0.7}
                >
                  <Icon name="cloud-upload-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadButtonText}>Upload Document</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Benefits Info */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>✨ Why Get Verified?</Text>
          <View style={styles.benefitsList}>
            {[
              { icon: 'trending-up', text: '3x more profile views' },
              { icon: 'people', text: 'Higher customer trust' },
              { icon: 'star', text: 'Priority in search results' },
              { icon: 'cash', text: 'Access to premium jobs' },
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitIconContainer}>
                  <Icon name={benefit.icon} size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
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
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
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
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  trustScoreCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
  },
  trustScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  trustScoreIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${COLORS.secondary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  trustScoreInfo: {
    flex: 1,
  },
  trustScoreLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  trustScoreValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  trustScoreBar: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  trustScoreProgress: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 6,
  },
  trustScoreHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  badgeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
  },
  badgeCardLocked: {
    opacity: 0.7,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  badgePriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  badgePrice: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  badgePeriod: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  badgeSection: {
    marginBottom: 16,
  },
  badgeSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  badgeRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badgeRequirementText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  badgeBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badgeBenefitText: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  badgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 4,
  },
  badgeButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  badgeLockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 12,
  },
  badgeLockedText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  documentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  requiredBadge: {
    backgroundColor: '#ef444415',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  requiredBadgeText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '800',
  },
  documentDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  documentUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${COLORS.secondary}10`,
    padding: 12,
    borderRadius: 12,
  },
  documentUploadedText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '600',
  },
  documentChangeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  benefitsCard: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

export default VerificationScreen;
