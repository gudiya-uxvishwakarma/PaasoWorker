# 🔥 Quick Firebase Fix - 3 Steps

## ❌ Problem
App showing: "Firebase Setup Failed - SERVICE_NOT_AVAILABLE"

## ✅ Solution (3 Steps)

### Step 1: Verify Configuration
```bash
test-firebase-setup.bat
```
**Expected:** All checks should show ✅

### Step 2: Clean Rebuild
```bash
cd PaasoWork\android
rebuild-firebase.bat
```
**Wait:** This will take 2-3 minutes

### Step 3: Monitor Logs
```bash
check-firebase-logs.bat
```
**Look for:** 
- ✅ Firebase initialized successfully
- ✅ FCM auto-init enabled
- ✅ FCM Token obtained

## 📱 What Changed?

### 1. MainApplication.kt
- Added Firebase initialization
- Created notification channel
- Enabled FCM auto-init

### 2. MyFirebaseMessagingService.kt
- Custom FCM service for handling notifications
- Proper notification display
- Token refresh handling

### 3. AndroidManifest.xml
- Updated to use custom FCM service
- All required permissions added

### 4. App.jsx
- Better error handling
- Detailed error messages
- Permission checks

## 🎯 Expected Result

After rebuild, you should see:
1. No "Firebase Setup Failed" error
2. Alert showing "✅ Firebase Connected"
3. FCM token in logs
4. App working normally

## 🔍 Still Having Issues?

### Check 1: Google Play Services
```bash
adb shell pm list packages | findstr google
```
Should show: `com.google.android.gms`

### Check 2: Internet Connection
Make sure device/emulator has internet

### Check 3: google-services.json
```bash
type android\app\google-services.json
```
Should show your Firebase project details

## 📞 Need Help?

Check logs with:
```bash
adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D
```

Look for any ❌ errors and share them.

---

**Status:** All fixes applied ✅
**Next:** Run `rebuild-firebase.bat`
