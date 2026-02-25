@echo off
echo ========================================
echo Pre-generating Codegen for Native Modules
echo ========================================

cd /d "%~dp0.."

echo.
echo Step 1: Generating codegen for async-storage...
call gradlew :react-native-async-storage_async-storage:generateCodegenArtifactsFromSchema

echo.
echo Step 2: Generating codegen for google-signin...
call gradlew :react-native-google-signin_google-signin:generateCodegenArtifactsFromSchema

echo.
echo Step 3: Generating codegen for html-to-pdf...
call gradlew :react-native-html-to-pdf:generateCodegenArtifactsFromSchema

echo.
echo Step 4: Generating codegen for image-picker...
call gradlew :react-native-image-picker:generateCodegenArtifactsFromSchema

echo.
echo Step 5: Now building release APK...
cd android
call gradlew assembleRelease --no-daemon

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
