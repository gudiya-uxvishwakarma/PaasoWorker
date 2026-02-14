# ✅ API Configuration Complete

## 🎯 Current Setup

Your app is now properly configured to connect to your Render backend!

### Backend URL
```
Production: https://passo-backend.onrender.com/api
Local: http://10.0.2.2:5000/api (Android Emulator)
```

### Currently Active
**Render Production Backend** ✅

---

## 📋 API Endpoints Available

### Authentication
- `POST /api/auth/worker/login` - Worker login
- `POST /api/auth/worker/register` - Worker registration
- `POST /api/auth/logout` - Logout

### Worker Profile
- `GET /api/workers/me` - Get current worker profile
- `PUT /api/workers/me` - Update worker profile
- `GET /api/workers/me/stats` - Get worker statistics
- `PUT /api/workers/me/status` - Update online status
- `GET /api/workers/dashboard` - Get dashboard data

### Worker Management
- `POST /api/workers/check-mobile` - Check if mobile exists
- `GET /api/workers` - Get all workers (with filters)
- `GET /api/workers/:id` - Get worker by ID

### Bookings
- `GET /api/workers/bookings` - Get worker bookings
- `PUT /api/workers/bookings/:id` - Update booking status

### Reviews & Earnings
- `GET /api/workers/me/reviews` - Get worker reviews
- `GET /api/workers/me/earnings` - Get worker earnings

---

## 🔧 Configuration Files

### 1. API Config (`src/config/api.config.js`)
```javascript
// Currently using Render backend
const getApiBaseUrl = () => {
  return API_CONFIG.render.baseURL; // ✅ Active
};
```

**To switch to local backend:**
```javascript
const getApiBaseUrl = () => {
  return API_CONFIG.local.baseURL; // Use local
};
```

### 2. Request Timeout
```javascript
const REQUEST_TIMEOUT = 5000; // 5 seconds
```

---

## 🧪 Test Your Connection

Run this command to test backend connectivity:
```bash
cd PaasoWork
node test-backend-connection.js
```

Or test directly in browser:
```
https://passo-backend.onrender.com/health
```

---

## 🚀 How to Run Your App

### 1. Clear Metro Cache
```bash
cd PaasoWork
npx react-native start --reset-cache
```

### 2. Run on Android (in another terminal)
```bash
cd PaasoWork
npx react-native run-android
```

### 3. Run on iOS
```bash
cd PaasoWork
npx react-native run-ios
```

---

## 📱 Test Login Credentials

Use these test credentials to login:

**Mobile:** `9876543210`
**Password:** `password123`

Or create a new worker account through the registration flow.

---

## 🔍 Debugging

If you face connection issues:

1. **Check backend is running:**
   ```
   https://passo-backend.onrender.com/health
   ```

2. **Check Metro bundler logs:**
   Look for API request logs in the Metro terminal

3. **Check app logs:**
   ```bash
   npx react-native log-android
   ```

4. **Enable verbose logging:**
   In your app, import and use:
   ```javascript
   import { enableVerboseLogging } from './src/utils/debugHelper';
   enableVerboseLogging();
   ```

---

## ✨ What's Working Now

✅ API configuration properly set up with CommonJS exports
✅ Render backend URL configured
✅ All API endpoints mapped correctly
✅ Request timeout set to 5 seconds
✅ Authentication flow ready
✅ Worker profile management ready
✅ Dashboard data fetching ready
✅ No syntax errors

---

## 🎉 Your App is Ready!

Your PaasoWork app is now properly configured to communicate with your backend. Just run the app and start testing!

**Need to switch backends?** Edit `src/config/api.config.js` and change the return value in `getApiBaseUrl()`.

**Having issues?** Check the console logs for detailed error messages.
