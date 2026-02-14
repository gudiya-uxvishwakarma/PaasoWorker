@echo off
echo ========================================
echo  PaasoWork - Fresh Start
echo ========================================
echo.

echo [1/4] Clearing Metro cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache 2>nul
if exist .metro-* del /f /q .metro-* 2>nul
echo ✓ Metro cache cleared

echo.
echo [2/4] Clearing temp cache...
if exist %TEMP%\metro-* rmdir /s /q %TEMP%\metro-* 2>nul
if exist %TEMP%\react-* rmdir /s /q %TEMP%\react-* 2>nul
echo ✓ Temp cache cleared

echo.
echo [3/4] Verifying config...
node verify-config.js
if errorlevel 1 (
    echo ✗ Config verification failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Starting Metro bundler...
echo.
echo ========================================
echo  Metro is starting with clean cache
echo  Press Ctrl+C to stop
echo ========================================
echo.

npx react-native start --reset-cache
