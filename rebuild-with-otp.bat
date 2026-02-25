@echo off
echo ========================================
echo Rebuilding App with OTP Package
echo ========================================

echo.
echo Step 1: Cleaning Android build...
cd android
call gradlew clean
cd ..

echo.
echo Step 2: Clearing Metro cache...
npx react-native start --reset-cache

echo.
echo Done! Now run: npx react-native run-android
pause
