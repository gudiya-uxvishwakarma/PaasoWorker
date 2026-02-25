@echo off
echo ========================================
echo Build Release APK (Skip CMake if possible)
echo ========================================

cd /d "%~dp0"

echo.
echo This will try to build by skipping native build tasks...
echo.

echo Step 1: Clean...
call gradlew clean --no-daemon

echo.
echo Step 2: Build release APK (excluding native tasks)...
call gradlew assembleRelease -x configureCMakeDebug -x configureCMakeRelWithDebInfo -x buildCMakeDebug -x buildCMakeRelWithDebInfo --no-daemon

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo APK: app\build\outputs\apk\release\app-release.apk
) else (
    echo Build failed or APK not found
    echo.
    echo Trying alternative: Build debug and use that instead...
    call gradlew assembleDebug --no-daemon
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        echo.
        echo Debug APK created: app\build\outputs\apk\debug\app-debug.apk
        echo You can use this for testing
    )
)
pause
