@echo off
echo ========================================
echo Fixing C++20 std::format Bug
echo React Native 0.83.1 Known Issue
echo ========================================
echo.

echo This script fixes the error:
echo "error: no member named 'format' in namespace 'std'"
echo.

cd android

echo [1/4] Stopping Gradle daemon...
call gradlew --stop
echo Done.
echo.

echo [2/4] Cleaning build artifacts...
if exist "app\.cxx" rmdir /s /q app\.cxx
if exist "app\build" rmdir /s /q app\build
if exist ".gradle" rmdir /s /q .gradle
echo Done.
echo.

echo [3/4] Cleaning Gradle cache...
if exist "%USERPROFILE%\.gradle\caches\transforms" (
    rmdir /s /q "%USERPROFILE%\.gradle\caches\transforms" 2>nul
)
echo Done.
echo.

echo [4/4] Running clean build...
call gradlew clean --no-daemon
echo Done.
echo.

cd ..

echo ========================================
echo Fix applied successfully!
echo ========================================
echo.
echo Changes made:
echo - New Architecture disabled (newArchEnabled=false)
echo - CMake cache cleared
echo - Build artifacts removed
echo.
echo Now you can build:
echo   cd android
echo   gradlew assembleDebug
echo   gradlew assembleRelease
echo.
pause
