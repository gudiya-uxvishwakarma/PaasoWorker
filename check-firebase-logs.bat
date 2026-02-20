@echo off
echo ========================================
echo Firebase Real-Time Log Monitor
echo ========================================
echo.
echo Monitoring Firebase initialization and FCM logs...
echo Press Ctrl+C to stop
echo.
echo ========================================
echo.

adb logcat -c
adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D *:E
