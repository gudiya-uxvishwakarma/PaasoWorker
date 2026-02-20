@echo off
echo ========================================
echo Firebase Status Checker
echo ========================================
echo.

echo [1] Checking google-services.json...
if exist "android\app\google-services.json" (
    echo ✓ google-services.json exists
    echo.
    echo File content preview:
    type android\app\google-services.json | findstr "project_id package_name"
) else (
    echo ✗ google-services.json NOT FOUND!
    echo Location should be: android\app\google-services.json
)

echo.
echo [2] Checking Firebase dependencies in build.gradle...
if exist "android\app\build.gradle" (
    echo ✓ build.gradle exists
    echo.
    echo Firebase dependencies:
    type android\app\build.gradle | findstr "firebase"
) else (
    echo ✗ build.gradle NOT FOUND!
)

echo.
echo [3] Checking package.json for Firebase packages...
if exist "package.json" (
    echo ✓ package.json exists
    echo.
    echo Firebase packages:
    type package.json | findstr "firebase"
) else (
    echo ✗ package.json NOT FOUND!
)

echo.
echo [4] Checking if device is connected...
adb devices
echo.

echo [5] Checking app logs for Firebase errors...
echo Recent Firebase logs:
adb logcat -d | findstr /i "firebase fcm mainApplication" | more
echo.

echo ========================================
echo Status check complete!
echo ========================================
echo.
pause
