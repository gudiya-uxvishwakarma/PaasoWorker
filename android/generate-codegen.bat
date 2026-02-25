@echo off
echo ========================================
echo Generate Codegen for All Modules
echo ========================================

cd /d "%~dp0"

echo.
echo Generating codegen artifacts for each module...
echo This may take a few minutes...
echo.

echo [1/6] react-native-async-storage...
call gradlew :react-native-async-storage_async-storage:generateCodegenArtifactsFromSchema --no-daemon

echo.
echo [2/6] react-native-google-signin...
call gradlew :react-native-google-signin_google-signin:generateCodegenArtifactsFromSchema --no-daemon

echo.
echo [3/6] react-native-html-to-pdf...
call gradlew :react-native-html-to-pdf:generateCodegenArtifactsFromSchema --no-daemon

echo.
echo [4/6] react-native-image-picker...
call gradlew :react-native-image-picker:generateCodegenArtifactsFromSchema --no-daemon

echo.
echo [5/6] react-native-safe-area-context...
call gradlew :react-native-safe-area-context:generateCodegenArtifactsFromSchema --no-daemon

echo.
echo [6/6] react-native-svg...
call gradlew :react-native-svg:generateCodegenArtifactsFromSchema --no-daemon

echo.
echo ========================================
echo Codegen Generation Complete
echo ========================================
echo.
echo Now you can run: gradlew assembleRelease
echo.
pause
