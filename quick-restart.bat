@echo off
echo ========================================
echo Quick App Restart
echo ========================================
echo.

echo [1/3] Stopping app...
adb shell am force-stop com.paasowork
timeout /t 1 /nobreak >nul

echo [2/3] Clearing app cache...
adb shell pm clear com.paasowork
timeout /t 1 /nobreak >nul

echo [3/3] Starting app...
adb shell am start -n com.paasowork/.MainActivity

echo.
echo ========================================
echo ✅ App restarted!
echo ========================================
echo.
echo Monitoring logs...
echo Press Ctrl+C to stop
echo.

adb logcat -c
adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D *:E
