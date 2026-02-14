# 🔐 Login Test Guide

## ✅ Worker Created Successfully!

Your test worker has been created in the database and is ready for login.

---

## 📱 Login Credentials

```
Mobile Number: 9305241794
Password: test123
```

---

## 🎯 How to Test Login

### Step 1: Start the App
Make sure your app is running:
```cmd
Terminal 1: npx react-native start --reset-cache
Terminal 2: npx react-native run-android
```

### Step 2: Login Process

1. **Open the app** - You'll see the Login screen

2. **Click "Login with Password"** button at the bottom

3. **Enter credentials:**
   - Mobile: `9305241794`
   - Password: `test123`

4. **Click "Login"** button

5. **Success!** You should see:
   - "Welcome back" message
   - Navigate to Dashboard

---

## 🔍 What Happens Behind the Scenes

1. **App sends request** to: `https://passo-backend.onrender.com/api/auth/worker/login`

2. **Backend checks:**
   - ✅ Worker exists with mobile 9305241794
   - ✅ Password matches (test123)
   - ✅ Worker status is "Approved"
   - ✅ Worker is verified

3. **Backend returns:**
   - JWT token
   - Worker profile data

4. **App stores:**
   - Token in AsyncStorage
   - User data in AsyncStorage
   - Updates AuthContext state

5. **App navigates** to Dashboard

---

## 🐛 Troubleshooting

### If login fails with "Invalid credentials":

1. **Check backend is running:**
   ```
   https://passo-backend.onrender.com/health
   ```

2. **Verify worker exists:**
   ```cmd
   cd Passo_backend
   node check-and-create-worker.js
   ```

3. **Check app logs:**
   ```cmd
   npx react-native log-android
   ```

### If you see "Account Pending":

The worker status is not "Approved". Run:
```cmd
cd Passo_backend
node check-and-create-worker.js
```

This will update the worker status to "Approved".

### If you see "Unable to connect to server":

1. **Check internet connection**

2. **Verify API URL** in `src/config/api.config.js`:
   ```javascript
   return API_CONFIG.render.baseURL;
   ```

3. **Clear Metro cache:**
   ```cmd
   npx react-native start --reset-cache
   ```

---

## 📊 Worker Details

Your test worker has these details:

```json
{
  "name": "Test Worker",
  "mobile": "9305241794",
  "email": "testworker@example.com",
  "category": ["Plumber"],
  "workerType": "Worker",
  "city": "Delhi",
  "serviceArea": "Delhi",
  "languages": ["Hindi", "English"],
  "status": "Approved",
  "verified": true,
  "kycVerified": true,
  "rating": 4.5,
  "totalReviews": 10,
  "subscription": {
    "plan": "Free",
    "status": "Active"
  }
}
```

---

## 🎉 Expected Flow

1. **Login Screen** → Enter credentials → Click Login
2. **Loading** → "Please wait..."
3. **Success Modal** → "Welcome back" (600ms)
4. **Dashboard** → See worker profile and stats

---

## 🔄 Alternative: OTP Login

If you want to test OTP login:

1. Click "Login with OTP" button
2. Enter mobile: `9305241794`
3. Click "Send OTP"
4. Enter OTP: `123456` (demo OTP)
5. Click "Verify & Continue"

Note: OTP login will work but may require password if auto-login fails.

---

## 📝 Notes

- Password is hashed in database using bcrypt
- JWT token expires in 7 days
- Worker must have status "Approved" to login
- All API calls have 5 second timeout
- Backend URL: `https://passo-backend.onrender.com/api`

---

## ✨ You're All Set!

Your login integration is complete and working. Just enter the credentials and test!

**Mobile:** 9305241794  
**Password:** test123

Happy testing! 🚀
