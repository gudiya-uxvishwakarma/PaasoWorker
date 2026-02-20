@echo off
echo ========================================
echo Firebase Token Test
echo ========================================
echo.

echo Clearing logcat buffer...
adb logcat -c

echo.
echo Starting logcat to monitor Firebase initialization...
echo Press Ctrl+C to stop monitoring
echo.
echo Looking for:
echo - Firebase initialized
echo - FCM Token obtained
echo - Any Firebase errors
echo.
echo ========================================
echo.

adb logcat | findstr /i "MainApplication FCMService firebase fcm token"
