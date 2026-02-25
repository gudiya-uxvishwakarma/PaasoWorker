@echo off
echo ========================================
echo Build Setup Verification
echo ========================================
echo.

set ERROR_COUNT=0

REM Check Node.js
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found!
    set /a ERROR_COUNT+=1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js: %NODE_VERSION%
)
echo.

REM Check Java
echo [2/7] Checking Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java not found!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ Java installed
    java -version 2>&1 | findstr /i "version"
)
echo.

REM Check Android SDK
echo [3/7] Checking Android SDK...
if not defined ANDROID_HOME (
    echo ❌ ANDROID_HOME not set!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ ANDROID_HOME: %ANDROID_HOME%
)
echo.

REM Check node_modules
echo [4/7] Checking node_modules...
if not exist "node_modules" (
    echo ❌ node_modules not found! Run: npm install
    set /a ERROR_COUNT+=1
) else (
    echo ✅ node_modules exists
)
echo.

REM Check React Native
echo [5/7] Checking React Native...
if not exist "node_modules\react-native" (
    echo ❌ react-native not found in node_modules!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ react-native installed
)
echo.

REM Check google-services.json
echo [6/7] Checking Firebase configuration...
if not exist "android\app\google-services.json" (
    echo ⚠️  WARNING: google-services.json not found!
    echo    Firebase features may not work
) else (
    echo ✅ google-services.json exists
)
echo.

REM Check Gradle wrapper
echo [7/7] Checking Gradle wrapper...
if not exist "android\gradlew.bat" (
    echo ❌ Gradle wrapper not found!
    set /a ERROR_COUNT+=1
) else (
    echo ✅ Gradle wrapper exists
)
echo.

echo ========================================
if %ERROR_COUNT% EQU 0 (
    echo ✅ All checks passed!
    echo.
    echo Ready to build. Run:
    echo   android\fix-build-complete.bat
    echo   android\build-release.bat
) else (
    echo ❌ %ERROR_COUNT% error(s) found!
    echo.
    echo Please fix the errors above before building.
)
echo ========================================
echo.
pause
