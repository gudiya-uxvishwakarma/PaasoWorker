@echo off
echo ========================================
echo Running React Native App
echo ========================================
echo.

REM Check if device is connected
echo Checking for connected devices...
adb devices
echo.

REM Check if any device is connected
adb devices | find "device" | find /v "List" >nul
if errorlevel 1 (
    echo ========================================
    echo ERROR: No device connected!
    echo ========================================
    echo.
    echo Please:
    echo 1. Connect your Android device via USB
    echo 2. Enable USB debugging
    echo 3. Or start an Android emulator
    echo.
    pause
    exit /b 1
)

echo Device found!
echo.
echo Starting Metro bundler and building app...
echo This may take 2-3 minutes on first run...
echo.

REM Run the app
npx react-native run-android

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: App failed to run!
    echo ========================================
    echo.
    echo Try these fixes:
    echo 1. Run: COMPLETE_BUILD_FIX.bat
    echo 2. Check if Metro bundler is running
    echo 3. Check device connection: adb devices
    echo 4. Check Android SDK is installed
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo App is running!
echo ========================================
echo.
echo Metro bundler is running in this window.
echo Keep this window open.
echo.
echo To reload app: Press R R (double R) in Metro window
echo To open dev menu: Shake device or press Ctrl+M
echo.
pause
