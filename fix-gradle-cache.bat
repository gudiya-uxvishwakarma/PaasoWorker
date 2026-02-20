@echo off
echo ========================================
echo Fixing Gradle Cache Corruption
echo ========================================

echo.
echo Step 1: Stopping all Gradle daemons...
cd /d "%~dp0\android"
call gradlew --stop

echo.
echo Step 2: Deleting corrupted Gradle cache...
cd /d "%USERPROFILE%\.gradle"
if exist "caches\9.0.0\kotlin-dsl" (
    echo Deleting kotlin-dsl cache...
    rmdir /s /q "caches\9.0.0\kotlin-dsl"
)

echo.
echo Step 3: Deleting project build folders...
cd /d "%~dp0\android"
if exist ".gradle" rmdir /s /q ".gradle"
if exist "app\.cxx" rmdir /s /q "app\.cxx"
if exist "app\build" rmdir /s /q "app\build"
if exist "build" rmdir /s /q "build"

echo.
echo Step 4: Cleaning node_modules build artifacts...
cd /d "%~dp0"
if exist "node_modules\react-native\android\build" rmdir /s /q "node_modules\react-native\android\build"

echo.
echo ========================================
echo Cache cleanup complete!
echo ========================================
echo.
echo Now run: npx react-native run-android
echo.
pause
