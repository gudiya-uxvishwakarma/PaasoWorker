import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';

const SubscriptionScreen = ({ onNavigate, onBack }) => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'Forever',
      color: '#6b7280',
      icon: 'gift-outline',
      features: [
        { text: 'Basic profile listing', included: true },
        { text: 'Standard search visibility', included: true },
        { text: 'Up to 5 profile views/day', included: true },
        { text: 'Basic support', included: true },
        { text: 'Featured listing', included: false },
        { text: 'Priority placement', included: false },
        { text: 'Analytics dashboard', included: false },
        { text: 'Lead insights', included: false },
      ],
      badge: 'Current Plan',
    },
    {
      id: 'starter',
      name: 'Starter',
      price: billingCycle === 'monthly' ? 499 : 4990,
      originalPrice: billingCycle === 'yearly' ? 5988 : null,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      color: COLORS.accent,
      icon: 'rocket-outline',
      features: [
        { text: 'Everything in Free', included: true },
        { text: 'Unlimited profile views', included: true },
        { text: 'Higher search ranking', included: true },
        { text: '2x visibility boost', included: true },
        { text: 'Basic analytics', included: true },
        { text: 'Priority support', included: true },
        { text: 'Featured listing', included: false },
        { text: 'Advanced insights', included: false },
      ],
      badge: 'Popular',
      popular: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingCycle === 'monthly' ? 999 : 9990,
      originalPrice: billingCycle === 'yearly' ? 11988 : null,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      color: COLORS.secondary,
      icon: 'star-outline',
      features: [
        { text: 'Everything in Starter', included: true },
        { text: 'Featured listing (weekly)', included: true },
        { text: 'Top search placement', included: true },
        { text: '5x visibility boost', included: true },
        { text: 'Advanced analytics', included: true },
        { text: 'Lead insights & tracking', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Verified badge discount', included: true },
      ],
      badge: 'Best Value',
    },
    {
      id: 'business',
      name: 'Business',
      price: billingCycle === 'monthly' ? 1999 : 19990,
      originalPrice: billingCycle === 'yearly' ? 23988 : null,
      period: billingCycle === 'monthly' ? '/month' : '/year',
      color: COLORS.primary,
      icon: 'diamond-outline',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Premium featured listing', included: true },
        { text: 'Guaranteed top 3 placement', included: true },
        { text: '10x visibility boost', included: true },
        { text: 'Full analytics suite', included: true },
        { text: 'Team management tools', included: true },
        { text: 'Free verified badge', included: true },
        { text: '24/7 priority support', included: true },
      ],
      badge: 'For Agencies',
    },
  ];

  const addOns = [
    {
      id: 'featured_weekly',
      name: 'Featured Listing',
      description: 'Top placement for 7 days',
      price: 299,
      period: '/week',
      icon: 'star',
      color: '#f59e0b',
    },
    {
      id: 'featured_monthly',
      name: 'Featured Listing',
      description: 'Top placement for 30 days',
      price: 999,
      period: '/month',
      icon: 'star',
      color: '#f59e0b',
      savings: 'Save ₹197',
    },
    {
      id: 'verified_badge',
      name: 'Verified Badge',
      description: 'Build instant trust',
      price: 499,
      period: '/year',
      icon: 'shield-checkmark',
      color: COLORS.secondary,
    },
    {
      id: 'trusted_pro',
      name: 'Trusted Pro Badge',
      description: 'Premium trust badge',
      price: 999,
      period: '/year',
      icon: 'ribbon',
      color: COLORS.primary,
    },
  ];

  const getSavingsPercentage = (plan) => {
    if (billingCycle === 'yearly' && plan.originalPrice) {
      const savings = ((plan.originalPrice - plan.price) / plan.originalPrice) * 100;
      return Math.round(savings);
    }
    return 0;
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
            <Text style={styles.title}>🚀 Boost Your Business</Text>
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
        <View style={styles.plansContainer}>
          {plans.map((plan) => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.popular && styles.planCardPopular,
              ]}
            >
              {plan.badge && (
                <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
                  <Text style={styles.planBadgeText}>{plan.badge}</Text>
                </View>
              )}

              <View style={[styles.planIconContainer, { backgroundColor: `${plan.color}15` }]}>
                <Icon name={plan.icon} size={36} color={plan.color} />
              </View>

              <Text style={styles.planName}>{plan.name}</Text>
              
              <View style={styles.planPriceContainer}>
                {plan.originalPrice && (
                  <Text style={styles.planOriginalPrice}>₹{plan.originalPrice}</Text>
                )}
                <View style={styles.planPriceRow}>
                  <Text style={styles.planPrice}>₹{plan.price}</Text>
                  <Text style={styles.planPeriod}>{plan.period}</Text>
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
                      size={18}
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
                  { backgroundColor: plan.id === 'free' ? '#e5e7eb' : plan.color },
                  plan.popular && styles.planButtonPopular,
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.planButtonText,
                    { color: plan.id === 'free' ? COLORS.textSecondary : COLORS.white },
                  ]}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Upgrade Now'}
                </Text>
                {plan.id !== 'free' && (
                  <Icon name="arrow-forward" size={18} color={COLORS.white} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

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
                  <Icon name={addon.icon} size={28} color={addon.color} />
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
                >
                  <Text style={[styles.addonButtonText, { color: addon.color }]}>
                    Add to Cart
                  </Text>
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
                  <Icon name={benefit.icon} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                </View>
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
  billingToggleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  billingToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  billingLabel: {
    fontSize: 16,
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
    gap: 8,
  },
  savingsBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardPopular: {
    borderColor: COLORS.accent,
    elevation: 8,
  },
  planBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  planBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '800',
  },
  planIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  planPriceContainer: {
    marginBottom: 20,
  },
  planOriginalPrice: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  planPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  planPrice: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  planPeriod: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  savingsTag: {
    backgroundColor: '#10b98115',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  savingsTagText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '800',
  },
  planFeatures: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  featureTextDisabled: {
    color: COLORS.textSecondary,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    elevation: 4,
  },
  planButtonPopular: {
    elevation: 6,
  },
  planButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  addOnsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  addOnsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addonCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },
  addonSavingsBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addonSavingsText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
  },
  addonIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  addonName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  addonDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  addonPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 12,
  },
  addonPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  addonPeriod: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  addonButton: {
    borderWidth: 2,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  addonButtonText: {
    fontSize: 13,
    fontWeight: '800',
  },
  benefitsSection: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});

export default SubscriptionScreen;
