@echo off
echo ========================================
echo Testing React Native Setup
echo ========================================
echo.

set ERROR_COUNT=0

REM Test 1: Node.js
echo [1/8] Testing Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ FAILED: Node.js not found!
    set /a ERROR_COUNT+=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ PASSED: Node.js %NODE_VERSION%
)
echo.

REM Test 2: Java
echo [2/8] Testing Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ FAILED: Java not found!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ PASSED: Java installed
)
echo.

REM Test 3: Android SDK
echo [3/8] Testing Android SDK...
if not defined ANDROID_HOME (
    echo ❌ FAILED: ANDROID_HOME not set!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ PASSED: ANDROID_HOME = %ANDROID_HOME%
)
echo.

REM Test 4: ADB
echo [4/8] Testing ADB...
adb version >nul 2>&1
if errorlevel 1 (
    echo ❌ FAILED: ADB not found!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ PASSED: ADB available
)
echo.

REM Test 5: Device connection
echo [5/8] Testing device connection...
adb devices | find "device" | find /v "List" >nul
if errorlevel 1 (
    echo ⚠️  WARNING: No device connected
    echo    Connect device or start emulator
) else (
    echo ✅ PASSED: Device connected
)
echo.

REM Test 6: node_modules
echo [6/8] Testing node_modules...
if not exist "node_modules" (
    echo ❌ FAILED: node_modules not found!
    echo    Run: npm install
    set /a ERROR_COUNT+=1
) else (
    echo ✅ PASSED: node_modules exists
)
echo.

REM Test 7: React Native
echo [7/8] Testing React Native...
if not exist "node_modules\react-native" (
    echo ❌ FAILED: react-native not found!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ PASSED: react-native installed
)
echo.

REM Test 8: Gradle
echo [8/8] Testing Gradle...
if not exist "android\gradlew.bat" (
    echo ❌ FAILED: Gradle wrapper not found!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ PASSED: Gradle wrapper exists
)
echo.

REM Test 9: Configuration
echo [9/9] Testing configuration...
findstr /C:"newArchEnabled=false" android\gradle.properties >nul
if errorlevel 1 (
    echo ⚠️  WARNING: newArchEnabled not set to false
    echo    C++ build may fail
) else (
    echo ✅ PASSED: New Architecture disabled (C++ build disabled)
)
echo.

echo ========================================
if %ERROR_COUNT% EQU 0 (
    echo ✅ ALL TESTS PASSED!
    echo.
    echo Your setup is ready!
    echo.
    echo To run app:
    echo   RUN_APP.bat
    echo.
    echo Or manually:
    echo   npx react-native run-android
) else (
    echo ❌ %ERROR_COUNT% TEST(S) FAILED!
    echo.
    echo Please fix the errors above before running the app.
    echo.
    echo Common fixes:
    echo - Install Node.js: https://nodejs.org/
    echo - Install Java JDK 17
    echo - Set ANDROID_HOME environment variable
    echo - Run: npm install
)
echo ========================================
echo.
pause
