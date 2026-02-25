@echo off
echo Fixing React Native build issues...
echo.

cd android

echo Step 1: Cleaning build directories...
call gradlew clean
if errorlevel 1 (
    echo Clean failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Building debug first to generate codegen...
call gradlew assembleDebug
if errorlevel 1 (
    echo Debug build failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Now building release...
call gradlew assembleRelease
if errorlevel 1 (
    echo Release build failed!
    pause
    exit /b 1
)

echo.
echo Build successful!
echo APK location: android\app\build\outputs\apk\release\app-release.apk
pause
