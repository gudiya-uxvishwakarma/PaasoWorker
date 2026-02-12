# PaasoWork - Worker App

Android-first worker management application with comprehensive onboarding, profile management, and monetization features.

## Features

### 🔐 Authentication
- OTP-based login system
- Secure phone verification

### 👥 Worker Types
- **Individual Worker** - ₹99 onboarding fee
- **Crew Leader** - ₹299 onboarding fee (with team management)
- **Contractor** - ₹499 onboarding fee
- **Service Provider** - ₹999 onboarding fee (shop/agency)

### 📋 Onboarding & Profile
- Multi-step onboarding process
- Worker type selection
- Profile details (name, business name, skills, service areas)
- Availability toggle (Online/Busy/Offline)
- Working days & hours scheduling
- Crew management for Crew Leaders

### 💰 Monetization Features

#### 1. Onboarding Fees
- One-time configurable fees by worker type
- Secure payment integration ready

#### 2. Trust & Verification Badges
- KYC-lite verification (Aadhaar/DL upload)
- Optional GST verification for Service Providers
- Verified badge after admin approval
- Premium trust badges:
  - **Trusted Pro** - ₹499/year
  - **Business Verified** - ₹999/year

#### 3. Featured Listing
- **Weekly Plan** - ₹299 (7 days)
- **Monthly Plan** - ₹999 (30 days, save 25%)
- Priority placement in search results
- Highlighted worker card UI
- 3-5x visibility boost

#### 4. Subscription Plans
- **Free** - Basic listing
- **Starter** - ₹499/month (Higher visibility, lead insights)
- **Pro** - ₹999/month (Premium visibility, analytics, 5 featured slots)
- **Business** - ₹1999/month (Maximum visibility, unlimited featured slots, API access)

### 📊 Worker Insights
- Profile view count
- Contact unlock tracking
- Performance indicators
- Weekly statistics

### 🔒 Privacy & Support
- Hide phone number toggle
- Availability scheduling
- In-app help system
- Complaint resolution

## Project Structure

```
src/
├── navigation/
│   └── AppNavigator.jsx          # Main navigation controller
├── screens/
│   ├── auth/
│   │   └── LoginScreen.jsx       # OTP login
│   ├── onboarding/
│   │   └── OnboardingScreen.jsx  # Multi-step onboarding
│   ├── home/
│   │   └── HomeScreen.jsx        # Dashboard with insights
│   ├── profile/
│   │   └── ProfileScreen.jsx     # Profile management
│   └── monetization/
│       └── SubscriptionScreen.jsx # Subscription plans
├── components/
│   └── ScheduleModal.jsx         # Working schedule modal
└── constants/
    └── monetization.js           # Pricing & plans config
```

## Installation

```bash
# Install dependencies
npm install

# Run on Android
npm run android

# Start Metro bundler
npm start
```

## Configuration

All monetization settings are configurable in `src/constants/monetization.js`:
- Onboarding fees by worker type
- Verification badge pricing
- Featured listing plans
- Subscription tiers

## Tech Stack

- React Native 0.83.1
- React 19.2.0
- React Native Safe Area Context
- No external navigation library (custom implementation)

## Next Steps

- [ ] Integrate payment gateway
- [ ] Add KYC document upload
- [ ] Implement admin approval system
- [ ] Add analytics dashboard
- [ ] Crew member management UI
- [ ] Push notifications
- [ ] Chat/messaging system
