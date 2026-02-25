@echo off
echo ========================================
echo Force Build - Bypassing Clean Issues
echo ========================================

cd /d "%~dp0"

echo.
echo Step 1: Manually removing .cxx directory...
if exist "app\.cxx" (
    rmdir /s /q "app\.cxx"
    echo .cxx removed
)

echo.
echo Step 2: Removing app build directory...
if exist "app\build" (
    rmdir /s /q "app\build"
    echo app\build removed
)

echo.
echo Step 3: Building release APK directly (no clean)...
call gradlew assembleRelease --no-daemon --rerun-tasks

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo SUCCESS! APK Built
    echo ========================================
    echo Location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo File size:
    dir "app\build\outputs\apk\release\app-release.apk" | find "app-release.apk"
) else (
    echo ========================================
    echo Build failed - check errors above
    echo ========================================
)

echo.
pause
