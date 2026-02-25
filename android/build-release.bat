@echo off
echo ========================================
echo Building Release APK
echo ========================================
echo.

cd android

echo [1/2] Building release APK...
call gradlew assembleRelease --no-daemon --warning-mode all

if errorlevel 1 (
    echo.
    echo ========================================
    echo ERROR: Build failed!
    echo ========================================
    echo.
    echo Common fixes:
    echo 1. Run fix-build-complete.bat first
    echo 2. Check Java version: java -version
    echo 3. Check Android SDK installation
    echo 4. Check gradle.properties settings
    echo.
    cd ..
    pause
    exit /b 1
)

echo.
echo [2/2] Checking APK...
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo ========================================
    echo SUCCESS! APK built successfully!
    echo ========================================
    echo.
    echo APK Location:
    echo %CD%\app\build\outputs\apk\release\app-release.apk
    echo.
    echo APK Size:
    dir "app\build\outputs\apk\release\app-release.apk" | find "app-release.apk"
    echo.
    echo To install on device:
    echo adb install app\build\outputs\apk\release\app-release.apk
    echo.
) else (
    echo ERROR: APK not found at expected location!
)

cd ..
pause
