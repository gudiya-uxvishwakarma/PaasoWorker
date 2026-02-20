@echo off
echo ========================================
echo Firebase Setup Verification
echo ========================================
echo.

echo Checking Firebase configuration files...
echo.

echo [1] Checking google-services.json...
if exist "PaasoWork\android\app\google-services.json" (
    echo ✅ google-services.json found
    findstr "project_id" PaasoWork\android\app\google-services.json
) else (
    echo ❌ google-services.json NOT FOUND
    echo Please download from Firebase Console
)
echo.

echo [2] Checking build.gradle configuration...
findstr "com.google.gms.google-services" PaasoWork\android\app\build.gradle >nul 2>&1
if errorlevel 1 (
    echo ❌ Google Services plugin NOT configured
) else (
    echo ✅ Google Services plugin configured
)
echo.

echo [3] Checking Firebase dependencies...
findstr "firebase-bom" PaasoWork\android\app\build.gradle >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase dependencies NOT found
) else (
    echo ✅ Firebase dependencies configured
)
echo.

echo [4] Checking AndroidManifest.xml...
findstr "MyFirebaseMessagingService" PaasoWork\android\app\src\main\AndroidManifest.xml >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase Messaging Service NOT configured
) else (
    echo ✅ Firebase Messaging Service configured
)
echo.

echo [5] Checking MainApplication.kt...
findstr "FirebaseApp.initializeApp" PaasoWork\android\app\src\main\java\com\paasowork\MainApplication.kt >nul 2>&1
if errorlevel 1 (
    echo ❌ Firebase initialization NOT found
) else (
    echo ✅ Firebase initialization configured
)
echo.

echo ========================================
echo Verification Complete
echo ========================================
echo.
echo To rebuild with Firebase:
echo   cd PaasoWork\android
echo   rebuild-firebase.bat
echo.
echo To check logs:
echo   adb logcat -s MainApplication:D FCMService:D ReactNativeJS:D
echo.
pause
