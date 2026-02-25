@echo off
echo ========================================
echo Fixing Metro Bundler Cache Issue
echo ========================================

cd /d "%~dp0"

echo.
echo Step 1: Stopping Metro...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo Step 2: Clearing watchman cache...
call watchman watch-del-all 2>nul

echo.
echo Step 3: Deleting Metro cache...
rmdir /s /q %TEMP%\metro-* 2>nul
rmdir /s /q %TEMP%\haste-map-* 2>nul

echo.
echo Step 4: Clearing npm cache...
call npm cache clean --force

echo.
echo Step 5: Restarting Metro with reset cache...
start cmd /k "npx react-native start --reset-cache"

echo.
echo ========================================
echo Done! Metro is restarting with clean cache
echo Wait for Metro to load, then run: npm run android
echo ========================================
pause
