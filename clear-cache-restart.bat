@echo off
echo ========================================
echo Clearing Metro Bundler Cache
echo ========================================

echo.
echo Step 1: Stopping any running Metro processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Clearing Metro cache...
cd /d "%~dp0"
call npx react-native start --reset-cache

echo.
echo ========================================
echo Cache cleared and Metro restarted!
echo ========================================
pause
