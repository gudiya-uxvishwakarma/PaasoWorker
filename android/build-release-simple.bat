@echo off
echo ========================================
echo Simple Release Build (Alternative Method)
echo ========================================

cd /d "%~dp0"

echo.
echo Cleaning previous builds...
call gradlew clean --no-daemon

echo.
echo Building release bundle (AAB)...
call gradlew bundleRelease --no-daemon

echo.
if exist "app\build\outputs\bundle\release\app-release.aab" (
    echo ========================================
    echo SUCCESS! Bundle created
    echo ========================================
    echo AAB: app\build\outputs\bundle\release\app-release.aab
    echo.
    echo Note: AAB files are for Play Store upload
    echo To test locally, use: gradlew installRelease
) else (
    echo Build failed - check errors above
)
pause
