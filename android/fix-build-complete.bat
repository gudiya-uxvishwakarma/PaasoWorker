@echo off
echo ========================================
echo React Native Android Build Fix Script
echo React Native 0.83 Compatible
echo ========================================
echo.

REM Step 1: Stop Gradle daemon
echo [1/8] Stopping Gradle daemon...
cd android
call gradlew --stop
cd ..
echo Done.
echo.

REM Step 2: Clean Gradle cache
echo [2/8] Cleaning Gradle cache...
if exist "%USERPROFILE%\.gradle\caches" (
    echo Removing Gradle cache...
    rmdir /s /q "%USERPROFILE%\.gradle\caches"
    echo Gradle cache cleared.
) else (
    echo Gradle cache not found, skipping.
)
echo.

REM Step 3: Clean Android build folders
echo [3/8] Cleaning Android build folders...
cd android
if exist "build" rmdir /s /q build
if exist "app\build" rmdir /s /q app\build
if exist ".gradle" rmdir /s /q .gradle
if exist ".cxx" rmdir /s /q .cxx
if exist "app\.cxx" rmdir /s /q app\.cxx
cd ..
echo Done.
echo.

REM Step 4: Clean React Native cache
echo [4/8] Cleaning React Native cache...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q node_modules
    echo node_modules removed.
)
if exist "package-lock.json" del /f /q package-lock.json
if exist "yarn.lock" del /f /q yarn.lock
echo Done.
echo.

REM Step 5: Clean Metro bundler cache
echo [5/8] Cleaning Metro bundler cache...
if exist "%LOCALAPPDATA%\Temp\metro-*" (
    rmdir /s /q "%LOCALAPPDATA%\Temp\metro-*" 2>nul
)
if exist "%LOCALAPPDATA%\Temp\react-*" (
    rmdir /s /q "%LOCALAPPDATA%\Temp\react-*" 2>nul
)
if exist "%LOCALAPPDATA%\Temp\haste-map-*" (
    rmdir /s /q "%LOCALAPPDATA%\Temp\haste-map-*" 2>nul
)
echo Done.
echo.

REM Step 6: Reinstall dependencies
echo [6/8] Reinstalling npm dependencies...
echo This may take 3-5 minutes...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo Done.
echo.

REM Step 7: Clean Gradle build
echo [7/8] Running Gradle clean...
cd android
call gradlew clean --no-daemon
if errorlevel 1 (
    echo ERROR: Gradle clean failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Done.
echo.

REM Step 8: Verify setup
echo [8/8] Verifying setup...
echo Checking critical files...
if not exist "node_modules\react-native" (
    echo ERROR: react-native not found in node_modules!
    pause
    exit /b 1
)
if not exist "android\app\google-services.json" (
    echo WARNING: google-services.json not found!
    echo Firebase features may not work properly.
)
echo.

echo ========================================
echo Build fix completed successfully!
echo ========================================
echo.
echo Configuration updates:
echo - New Architecture enabled (RN 0.83 default)
echo - Deprecated options removed
echo - Build config properly configured
echo.
echo Next steps:
echo 1. Run: android\build-release.bat
echo 2. APK will be at: android\app\build\outputs\apk\release\app-release.apk
echo.
pause
