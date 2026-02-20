@echo off
echo ========================================
echo Full Rebuild and Test - Firebase
echo ========================================
echo.

echo Step 1: Verification
echo ----------------------------------------
call test-firebase-setup.bat
echo.

echo Step 2: Clean Build
echo ----------------------------------------
echo Starting clean rebuild...
cd android
call gradlew clean assembleDebug installDebug --stacktrace
if errorlevel 1 (
    echo ❌ Build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 3: Start Metro
echo ----------------------------------------
start "Metro Bundler" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo Step 4: Launch App
echo ----------------------------------------
adb shell am start -n com.paasowork/.MainActivity
timeout /t 2 /nobreak >nul

echo.
echo Step 5: Monitor Logs
echo ----------------------------------------
echo Watching for Firebase initialization...
echo Press Ctrl+C to stop
echo.

adb logcat -c
adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D *:E
