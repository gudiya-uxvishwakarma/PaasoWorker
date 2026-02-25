import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const VerificationScreen = ({ onBack, userData, onComplete }) => {
  // ✅ Use global language context for language persistence
  const { selectedLanguage } = useLanguage();
  
  const [documents, setDocuments] = useState({
    aadhaar: userData?.aadhaarDoc || null,
    drivingLicense: userData?.drivingLicense || null,
    gst: userData?.gstCertificate || null,
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [badges, setBadges] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [trustScore, setTrustScore] = useState(0);

  // Log current language for debugging
  useEffect(() => {
    console.log('✅ Verification - Current Language:', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    loadVerificationData();
  }, []);

  const loadVerificationData = async () => {
    try {
      setLoading(true);
      
      console.log('🛡️ Loading verification data...');
      
      // Get worker ID
      const workerId = userData?._id || userData?.id;
      
      if (workerId) {
        // Fetch verification status from backend
        console.log('📥 Fetching verification status from backend...');
        const verificationResponse = await api.getVerificationStatus(workerId);
        
        if (verificationResponse.success && verificationResponse.status) {
          const { documents: backendDocs } = verificationResponse.status;
          
          // Update documents state with backend data
          setDocuments({
            aadhaar: backendDocs?.aadhaar || userData?.aadhaarDoc || null,
            drivingLicense: backendDocs?.drivingLicense || userData?.drivingLicense || null,
            gst: backendDocs?.gst || userData?.gstCertificate || null,
          });
          
          console.log('✅ Verification status loaded from backend');
          console.log('📊 Progress:', verificationResponse.status.progress + '%');
        }
      }
      
      // Calculate trust score based on user data
      calculateTrustScore();
      
      // Load verification badges from backend
      console.log('📥 Fetching verification badges...');
      const badgesResponse = await api.getAddOns();
      
      if (badgesResponse.success && badgesResponse.addons) {
        // Filter only verification-related add-ons
        const verificationBadges = badgesResponse.addons.filter(addon => 
          addon.id.includes('verified') || addon.id.includes('badge')
        );
        console.log('✅ Verification badges loaded:', verificationBadges.length);
        setBadges(verificationBadges);
      }
      
      // Load transaction history for verification purchases
      console.log('📥 Fetching verification transactions...');
      const transResponse = await api.getWorkerTransactions();
      
      if (transResponse.success && transResponse.transactions) {
        // Filter verification-related transactions
        const verificationTrans = transResponse.transactions.filter(trans =>
          trans.type === 'Verification' || trans.type === 'Badge'
        );
        console.log('✅ Verification transactions loaded:', verificationTrans.length);
        setTransactions(verificationTrans);
      }
      
      console.log('✅ Verification data loaded successfully');
    } catch (error) {
      console.error('❌ Load Verification Data Error:', error);
      console.error('Error details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTrustScore = () => {
    let score = 0;
    
    // Base score for registration
    score += 10;
    
    // Phone verification
    if (userData?.mobile) score += 10;
    
    // Email verification
    if (userData?.email) score += 5;
    
    // Profile completion
    if (userData?.name) score += 5;
    if (userData?.profilePhoto) score += 10;
    if (userData?.bio) score += 5;
    if (userData?.category?.length > 0) score += 5;
    if (userData?.serviceArea) score += 5;
    
    // Documents
    if (userData?.aadhaarDoc) score += 15;
    if (userData?.panCard) score += 10;
    if (userData?.drivingLicense) score += 5;
    if (userData?.gstCertificate) score += 10;
    
    // Verification status
    if (userData?.verified) score += 20;
    if (userData?.kycVerified) score += 15;
    
    // Badges
    if (userData?.badges?.length > 0) {
      score += userData.badges.length * 10;
    }
    
    // Cap at 100
    score = Math.min(score, 100);
    
    setTrustScore(score);
    console.log('📊 Trust Score calculated:', score);
  };

  // Default verification badges (fallback if backend doesn't have them)
  const defaultVerificationBadges = [
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
      status: userData?.verified ? 'active' : 'available',
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
      status: userData?.badges?.includes('Trusted Pro') ? 'active' : 
              userData?.verified ? 'available' : 'locked',
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
      status: userData?.badges?.includes('Business Verified') ? 'active' :
              userData?.workerType === 'Contractor' || userData?.workerType === 'Service Provider' ? 'available' : 'not_applicable',
    },
  ];

  const verificationBadges = badges.length > 0 ? badges : defaultVerificationBadges;

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

  const handleUploadDocument = async (docType, docId) => {
    Alert.alert(
      'Upload Document',
      `Select ${docType} document to upload`,
      [
        { 
          text: 'Take Photo', 
          onPress: async () => {
            try {
              // In production, use react-native-image-picker
              console.log('📸 Opening camera for:', docType);
              
              // Simulate document upload
              Alert.alert(
                'Demo Mode',
                'In production, camera will open here. For demo, simulating upload...',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      try {
                        setProcessing(true);
                        
                        // Simulate upload to backend
                        const uploadResponse = await api.uploadDocument(docId, {
                          uri: 'demo_document_uri',
                          type: 'image/jpeg',
                          name: `${docId}_${Date.now()}.jpg`
                        });
                        
                        if (uploadResponse.success) {
                          // Update local state
                          setDocuments(prev => ({ ...prev, [docId]: true }));
                          
                          // Submit to backend
                          const workerId = userData?._id || userData?.id;
                          if (workerId) {
                            const submitData = {};
                            if (docId === 'aadhaar') submitData.aadhaarDoc = uploadResponse.documentUrl;
                            if (docId === 'drivingLicense') submitData.drivingLicense = uploadResponse.documentUrl;
                            if (docId === 'gst') submitData.gstCertificate = uploadResponse.documentUrl;
                            
                            await api.submitKYCDocuments(workerId, submitData);
                          }
                          
                          Alert.alert('Success', 'Document uploaded successfully!');
                          loadVerificationData(); // Refresh data
                        }
                      } catch (error) {
                        console.error('❌ Upload error:', error);
                        Alert.alert('Error', 'Failed to upload document. Please try again.');
                      } finally {
                        setProcessing(false);
                      }
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Camera error:', error);
            }
          }
        },
        { 
          text: 'Choose from Gallery', 
          onPress: async () => {
            try {
              console.log('🖼️ Opening gallery for:', docType);
              
              // Simulate document upload
              Alert.alert(
                'Demo Mode',
                'In production, gallery will open here. For demo, simulating upload...',
                [
                  {
                    text: 'OK',
                    onPress: async () => {
                      try {
                        setProcessing(true);
                        
                        const uploadResponse = await api.uploadDocument(docId, {
                          uri: 'demo_document_uri',
                          type: 'image/jpeg',
                          name: `${docId}_${Date.now()}.jpg`
                        });
                        
                        if (uploadResponse.success) {
                          setDocuments(prev => ({ ...prev, [docId]: true }));
                          
                          // Submit to backend
                          const workerId = userData?._id || userData?.id;
                          if (workerId) {
                            const submitData = {};
                            if (docId === 'aadhaar') submitData.aadhaarDoc = uploadResponse.documentUrl;
                            if (docId === 'drivingLicense') submitData.drivingLicense = uploadResponse.documentUrl;
                            if (docId === 'gst') submitData.gstCertificate = uploadResponse.documentUrl;
                            
                            await api.submitKYCDocuments(workerId, submitData);
                          }
                          
                          Alert.alert('Success', 'Document uploaded successfully!');
                          loadVerificationData();
                        }
                      } catch (error) {
                        console.error('❌ Upload error:', error);
                        Alert.alert('Error', 'Failed to upload document. Please try again.');
                      } finally {
                        setProcessing(false);
                      }
                    }
                  }
                ]
              );
            } catch (error) {
              console.error('Gallery error:', error);
            }
          }
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePurchaseBadge = async (badge) => {
    if (badge.status === 'locked') {
      Alert.alert(
        'Badge Locked',
        'Please complete the required verifications first.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (badge.status === 'active') {
      Alert.alert(
        'Already Active',
        'You already have this badge!',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Purchase Badge',
      `Get ${badge.name} for ₹${badge.price}${badge.period}?\n\nThis will give you:\n${badge.benefits.map(b => `• ${b}`).join('\n')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              setProcessing(true);
              
              console.log('💳 Creating badge transaction...');
              
              // Create transaction for badge purchase
              const response = await api.createFeaturedTransaction(
                badge.name,
                'yearly',
                badge.price
              );
              
              if (response.success) {
                Alert.alert(
                  'Payment Gateway',
                  'In production, Razorpay payment gateway will open here.\n\nFor demo, simulating successful payment...',
                  [
                    {
                      text: 'OK',
                      onPress: async () => {
                        try {
                          // Confirm payment
                          const confirmResponse = await api.confirmSubscriptionPayment(
                            response.transaction._id,
                            {
                              razorpayOrderId: 'demo_order_' + Date.now(),
                              razorpayPaymentId: 'demo_payment_' + Date.now(),
                              razorpaySignature: 'demo_signature'
                            }
                          );
                          
                          if (confirmResponse.success) {
                            Alert.alert(
                              'Success!',
                              `${badge.name} badge has been activated on your profile!`,
                              [
                                {
                                  text: 'OK',
                                  onPress: () => {
                                    loadVerificationData();
                                  }
                                }
                              ]
                            );
                          }
                        } catch (error) {
                          Alert.alert('Error', 'Failed to confirm payment. Please contact support.');
                        }
                      }
                    }
                  ]
                );
              }
            } catch (error) {
              console.error('❌ Purchase Badge Error:', error);
              Alert.alert('Error', 'Failed to process badge purchase. Please try again.');
            } finally {
              setProcessing(false);
            }
          }
        }
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
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading verification data...</Text>
          </View>
        ) : (
          <>
        {/* Trust Score Card */}
        <View style={styles.trustScoreCard}>
          <View style={styles.trustScoreHeader}>
            <View style={styles.trustScoreIconContainer}>
              <Icon name="shield-checkmark" size={32} color={COLORS.secondary} />
            </View>
            <View style={styles.trustScoreInfo}>
              <Text style={styles.trustScoreLabel}>Trust Score</Text>
              <Text style={styles.trustScoreValue}>{trustScore}/100</Text>
            </View>
          </View>
          
          <View style={styles.trustScoreBar}>
            <View style={[styles.trustScoreProgress, { width: `${trustScore}%` }]} />
          </View>
          
          <Text style={styles.trustScoreHint}>
            {trustScore < 50 
              ? 'Complete verification to increase your trust score and get more customers'
              : trustScore < 80
              ? 'Good progress! Add more documents to boost your trust score'
              : 'Excellent! You have a high trust score'}
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
                  disabled={processing}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <>
                      <Text style={styles.badgeButtonText}>Get This Badge</Text>
                      <Icon name="arrow-forward" size={18} color={COLORS.white} />
                    </>
                  )}
                </TouchableOpacity>
              )}

              {badge.status === 'active' && (
                <View style={styles.badgeActiveInfo}>
                  <Icon name="checkmark-circle" size={20} color={COLORS.secondary} />
                  <Text style={styles.badgeActiveText}>
                    Active on your profile
                  </Text>
                </View>
              )}

              {badge.status === 'locked' && (
                <View style={styles.badgeLockedInfo}>
                  <Icon name="information-circle" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.badgeLockedText}>
                    Complete Basic Verification first
                  </Text>
                </View>
              )}

              {badge.status === 'not_applicable' && (
                <View style={styles.badgeLockedInfo}>
                  <Icon name="information-circle" size={18} color={COLORS.textSecondary} />
                  <Text style={styles.badgeLockedText}>
                    Not applicable for your worker type
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
                  <TouchableOpacity 
                    onPress={() => handleUploadDocument(doc.name, doc.id)}
                    disabled={processing}
                  >
                    <Text style={styles.documentChangeText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={() => handleUploadDocument(doc.name, doc.id)}
                  activeOpacity={0.7}
                  disabled={processing}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <>
                      <Icon name="cloud-upload-outline" size={20} color={COLORS.primary} />
                      <Text style={styles.uploadButtonText}>Upload Document</Text>
                    </>
                  )}
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

        {/* Transaction History */}
        {transactions.length > 0 && (
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>💳 Verification History</Text>
            <Text style={styles.sectionSubtitle}>
              Your recent verification and badge purchases
            </Text>

            <View style={styles.transactionsList}>
              {transactions.slice(0, 5).map((transaction, index) => (
                <View key={index} style={styles.transactionCard}>
                  <View style={styles.transactionHeader}>
                    <View style={[
                      styles.transactionIconContainer,
                      { backgroundColor: `${COLORS.secondary}15` }
                    ]}>
                      <Icon 
                        name="shield-checkmark" 
                        size={20} 
                        color={COLORS.secondary} 
                      />
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionType}>{transaction.type}</Text>
                      <Text style={styles.transactionPlan}>{transaction.plan}</Text>
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={styles.transactionRight}>
                      <Text style={styles.transactionAmount}>₹{transaction.amount}</Text>
                      <View style={[
                        styles.transactionStatus,
                        { backgroundColor: 
                          transaction.status === 'Success' ? '#10b98115' :
                          transaction.status === 'Pending' ? '#f59e0b15' :
                          transaction.status === 'Failed' ? '#ef444415' : '#6b728015'
                        }
                      ]}>
                        <Text style={[
                          styles.transactionStatusText,
                          { color:
                            transaction.status === 'Success' ? '#10b981' :
                            transaction.status === 'Pending' ? '#f59e0b' :
                            transaction.status === 'Failed' ? '#ef4444' : '#6b7280'
                          }
                        ]}>
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {transactions.length > 5 && (
              <TouchableOpacity style={styles.viewAllButton} activeOpacity={0.7}>
                <Text style={styles.viewAllButtonText}>View All Transactions</Text>
                <Icon name="arrow-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Skip Button */}
        <View style={styles.skipSection}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              if (onComplete) {
                // Mark as skipped and continue
                onComplete({ ...userData, verificationSkipped: true });
              } else if (onBack) {
                onBack();
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.skipButtonText}>Skip for Now</Text>
            <Icon name="arrow-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.skipHint}>
            You can complete verification later from your profile
          </Text>
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
  badgeActiveInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${COLORS.secondary}15`,
    padding: 12,
    borderRadius: 12,
  },
  badgeActiveText: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: '700',
  },
  transactionsSection: {
    marginBottom: 24,
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  transactionPlan: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  transactionStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  transactionStatusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  skipSection: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  skipHint: {
    marginTop: 12,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default VerificationScreen;
