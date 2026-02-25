@echo off
echo ========================================
echo Building Release APK for PaasoWork
echo ========================================
echo.

cd /d "%~dp0"

echo [1/5] Cleaning previous builds...
call gradlew clean
if errorlevel 1 (
    echo ERROR: Clean failed!
    pause
    exit /b 1
)
echo.

echo [2/5] Checking google-services.json...
if not exist "app\google-services.json" (
    echo ERROR: google-services.json not found!
    echo Please add it to android/app/ folder
    pause
    exit /b 1
)
echo google-services.json found!
echo.

echo [3/5] Building Release APK...
echo This may take 5-10 minutes...
call gradlew assembleRelease
if errorlevel 1 (
    echo ERROR: Build failed!
    echo.
    echo Common fixes:
    echo 1. Run: gradlew clean
    echo 2. Delete android/.gradle folder
    echo 3. Check proguard-rules.pro
    pause
    exit /b 1
)
echo.

echo [4/5] Locating APK...
set APK_PATH=app\build\outputs\apk\release\app-release.apk
if exist "%APK_PATH%" (
    echo SUCCESS! APK built successfully!
    echo.
    echo APK Location: %APK_PATH%
    echo.
    
    echo [5/5] Copying APK to root folder...
    copy "%APK_PATH%" "..\..\PaasoWork-release.apk"
    if errorlevel 1 (
        echo Warning: Could not copy APK to root
    ) else (
        echo APK copied to: PaasoWork-release.apk
    )
) else (
    echo ERROR: APK not found at expected location!
    echo Expected: %APK_PATH%
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo To install on device:
echo adb install -r app\build\outputs\apk\release\app-release.apk
echo.
pause
