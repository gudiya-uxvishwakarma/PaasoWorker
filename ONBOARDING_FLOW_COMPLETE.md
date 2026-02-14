# ✅ Onboarding Flow - Complete Integration

## 🎯 Flow Overview

Your app now has a complete step-by-step onboarding flow that checks the worker's profile and guides them through missing steps.

---

## 📋 Onboarding Steps

### 1. Login ✅
- Worker enters mobile & password
- Backend validates credentials
- Returns worker profile data

### 2. Profile Check ✅
- App checks if profile is complete
- Determines which onboarding steps are needed

### 3. Verification Screen ⏳
**Shown when:** `verified: false` OR `kycVerified: false`

**Features:**
- Trust score display
- Verification badge options
- Document upload section
- "Skip for Now" button

**Actions:**
- Upload documents → Mark as verified
- Skip → Continue to next step

### 4. Worker Type Selection ⏳
**Shown when:** `workerType` is missing

**Options:**
- Worker (Individual)
- Crew / Team
- Contractor
- Service Provider

**Actions:**
- Select type → Continue to profile details

### 5. Profile Details ⏳
**Shown when:** Missing required fields:
- Name
- Category
- City
- Service Area

**Actions:**
- Fill details → Update backend → Go to dashboard

### 6. Dashboard ✅
**Shown when:** All onboarding complete

**Features:**
- Worker stats
- Bookings
- Earnings
- Profile management

---

## 🔍 Profile Check Logic

```javascript
checkOnboardingStatus(userData) {
  // Step 1: Check verification
  if (!userData.verified || !userData.kycVerified) {
    return { required: true, screen: 'verification' };
  }

  // Step 2: Check worker type
  if (!userData.workerType) {
    return { required: true, screen: 'workerTypeSelection' };
  }

  // Step 3: Check profile completeness
  if (!userData.name || !userData.category || !userData.city) {
    return { required: true, screen: 'profileDetails' };
  }

  // All complete!
  return { required: false, screen: 'home' };
}
```

---

## 🧪 Testing the Flow

### Test Worker Created:
```
Mobile: 9305241794
Password: test123

Profile Status:
✅ Can login (status: Approved)
❌ Not verified (verified: false)
❌ KYC not verified (kycVerified: false)
✅ Has worker type (Worker)
✅ Has category (Plumber)
✅ Has location (Delhi)
```

### Expected Flow:
1. **Login** → Enter credentials → Success
2. **Verification Screen** → Shows trust score & documents
3. **Skip for Now** → Click skip button
4. **Dashboard** → Lands on home screen

---

## 🎨 Screen Features

### Verification Screen
- **Trust Score Card:** Shows 45/100 score
- **Verification Badges:** 3 badge options with pricing
- **Document Upload:** Aadhaar, License, GST
- **Skip Button:** "Skip for Now" with hint text

### Worker Type Selection
- **4 Worker Types:** Visual cards with icons
- **Language Selection:** Choose preferred language
- **Continue Button:** Proceeds to profile details

### Profile Details
- **Personal Info:** Name, email, mobile
- **Category Selection:** Multi-select categories
- **Location:** City and service area
- **Team Size:** For crew/team types
- **Submit Button:** Saves to backend

---

## 🔄 Data Flow

### Login → Profile Check
```
1. User logs in
2. Backend returns worker data
3. App stores in AuthContext
4. AppNavigator checks onboarding status
5. Navigates to appropriate screen
```

### Onboarding Step → Next Step
```
1. User completes current step
2. Data is updated (local + backend)
3. App re-checks onboarding status
4. Navigates to next required step
5. If all complete → Dashboard
```

### Skip Verification
```
1. User clicks "Skip for Now"
2. onComplete callback fired
3. userData.verificationSkipped = true
4. App checks next onboarding step
5. Continues flow
```

---

## 📱 API Integration

### Endpoints Used:

**Login:**
```
POST /api/auth/worker/login
Body: { mobile, password }
Response: { success, token, worker }
```

**Get Profile:**
```
GET /api/workers/me
Headers: { Authorization: Bearer <token> }
Response: { success, worker }
```

**Update Profile:**
```
PUT /api/workers/me
Headers: { Authorization: Bearer <token> }
Body: { name, category, city, ... }
Response: { success, worker }
```

**Update Status:**
```
PUT /api/workers/me/status
Body: { online: true/false }
Response: { success, worker }
```

---

## 🚀 How to Test

### 1. Start Backend
```cmd
cd Passo_backend
npm start
```

### 2. Start App
```cmd
Terminal 1: cd PaasoWork && npx react-native start --reset-cache
Terminal 2: cd PaasoWork && npx react-native run-android
```

### 3. Login
- Mobile: `9305241794`
- Password: `test123`

### 4. Follow Flow
1. ✅ Login successful
2. 📋 Verification screen appears (verified: false)
3. 👆 Click "Skip for Now"
4. 🏠 Dashboard loads

---

## 🎯 Customization

### To Change Onboarding Logic:

Edit `AppNavigator.jsx` → `checkOnboardingStatus()` function

### To Add New Onboarding Step:

1. Create new screen component
2. Add case in `renderScreen()` switch
3. Update `checkOnboardingStatus()` logic
4. Add navigation in previous step's `onComplete`

### To Skip Verification Always:

In `checkOnboardingStatus()`:
```javascript
// Comment out verification check
// if (!userData.verified || !userData.kycVerified) {
//   return { required: true, screen: 'verification' };
// }
```

---

## ✨ Features Implemented

✅ Smart profile checking
✅ Step-by-step onboarding flow
✅ Skip functionality for optional steps
✅ Backend integration for profile updates
✅ Persistent authentication state
✅ Automatic navigation based on profile status
✅ Loading states during auth check
✅ Error handling for API failures

---

## 🐛 Troubleshooting

### Issue: Stuck on verification screen
**Solution:** Click "Skip for Now" button at the bottom

### Issue: Goes directly to dashboard
**Solution:** Worker profile is complete. Create incomplete worker:
```cmd
cd Passo_backend
node create-incomplete-worker.js
```

### Issue: Login fails
**Solution:** Check backend is running and worker exists:
```cmd
cd Passo_backend
node check-and-create-worker.js
```

---

## 🎉 You're All Set!

Your onboarding flow is complete and integrated with the backend. Test it out!

**Login Credentials:**
- Mobile: 9305241794
- Password: test123

Happy testing! 🚀
