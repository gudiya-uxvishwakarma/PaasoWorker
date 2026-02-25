@echo off
echo ========================================
echo Testing Notification After Registration
echo ========================================
echo.
echo This script will:
echo 1. Wait for you to register in the app
echo 2. Send a test notification
echo 3. Verify it appears on your device
echo.

set /p PHONE_NUMBER="Enter phone number (e.g., +919876543210): "

echo.
echo Step 1: Register in the app with phone: %PHONE_NUMBER%
echo Press any key AFTER you complete registration...
pause > nul

echo.
echo Step 2: Sending test notification...
node test-notification-after-registration.js %PHONE_NUMBER%

echo.
echo ========================================
echo Check your device for notification!
echo ========================================
pause
