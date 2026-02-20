@echo off
echo ========================================
echo Firebase Complete Rebuild Script
echo ========================================
echo.

echo [1/8] Stopping Metro bundler and ADB...
taskkill /F /IM node.exe 2>nul
adb kill-server
timeout /t 2 /nobreak >nul

echo.
echo [2/8] Cleaning Android build cache...
cd android
call gradlew clean
if errorlevel 1 (
    echo ERROR: Gradle clean failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo [3/8] Clearing Gradle cache...
rmdir /s /q .gradle 2>nul
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul

echo.
echo [4/8] Clearing React Native cache...
cd ..
rmdir /s /q node_modules\.cache 2>nul
del /f /q metro.config.js.cache 2>nul

echo.
echo [5/8] Verifying google-services.json...
if not exist "android\app\google-services.json" (
    echo ERROR: google-services.json not found!
    echo Please ensure the file exists at: android\app\google-services.json
    pause
    exit /b 1
)
echo ✓ google-services.json found

echo.
echo [6/8] Starting ADB server...
adb start-server
timeout /t 2 /nobreak >nul

echo.
echo [7/8] Checking connected devices...
adb devices
echo.

echo [8/8] Building and installing app...
echo This may take a few minutes...
echo.
npx react-native run-android --active-arch-only

if errorlevel 1 (
    echo.
    echo ========================================
    echo BUILD FAILED!
    echo ========================================
    echo.
    echo Common fixes:
    echo 1. Ensure device/emulator is connected
    echo 2. Check if Google Play Services is installed
    echo 3. Verify internet connection
    echo 4. Try running: cd android ^&^& gradlew clean
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo BUILD SUCCESSFUL!
echo ========================================
echo.
echo Firebase should now be properly initialized.
echo Check the app for the success message.
echo.
pause
