@echo off
echo ========================================
echo Firebase Setup - Clean Rebuild
echo ========================================
echo.

echo [1/6] Stopping Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/6] Cleaning Gradle cache...
cd android
call gradlew clean
if errorlevel 1 (
    echo ERROR: Gradle clean failed
    pause
    exit /b 1
)

echo [3/6] Clearing build folders...
rmdir /s /q build 2>nul
rmdir /s /q app\build 2>nul
rmdir /s /q .gradle 2>nul

echo [4/6] Clearing React Native cache...
cd ..
rmdir /s /q node_modules\.cache 2>nul
del /f /q metro.config.js.* 2>nul

echo [5/6] Building APK with Firebase...
cd android
call gradlew assembleDebug --stacktrace
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo [6/6] Installing APK...
call gradlew installDebug
if errorlevel 1 (
    echo ERROR: Installation failed
    pause
    exit /b 1
)

cd ..
echo.
echo ========================================
echo ✅ Firebase setup complete!
echo ========================================
echo.
echo Starting Metro bundler...
start cmd /k "npm start"

echo.
echo App installed successfully!
echo Check logcat for Firebase initialization logs:
echo adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D
echo.
pause
