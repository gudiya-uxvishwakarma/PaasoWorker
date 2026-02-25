@echo off
echo ========================================
echo COMPLETE FIX AND RUN - PaasoWork App
echo ========================================
echo.

REM Step 1: Check device connection
echo [Step 1/12] Checking device connection...
adb devices
echo.
adb devices | find "device" | find /v "List" >nul
if errorlevel 1 (
    echo ❌ ERROR: No device connected!
    echo.
    echo Please:
    echo 1. Connect your phone via USB
    echo 2. Enable USB debugging in Developer Options
    echo 3. Allow USB debugging popup on phone
    echo.
    echo Or start Android emulator from Android Studio
    echo.
    pause
    exit /b 1
)
echo ✅ Device connected!
echo.

REM Step 2: Stop all processes
echo [Step 2/12] Stopping all processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM java.exe 2>nul
taskkill /F /IM gradle.exe 2>nul
cd android
call gradlew --stop 2>nul
cd ..
timeout /t 2 /nobreak >nul
echo ✅ Done
echo.

REM Step 3: Uninstall old app from device
echo [Step 3/12] Uninstalling old app from device...
adb uninstall com.paasowork 2>nul
echo ✅ Done
echo.

REM Step 4: Clean Android build
echo [Step 4/12] Cleaning Android build folders...
cd android
if exist "build" rmdir /s /q build
if exist "app\build" rmdir /s /q app\build
if exist ".gradle" rmdir /s /q .gradle
if exist ".cxx" rmdir /s /q .cxx
if exist "app\.cxx" rmdir /s /q app\.cxx
cd ..
echo ✅ Done
echo.

REM Step 5: Clean Metro cache
echo [Step 5/12] Cleaning Metro bundler cache...
if exist "%LOCALAPPDATA%\Temp\metro-*" (
    for /d %%i in ("%LOCALAPPDATA%\Temp\metro-*") do rmdir /s /q "%%i" 2>nul
)
if exist "%LOCALAPPDATA%\Temp\react-*" (
    for /d %%i in ("%LOCALAPPDATA%\Temp\react-*") do rmdir /s /q "%%i" 2>nul
)
if exist "%LOCALAPPDATA%\Temp\haste-map-*" (
    for /d %%i in ("%LOCALAPPDATA%\Temp\haste-map-*") do rmdir /s /q "%%i" 2>nul
)
echo ✅ Done
echo.

REM Step 6: Check node_modules
echo [Step 6/12] Checking node_modules...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install failed!
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules exists
)
echo.

REM Step 7: Verify React Native
echo [Step 7/12] Verifying React Native installation...
if not exist "node_modules\react-native" (
    echo ❌ react-native not found!
    echo Running npm install...
    call npm install
    if errorlevel 1 (
        pause
        exit /b 1
    )
)
echo ✅ React Native found
echo.

REM Step 8: Clean Gradle cache
echo [Step 8/12] Cleaning Gradle cache...
cd android
call gradlew clean --no-daemon
if errorlevel 1 (
    echo ⚠️  Gradle clean had warnings, continuing...
)
cd ..
echo ✅ Done
echo.

REM Step 9: Clear app data on device
echo [Step 9/12] Clearing app data on device...
adb shell pm clear com.paasowork 2>nul
echo ✅ Done
echo.

REM Step 10: Start Metro bundler in background
echo [Step 10/12] Starting Metro bundler...
start "Metro Bundler" cmd /k "npx react-native start --reset-cache"
echo Waiting for Metro to start...
timeout /t 5 /nobreak >nul
echo ✅ Metro started
echo.

REM Step 11: Build and install app
echo [Step 11/12] Building and installing app on device...
echo This may take 3-5 minutes...
echo.
call npm run android

if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ BUILD FAILED!
    echo ========================================
    echo.
    echo Please check the error above.
    echo.
    echo Common issues:
    echo 1. Device not connected - Check: adb devices
    echo 2. USB debugging not enabled
    echo 3. Java/Android SDK not configured
    echo 4. Port 8081 in use
    echo.
    pause
    exit /b 1
)

REM Step 12: Success
echo.
echo ========================================
echo ✅ SUCCESS! APP IS RUNNING!
echo ========================================
echo.
echo App should now be running on your device!
echo.
echo Metro bundler is running in separate window.
echo Keep that window open.
echo.
echo To reload app:
echo - Shake device or press Ctrl+M
echo - Select "Reload"
echo.
echo To stop Metro:
echo - Close the Metro Bundler window
echo - Or press Ctrl+C in that window
echo.
pause
