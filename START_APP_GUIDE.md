# 🚀 PaasoWork - App Start Guide

## ✅ Configuration Status

Your app is now **FULLY CONFIGURED** and ready to run!

- ✅ API config file created with CommonJS exports
- ✅ Render backend URL configured: `https://passo-backend.onrender.com/api`
- ✅ Request timeout set to 5 seconds
- ✅ All imports fixed to use `require()`
- ✅ `__DEV__` variable properly handled
- ✅ Metro cache cleared

---

## 🎯 Quick Start (Easiest Way)

### Option 1: Using Batch Files (Recommended)

**Terminal 1 - Start Metro:**
```cmd
cd PaasoWork
start-fresh.bat
```

**Terminal 2 - Run Android:**
```cmd
cd PaasoWork
run-android.bat
```

### Option 2: Manual Commands

**Terminal 1 - Start Metro:**
```cmd
cd PaasoWork
npx react-native start --reset-cache
```

**Terminal 2 - Run Android:**
```cmd
cd PaasoWork
npx react-native run-android
```

---

## 🔧 Troubleshooting

### If you still see module resolution errors:

1. **Stop Metro bundler** (Ctrl+C)

2. **Clear all caches:**
   ```cmd
   cd PaasoWork
   rmdir /s /q node_modules\.cache
   del /f /q .metro-*
   ```

3. **Verify config works:**
   ```cmd
   node verify-config.js
   ```
   You should see: ✅ Config loaded successfully!

4. **Restart Metro with reset:**
   ```cmd
   npx react-native start --reset-cache
   ```

5. **In another terminal, run Android:**
   ```cmd
   npx react-native run-android
   ```

### If Android build fails:

1. **Clean Android build:**
   ```cmd
   cd android
   gradlew clean
   cd ..
   ```

2. **Rebuild:**
   ```cmd
   npx react-native run-android
   ```

---

## 📱 Test Your App

Once the app starts:

1. **Test Backend Connection:**
   - Open the app
   - Go to Login screen
   - Check console logs for API connection

2. **Test Login:**
   - Mobile: `9876543210`
   - Password: `password123`

3. **Check Logs:**
   ```cmd
   npx react-native log-android
   ```

---

## 🌐 Backend Configuration

### Current Setup:
- **Backend URL:** `https://passo-backend.onrender.com/api`
- **Health Check:** `https://passo-backend.onrender.com/health`
- **Timeout:** 5 seconds

### To Switch to Local Backend:

Edit `src/config/api.config.js`:

```javascript
const getApiBaseUrl = () => {
  // Change this line:
  return API_CONFIG.local.baseURL; // Use local backend
  
  // Instead of:
  // return API_CONFIG.render.baseURL;
};
```

Then restart Metro with `--reset-cache`.

---

## 📋 Available API Endpoints

Your app can now access:

### Authentication
- `POST /api/auth/worker/login`
- `POST /api/auth/worker/register`

### Worker Profile
- `GET /api/workers/me`
- `PUT /api/workers/me`
- `GET /api/workers/me/stats`
- `PUT /api/workers/me/status`
- `GET /api/workers/dashboard`

### Bookings & More
- `GET /api/workers/bookings`
- `GET /api/workers/me/reviews`
- `GET /api/workers/me/earnings`

---

## 🐛 Debug Mode

To enable verbose logging in your app:

```javascript
import { enableVerboseLogging } from './src/utils/debugHelper';
enableVerboseLogging();
```

---

## ✨ What's Fixed

1. ✅ Changed from ES6 `export` to CommonJS `module.exports`
2. ✅ Fixed all `import` statements to use `require()`
3. ✅ Added `__DEV__` safety check
4. ✅ Set timeout to 5000ms (5 seconds)
5. ✅ Configured Render backend URL
6. ✅ Cleared Metro cache
7. ✅ Created helper scripts for easy startup

---

## 🎉 You're Ready!

Your app is now properly configured. Just run the commands above and start testing!

**Need help?** Check the console logs for detailed error messages.

**Backend not responding?** Check: https://passo-backend.onrender.com/health
