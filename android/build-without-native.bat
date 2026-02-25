@echo off
echo ========================================
echo Building APK without Native Modules First
echo ========================================

cd /d "%~dp0"

echo.
echo Step 1: Building Java/Kotlin modules first...
call gradlew :react-native-async-storage_async-storage:assembleRelease --no-daemon
call gradlew :react-native-google-signin_google-signin:assembleRelease --no-daemon  
call gradlew :react-native-html-to-pdf:assembleRelease --no-daemon
call gradlew :react-native-image-picker:assembleRelease --no-daemon

echo.
echo Step 2: Now building full APK...
call gradlew :app:assembleRelease --no-daemon

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo APK: app\build\outputs\apk\release\app-release.apk
) else (
    echo Build failed
)
pause
