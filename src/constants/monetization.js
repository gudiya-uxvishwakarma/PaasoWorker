export const ONBOARDING_FEES = {
  individual: 99,
  crew_leader: 299,
  contractor: 499,
  service_provider: 999,
};

export const VERIFICATION_BADGES = {
  basic: {
    name: 'Verified',
    price: 0,
    features: ['Phone Verified', 'Basic Profile'],
  },
  trusted_pro: {
    name: 'Trusted Pro',
    price: 499,
    duration: 'yearly',
    features: ['KYC Verified', 'Priority Support', 'Trust Badge'],
  },
  business_verified: {
    name: 'Business Verified',
    price: 999,
    duration: 'yearly',
    features: ['GST Verified', 'Business Badge', 'Premium Support'],
  },
};

export const FEATURED_PLANS = {
  weekly: {
    name: 'Featured - Weekly',
    price: 299,
    duration: '7 days',
    features: ['Top placement', 'Highlighted card', '3x visibility'],
  },
  monthly: {
    name: 'Featured - Monthly',
    price: 999,
    duration: '30 days',
    features: ['Top placement', 'Highlighted card', '5x visibility', 'Save 25%'],
  },
};

export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basic listing', 'Profile views', 'Contact requests'],
  },
  starter: {
    name: 'Starter',
    price: 499,
    duration: 'monthly',
    features: ['Higher visibility', 'Lead insights', '2 featured slots/month'],
  },
  pro: {
    name: 'Pro',
    price: 999,
    duration: 'monthly',
    features: ['Premium visibility', 'Advanced analytics', '5 featured slots/month', 'Priority support'],
  },
  business: {
    name: 'Business',
    price: 1999,
    duration: 'monthly',
    features: ['Maximum visibility', 'Full analytics', 'Unlimited featured slots', 'Dedicated support', 'API access'],
  },
};
