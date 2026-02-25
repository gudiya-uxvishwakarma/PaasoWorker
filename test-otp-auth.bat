@echo off
echo ========================================
echo Firebase OTP Authentication Test
echo ========================================
echo.

echo Step 1: Checking Firebase configuration...
if exist "android\app\google-services.json" (
    echo [OK] google-services.json found
) else (
    echo [ERROR] google-services.json not found!
    echo Please download from Firebase Console
    pause
    exit /b 1
)

echo.
echo Step 2: Checking dependencies...
call npm list @react-native-firebase/auth >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Firebase Auth installed
) else (
    echo [ERROR] Firebase Auth not installed!
    echo Run: npm install @react-native-firebase/auth
    pause
    exit /b 1
)

echo.
echo Step 3: Cleaning build...
cd android
call gradlew clean
cd ..

echo.
echo Step 4: Building and running app...
echo This will take a few minutes...
call npx react-native run-android

echo.
echo ========================================
echo Test Instructions:
echo ========================================
echo 1. Enter your phone number (10 digits)
echo 2. Click "Send OTP"
echo 3. Check your SMS for OTP
echo 4. Enter OTP (or wait for auto-read)
echo 5. Verify authentication success
echo.
echo Check logs for Firebase authentication status
echo ========================================
pause
