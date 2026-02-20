@echo off
echo ========================================
echo Google Play Services Fix
echo ========================================
echo.

echo [Step 1] Checking device connection...
adb devices
echo.

echo [Step 2] Checking Google Play Services...
adb shell pm list packages | findstr "com.google.android.gms"
if errorlevel 1 (
    echo.
    echo ❌ Google Play Services NOT FOUND!
    echo.
    echo This is the problem! Your device/emulator needs Google Play Services.
    echo.
    echo Solutions:
    echo 1. If using emulator: Create new emulator with "Google Play" image
    echo 2. If using device: Update Google Play Services from Play Store
    echo.
    pause
    exit /b 1
)
echo ✓ Google Play Services package found
echo.

echo [Step 3] Checking Google Play Services version...
adb shell dumpsys package com.google.android.gms | findstr "versionName"
echo.

echo [Step 4] Checking if Google Play Services is enabled...
adb shell pm list packages -e | findstr "com.google.android.gms"
if errorlevel 1 (
    echo ❌ Google Play Services is DISABLED!
    echo Enabling it...
    adb shell pm enable com.google.android.gms
)
echo ✓ Google Play Services is enabled
echo.

echo [Step 5] Clearing Google Play Services cache...
adb shell pm clear com.google.android.gms
echo ✓ Cache cleared
echo.

echo [Step 6] Clearing your app data...
adb shell pm clear com.paasowork
echo ✓ App data cleared
echo.

echo [Step 7] Checking internet connectivity...
adb shell ping -c 3 8.8.8.8
if errorlevel 1 (
    echo ❌ No internet connection!
    echo Please enable internet on your device/emulator
    pause
    exit /b 1
)
echo ✓ Internet connection working
echo.

echo ========================================
echo Google Play Services Status: OK
echo ========================================
echo.
echo Now rebuild your app:
echo   rebuild-firebase-complete.bat
echo.
pause
