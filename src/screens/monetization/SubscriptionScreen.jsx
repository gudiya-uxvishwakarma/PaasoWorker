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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import * as api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const SubscriptionScreen = ({ onBack, userData }) => {
  // ✅ Use global language context for language persistence
  const { selectedLanguage } = useLanguage();
  
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [currentPlan, setCurrentPlan] = useState('free');
  const [transactions, setTransactions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Log current language for debugging
  useEffect(() => {
    console.log('💳 Subscription - Current Language:', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      
      console.log('💰 Loading subscription data...');
      
      // Load current subscription from userData
      if (userData?.subscription?.plan) {
        setCurrentPlan(userData.subscription.plan.toLowerCase());
        console.log('📊 Current plan:', userData.subscription.plan);
      }
      
      // Load plans from backend
      console.log('📥 Fetching plans from backend...');
      const plansResponse = await api.getSubscriptionPlans();
      console.log('📦 Plans response:', plansResponse);
      
      if (plansResponse.success && plansResponse.plans) {
        console.log('✅ Plans loaded:', plansResponse.plans.length);
        setPlans(plansResponse.plans);
      } else {
        console.log('⚠️ No plans in response');
        setPlans([]);
      }
      
      // Load add-ons from backend
      console.log('📥 Fetching add-ons from backend...');
      const addonsResponse = await api.getAddOns();
      console.log('📦 Add-ons response:', addonsResponse);
      
      if (addonsResponse.success && addonsResponse.addons) {
        console.log('✅ Add-ons loaded:', addonsResponse.addons.length);
        setAddOns(addonsResponse.addons);
      } else {
        console.log('⚠️ No add-ons in response');
        setAddOns([]);
      }
      
      // Load transaction history
      console.log('📥 Fetching transactions...');
      const transResponse = await api.getWorkerTransactions();
      
      if (transResponse.success && transResponse.transactions) {
        console.log('✅ Transactions loaded:', transResponse.transactions.length);
        setTransactions(transResponse.transactions);
      } else {
        console.log('⚠️ No transactions in response');
        setTransactions([]);
      }
      
      console.log('✅ Subscription data loaded successfully');
    } catch (error) {
      console.error('❌ Load Subscription Data Error:', error);
      console.error('Error details:', error.message);
      
      // Set empty arrays on error
      setPlans([]);
      setAddOns([]);
      setTransactions([]);
      
      Alert.alert(
        'Loading Error',
        'Failed to load subscription data. Please check your connection and try again.',
        [
          { text: 'Retry', onPress: () => loadSubscriptionData() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan) => {
    if (plan.id === 'free' || plan.id === currentPlan) {
      return;
    }

    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const period = billingCycle === 'monthly' ? '/month' : '/year';

    Alert.alert(
      'Upgrade Subscription',
      `Upgrade to ${plan.name} plan for ₹${price}${period}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => processSubscription(plan, price)
        }
      ]
    );
  };

  const processSubscription = async (plan, price) => {
    try {
      setProcessing(true);
      
      console.log('💳 Processing subscription:', plan.name, price);
      
      // Create transaction
      const response = await api.createSubscriptionTransaction(
        plan.name,
        billingCycle,
        price
      );
      
      console.log('✅ Transaction created:', response);
      
      if (response.success) {
        // In production, integrate with Razorpay here
        // For now, simulate payment success
        Alert.alert(
          'Payment Gateway',
          'In production, Razorpay payment gateway will open here.\n\nFor demo, simulating successful payment...',
          [
            {
              text: 'OK',
              onPress: async () => {
                try {
                  console.log('💰 Confirming payment...');
                  
                  // Confirm payment
                  const confirmResponse = await api.confirmSubscriptionPayment(
                    response.transaction._id,
                    {
                      razorpayOrderId: 'demo_order_' + Date.now(),
                      razorpayPaymentId: 'demo_payment_' + Date.now(),
                      razorpaySignature: 'demo_signature'
                    }
                  );
                  
                  console.log('✅ Payment confirmed:', confirmResponse);
                  
                  if (confirmResponse.success) {
                    Alert.alert(
                      'Success!',
                      `Your subscription has been upgraded to ${plan.name} plan!`,
                      [
                        {
                          text: 'OK',
                          onPress: () => {
                            setCurrentPlan(plan.id);
                            loadSubscriptionData();
                          }
                        }
                      ]
                    );
                  } else {
                    Alert.alert('Error', 'Failed to confirm payment. Please contact support.');
                  }
                } catch (error) {
                  console.error('❌ Payment confirmation error:', error);
                  Alert.alert('Error', 'Failed to confirm payment. Please contact support.');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to create transaction. Please try again.');
      }
    } catch (error) {
      console.error('❌ Process Subscription Error:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddOn = async (addon) => {
    Alert.alert(
      'Add-on Purchase',
      `Purchase ${addon.name} for ₹${addon.price}${addon.period}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              setProcessing(true);
              
              console.log('⭐ Processing add-on:', addon.name);
              
              const response = await api.createFeaturedTransaction(
                addon.name,
                addon.id.includes('weekly') ? 'weekly' : 'monthly',
                addon.price
              );
              
              console.log('✅ Add-on transaction created:', response);
              
              if (response.success) {
                Alert.alert(
                  'Success',
                  'Add-on purchase initiated. Payment gateway will open in production.',
                  [
                    {
                      text: 'OK',
                      onPress: () => loadSubscriptionData()
                    }
                  ]
                );
              } else {
                Alert.alert('Error', 'Failed to process add-on purchase.');
              }
            } catch (error) {
              console.error('❌ Add-on purchase error:', error);
              Alert.alert('Error', 'Failed to process add-on purchase.');
            } finally {
              setProcessing(false);
            }
          }
        }
      ]
    );
  };

  const getSavingsPercentage = (plan) => {
    if (billingCycle === 'yearly' && plan.monthlyPrice && plan.yearlyPrice) {
      const monthlyTotal = plan.monthlyPrice * 12;
      const savings = ((monthlyTotal - plan.yearlyPrice) / monthlyTotal) * 100;
      return Math.round(savings);
    }
    return 0;
  };

  const getPlanPrice = (plan) => {
    if (plan.id === 'free') return 0;
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPlanPeriod = (plan) => {
    if (plan.id === 'free') return 'Forever';
    return billingCycle === 'monthly' ? '/month' : '/year';
  };

  const getOriginalPrice = (plan) => {
    if (billingCycle === 'yearly' && plan.monthlyPrice) {
      return plan.monthlyPrice * 12;
    }
    return null;
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
              <Icon name="arrow-back" size={22} color={COLORS.white} />
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.title}> Boost Your Business</Text>
            <Text style={styles.subtitle}>Choose the perfect plan for your needs</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Billing Toggle */}
        <View style={styles.billingToggleCard}>
          <View style={styles.billingToggleRow}>
            <Text style={[styles.billingLabel, billingCycle === 'monthly' && styles.billingLabelActive]}>
              Monthly
            </Text>
            <Switch
              value={billingCycle === 'yearly'}
              onValueChange={(value) => setBillingCycle(value ? 'yearly' : 'monthly')}
              trackColor={{ false: '#e5e7eb', true: `${COLORS.secondary}50` }}
              thumbColor={billingCycle === 'yearly' ? COLORS.secondary : '#f3f4f6'}
              ios_backgroundColor="#e5e7eb"
            />
            <View style={styles.billingYearlyContainer}>
              <Text style={[styles.billingLabel, billingCycle === 'yearly' && styles.billingLabelActive]}>
                Yearly
              </Text>
              {billingCycle === 'yearly' && (
                <View style={styles.savingsBadge}>
                  <Text style={styles.savingsBadgeText}>Save 17%</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Subscription Plans */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading subscription data...</Text>
          </View>
        ) : plans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="alert-circle-outline" size={48} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No Plans Available</Text>
            <Text style={styles.emptySubtext}>
              Unable to load subscription plans. Please check your connection.
            </Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={loadSubscriptionData}
              activeOpacity={0.8}
            >
              <Icon name="refresh" size={18} color={COLORS.white} />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.plansContainer}>
            {plans.map((plan) => {
              const isCurrentPlan = plan.id === currentPlan;
              const badge = isCurrentPlan ? 'Current Plan' : 
                           plan.popular ? 'Popular' : 
                           plan.id === 'pro' ? 'Best Value' : 
                           plan.id === 'business' ? 'For Agencies' : null;
              
              return (
                <View
                  key={plan.id}
                  style={[
                    styles.planCard,
                    plan.popular && styles.planCardPopular,
                    isCurrentPlan && styles.planCardCurrent,
                  ]}
                >
                  {badge && (
                    <View style={[
                      styles.planBadge, 
                      { backgroundColor: isCurrentPlan ? '#10b981' : plan.color }
                    ]}>
                      <Text style={styles.planBadgeText}>{badge}</Text>
                    </View>
                  )}

                  <View style={[styles.planIconContainer, { backgroundColor: `${plan.color}15` }]}>
                    <Icon name={plan.icon} size={24} color={plan.color} />
                  </View>

                  <Text style={styles.planName}>{plan.name}</Text>
                  
                  <View style={styles.planPriceContainer}>
                    {getOriginalPrice(plan) && (
                      <Text style={styles.planOriginalPrice}>₹{getOriginalPrice(plan)}</Text>
                    )}
                    <View style={styles.planPriceRow}>
                      <Text style={styles.planPrice}>₹{getPlanPrice(plan)}</Text>
                      <Text style={styles.planPeriod}>{getPlanPeriod(plan)}</Text>
                    </View>
                    {getSavingsPercentage(plan) > 0 && (
                      <View style={styles.savingsTag}>
                        <Text style={styles.savingsTagText}>
                          Save {getSavingsPercentage(plan)}%
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Icon
                          name={feature.included ? 'checkmark-circle' : 'close-circle'}
                          size={15}
                          color={feature.included ? plan.color : '#cbd5e1'}
                        />
                        <Text
                          style={[
                            styles.featureText,
                            !feature.included && styles.featureTextDisabled,
                          ]}
                        >
                          {feature.text}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.planButton,
                      { backgroundColor: isCurrentPlan ? '#e5e7eb' : plan.color },
                      plan.popular && !isCurrentPlan && styles.planButtonPopular,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleUpgrade(plan)}
                    disabled={isCurrentPlan || processing}
                  >
                    {processing ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.planButtonText,
                            { color: isCurrentPlan ? COLORS.textSecondary : COLORS.white },
                          ]}
                        >
                          {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
                        </Text>
                        {!isCurrentPlan && (
                          <Icon name="arrow-forward" size={14} color={COLORS.white} />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}

        {/* Add-ons Section */}
        <View style={styles.addOnsSection}>
          <Text style={styles.sectionTitle}>⚡ Boost Add-ons</Text>
          <Text style={styles.sectionSubtitle}>
            Enhance your visibility with these powerful add-ons
          </Text>

          <View style={styles.addOnsGrid}>
            {addOns.map((addon) => (
              <View key={addon.id} style={styles.addonCard}>
                {addon.savings && (
                  <View style={styles.addonSavingsBadge}>
                    <Text style={styles.addonSavingsText}>{addon.savings}</Text>
                  </View>
                )}
                
                <View style={[styles.addonIconContainer, { backgroundColor: `${addon.color}15` }]}>
                  <Icon name={addon.icon} size={20} color={addon.color} />
                </View>

                <Text style={styles.addonName}>{addon.name}</Text>
                <Text style={styles.addonDescription}>{addon.description}</Text>

                <View style={styles.addonPriceRow}>
                  <Text style={styles.addonPrice}>₹{addon.price}</Text>
                  <Text style={styles.addonPeriod}>{addon.period}</Text>
                </View>

                <TouchableOpacity
                  style={[styles.addonButton, { borderColor: addon.color }]}
                  activeOpacity={0.7}
                  onPress={() => handleAddOn(addon)}
                  disabled={processing}
                >
                  {processing ? (
                    <ActivityIndicator size="small" color={addon.color} />
                  ) : (
                    <Text style={[styles.addonButtonText, { color: addon.color }]}>
                      Add to Cart
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>✨ Why Upgrade?</Text>
          
          <View style={styles.benefitsList}>
            {[
              { icon: 'eye', title: '10x More Visibility', desc: 'Get seen by more customers' },
              { icon: 'trending-up', title: 'Higher Rankings', desc: 'Top placement in search results' },
              { icon: 'analytics', title: 'Detailed Analytics', desc: 'Track your performance' },
              { icon: 'shield-checkmark', title: 'Build Trust', desc: 'Verified badges increase bookings' },
            ].map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <View style={styles.benefitIconContainer}>
                  <Icon name={benefit.icon} size={20} color={COLORS.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Transaction History */}
        {transactions.length > 0 && (
          <View style={styles.transactionsSection}>
            <Text style={styles.sectionTitle}>💳 Transaction History</Text>
            <Text style={styles.sectionSubtitle}>
              Your recent subscription and add-on purchases
            </Text>

            <View style={styles.transactionsList}>
              {transactions.slice(0, 5).map((transaction, index) => (
                <View key={index} style={styles.transactionCard}>
                  <View style={styles.transactionHeader}>
                    <View style={[
                      styles.transactionIconContainer,
                      { backgroundColor: transaction.type === 'Subscription' ? `${COLORS.primary}15` : `${COLORS.accent}15` }
                    ]}>
                      <Icon 
                        name={transaction.type === 'Subscription' ? 'card' : 'star'} 
                        size={16} 
                        color={transaction.type === 'Subscription' ? COLORS.primary : COLORS.accent} 
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
                <Icon name="arrow-forward" size={12} color={COLORS.primary} />
              </TouchableOpacity>
            )}
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
    paddingBottom: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  billingToggleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
  },
  billingToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  billingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  billingLabelActive: {
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  billingYearlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  savingsBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  savingsBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  plansContainer: {
    gap: 10,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardPopular: {
    borderColor: COLORS.accent,
    elevation: 8,
  },
  planCardCurrent: {
    borderColor: '#10b981',
    elevation: 6,
  },
  planBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  planBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
  },
  planIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  planPriceContainer: {
    marginBottom: 10,
  },
  planOriginalPrice: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  planPeriod: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  savingsTag: {
    backgroundColor: '#10b98115',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  savingsTagText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '800',
  },
  planFeatures: {
    gap: 6,
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 16,
  },
  featureTextDisabled: {
    color: COLORS.textSecondary,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    elevation: 4,
  },
  planButtonPopular: {
    elevation: 6,
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  addOnsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  addOnsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  addonCard: {
    width: '48.5%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 12,
    elevation: 3,
  },
  addonSavingsBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  addonSavingsText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: '800',
  },
  addonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  addonName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  addonDescription: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 14,
  },
  addonPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 8,
  },
  addonPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  addonPeriod: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addonButton: {
    borderWidth: 1.5,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  addonButtonText: {
    fontSize: 11,
    fontWeight: '800',
  },
  benefitsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 1,
  },
  benefitDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  bottomPadding: {
    height: 24,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 12,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  emptySubtext: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  transactionsSection: {
    marginBottom: 16,
  },
  transactionsList: {
    gap: 8,
  },
  transactionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  transactionPlan: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 1,
  },
  transactionDate: {
    fontSize: 9,
    color: COLORS.textLight,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  transactionStatus: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  transactionStatusText: {
    fontSize: 9,
    fontWeight: '800',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
    paddingVertical: 9,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  viewAllButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default SubscriptionScreen;
