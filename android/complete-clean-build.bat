@echo off
echo ========================================
echo Complete Clean Build - Removing All Cache
echo ========================================

cd /d "%~dp0"

echo.
echo Step 1: Removing .cxx directory...
if exist "app\.cxx" (
    rmdir /s /q "app\.cxx"
    echo [OK] .cxx removed
) else (
    echo [SKIP] .cxx not found
)

echo.
echo Step 2: Removing app build directory...
if exist "app\build" (
    rmdir /s /q "app\build"
    echo [OK] app\build removed
) else (
    echo [SKIP] app\build not found
)

echo.
echo Step 3: Removing .gradle cache...
if exist ".gradle" (
    rmdir /s /q ".gradle"
    echo [OK] .gradle removed
) else (
    echo [SKIP] .gradle not found
)

echo.
echo Step 4: Removing build directory...
if exist "build" (
    rmdir /s /q "build"
    echo [OK] build removed
) else (
    echo [SKIP] build not found
)

echo.
echo Step 5: Removing global gradle cache...
if exist "%USERPROFILE%\.gradle\caches" (
    echo Removing global gradle cache (this may take a moment)...
    rmdir /s /q "%USERPROFILE%\.gradle\caches"
    echo [OK] Global gradle cache removed
) else (
    echo [SKIP] Global gradle cache not found
)

echo.
echo Step 6: Cleaning node_modules build artifacts...
cd ..
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
echo [OK] Node modules build artifacts cleaned

echo.
echo Step 7: Building release APK...
cd android
call gradlew assembleRelease --no-daemon --rerun-tasks

echo.
echo ========================================
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo BUILD SUCCESS!
    echo ========================================
    echo.
    echo APK Location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo File Info:
    dir "app\build\outputs\apk\release\app-release.apk" | find "app-release.apk"
) else (
    echo BUILD FAILED!
    echo ========================================
    echo Check the errors above
)

echo.
pause
