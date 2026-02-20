# 🔥 Firebase Setup Guide - PaasoWork

## ✅ Setup Complete Checklist

### 1. Firebase Console Configuration
- [x] Project created: `paaso-app`
- [x] Android app registered: `com.paasowork`
- [x] `google-services.json` downloaded and placed in `android/app/`

### 2. Android Configuration
- [x] Google Services plugin added to `build.gradle`
- [x] Firebase dependencies added (BoM + Messaging)
- [x] `MainApplication.kt` updated with Firebase initialization
- [x] Custom `MyFirebaseMessagingService.kt` created
- [x] `AndroidManifest.xml` updated with FCM service
- [x] Notification channel configured in `strings.xml`

### 3. React Native Configuration
- [x] `@react-native-firebase/app` installed
- [x] `@react-native-firebase/messaging` installed
- [x] FCM service created (`src/services/fcm.service.js`)
- [x] Firebase diagnostics utility created
- [x] App.jsx updated with FCM initialization

## 🚀 How to Build & Test

### Step 1: Verify Setup
```bash
test-firebase-setup.bat
```

### Step 2: Clean Rebuild
```bash
cd android
rebuild-firebase.bat
```

### Step 3: Check Logs
```bash
adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D
```

## 📱 Expected Logs

### On App Start:
```
MainApplication: ✅ Firebase initialized successfully
MainApplication: ✅ FCM auto-init enabled
MainApplication: ✅ Notification channel created: paaso_default_channel
ReactNativeJS: 🚀 Starting FCM setup...
ReactNativeJS: ✅ FCM Token obtained: [token]
ReactNativeJS: ✅ FCM setup completed successfully
```

### On Notification Received:
```
FCMService: 📩 Message received from: [sender]
FCMService: 📬 Notification Title: [title]
FCMService: 📬 Notification Body: [body]
FCMService: ✅ Notification displayed
```

## 🔧 Troubleshooting

### Error: SERVICE_NOT_AVAILABLE
**Cause:** Firebase not properly initialized or Google Play Services missing

**Fix:**
1. Ensure `google-services.json` is in `android/app/`
2. Run `rebuild-firebase.bat`
3. Check if Google Play Services is installed on device/emulator

### Error: FCM initialization failed
**Cause:** Missing permissions or configuration

**Fix:**
1. Check `AndroidManifest.xml` has all permissions
2. Verify `MainApplication.kt` has Firebase initialization
3. Ensure device has internet connection

### Error: Token not obtained
**Cause:** Notification permission denied or Firebase not ready

**Fix:**
1. Grant notification permission in app settings
2. Restart app
3. Check logs for initialization errors

## 📝 Testing Push Notifications

### Using Firebase Console:
1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter notification title and body
4. Select your app
5. Send test message

### Using Backend API:
```javascript
// Send notification via backend
const response = await fetch('http://your-backend/api/notifications/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fcmToken: 'device-fcm-token',
    title: 'Test Notification',
    body: 'This is a test message'
  })
});
```

## 🔐 Security Notes

1. **Never commit** `google-services.json` to public repositories
2. Add to `.gitignore` if needed
3. Use environment-specific configurations for production
4. Rotate API keys regularly

## 📚 Additional Resources

- [React Native Firebase Docs](https://rnfirebase.io/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Android Notification Channels](https://developer.android.com/develop/ui/views/notifications/channels)

## ✅ Current Status

**Firebase Setup:** ✅ COMPLETE
**FCM Service:** ✅ CONFIGURED
**Notification Channel:** ✅ CREATED
**Ready for Testing:** ✅ YES

---

Last Updated: $(date)
