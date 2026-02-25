@echo off
echo ========================================
echo Quick Fix for Codegen Build Issues
echo ========================================

cd /d "%~dp0.."

echo.
echo Cleaning specific directories...

if exist "android\app\.cxx" rmdir /s /q "android\app\.cxx"
if exist "android\app\build" rmdir /s /q "android\app\build"

echo Cleaning module build directories...
for /d %%i in (node_modules\*) do (
    if exist "%%i\android\build" rmdir /s /q "%%i\android\build"
)

echo.
echo Starting build...
cd android
call gradlew assembleRelease --no-daemon

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo SUCCESS! APK Built
    echo ========================================
    echo Location: android\app\build\outputs\apk\release\app-release.apk
) else (
    echo ========================================
    echo Build failed - check errors above
    echo ========================================
)
pause
