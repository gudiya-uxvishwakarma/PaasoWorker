@echo off
echo ========================================
echo Fixing React Native Codegen Issues
echo ========================================

cd /d "%~dp0.."

echo.
echo Step 1: Cleaning build artifacts...
cd android
call gradlew clean
cd ..

echo.
echo Step 2: Removing .cxx directory...
if exist "android\app\.cxx" (
    rmdir /s /q "android\app\.cxx"
    echo .cxx directory removed
)

echo.
echo Step 3: Removing build directories...
if exist "android\app\build" (
    rmdir /s /q "android\app\build"
    echo Build directory removed
)

echo.
echo Step 4: Removing codegen from node_modules...
if exist "node_modules\@react-native-async-storage\async-storage\android\build" (
    rmdir /s /q "node_modules\@react-native-async-storage\async-storage\android\build"
)
if exist "node_modules\@react-native-google-signin\google-signin\android\build" (
    rmdir /s /q "node_modules\@react-native-google-signin\google-signin\android\build"
)
if exist "node_modules\react-native-html-to-pdf\android\build" (
    rmdir /s /q "node_modules\react-native-html-to-pdf\android\build"
)
if exist "node_modules\react-native-image-picker\android\build" (
    rmdir /s /q "node_modules\react-native-image-picker\android\build"
)
echo Module build directories cleaned

echo.
echo Step 5: Clearing gradle cache...
if exist "%USERPROFILE%\.gradle\caches" (
    rmdir /s /q "%USERPROFILE%\.gradle\caches"
    echo Gradle cache cleared
)

echo.
echo Step 6: Building release APK (this will generate codegen)...
cd android
call gradlew assembleRelease --no-daemon --stacktrace

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo APK location: android\app\build\outputs\apk\release\app-release.apk
pause
