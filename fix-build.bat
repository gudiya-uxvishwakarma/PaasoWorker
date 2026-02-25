@echo off
echo ========================================
echo Fixing React Native Build Issues
echo ========================================
echo.

echo Step 1: Cleaning build folders...
rmdir /s /q android\app\build 2>nul
rmdir /s /q android\app\.cxx 2>nul
rmdir /s /q android\build 2>nul
rmdir /s /q node_modules\@react-native-async-storage\async-storage\android\build 2>nul
rmdir /s /q node_modules\@react-native-google-signin\google-signin\android\build 2>nul
rmdir /s /q node_modules\react-native-html-to-pdf\android\build 2>nul
rmdir /s /q node_modules\react-native-image-picker\android\build 2>nul
echo Done!
echo.

echo Step 2: Running Gradle clean...
cd android
call gradlew clean
cd ..
echo Done!
echo.

echo Step 3: Building debug APK...
cd android
call gradlew assembleDebug
cd ..
echo.

echo ========================================
echo Build Complete!
echo ========================================
echo.
echo APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
