@echo off
echo ========================================
echo Quick Firebase Fix
echo ========================================
echo.
echo This will:
echo 1. Clean build cache
echo 2. Rebuild the app
echo 3. Monitor Firebase initialization
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Starting fix...
echo.

REM Step 1: Clean
echo [1/3] Cleaning...
cd android
call gradlew clean >nul 2>&1
cd ..

REM Step 2: Rebuild
echo [2/3] Rebuilding app (this may take a few minutes)...
start /min cmd /c "npx react-native run-android --active-arch-only"

REM Wait for build to start
timeout /t 10 /nobreak >nul

REM Step 3: Monitor logs
echo [3/3] Monitoring Firebase logs...
echo.
echo Look for:
echo - "Firebase initialized successfully"
echo - "FCM Token obtained successfully"
echo.
echo Press Ctrl+C to stop monitoring
echo.

adb logcat -c
adb logcat | findstr /i "MainApplication firebase fcm token"
