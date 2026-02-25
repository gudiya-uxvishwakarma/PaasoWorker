@echo off
echo ========================================
echo Fix Codegen and Build Release APK
echo ========================================

cd /d "%~dp0"

echo.
echo Step 1: Clean build directories...
call gradlew clean --no-daemon
if errorlevel 1 goto error

echo.
echo Step 2: Prebuild all native modules...
call gradlew :react-native-async-storage_async-storage:preBuild --no-daemon
call gradlew :react-native-google-signin_google-signin:preBuild --no-daemon
call gradlew :react-native-html-to-pdf:preBuild --no-daemon
call gradlew :react-native-image-picker:preBuild --no-daemon
call gradlew :react-native-safe-area-context:preBuild --no-daemon
call gradlew :react-native-svg:preBuild --no-daemon

echo.
echo Step 3: Generate codegen artifacts...
call gradlew generateCodegenArtifactsFromSchema --no-daemon
if errorlevel 1 (
    echo Codegen generation failed, continuing anyway...
)

echo.
echo Step 4: Build app module...
call gradlew :app:assembleRelease --no-daemon
if errorlevel 1 goto error

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo APK Location: app\build\outputs\apk\release\app-release.apk
    echo.
    echo File size:
    dir "app\build\outputs\apk\release\app-release.apk" | find "app-release.apk"
) else (
    echo Build completed but APK not found at expected location
    echo Searching for APK...
    dir /s /b app\build\outputs\*.apk
)
goto end

:error
echo.
echo ========================================
echo BUILD FAILED
echo ========================================
echo Check the error messages above

:end
pause
