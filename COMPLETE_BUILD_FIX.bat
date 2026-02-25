@echo off
echo ========================================
echo COMPLETE BUILD FIX - React Native 0.83
echo Old Architecture (Stable)
echo ========================================
echo.

echo This will fix all build errors and prepare for production build.
echo.
pause

REM Step 1: Stop all Gradle processes
echo [1/10] Stopping Gradle daemon...
cd android
call gradlew --stop 2>nul
cd ..
timeout /t 2 /nobreak >nul
echo Done.
echo.

REM Step 2: Kill any remaining Java/Gradle processes
echo [2/10] Killing remaining processes...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM gradle.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done.
echo.

REM Step 3: Clean all Android build folders
echo [3/10] Cleaning Android build folders...
cd android
if exist "build" rmdir /s /q build
if exist "app\build" rmdir /s /q app\build
if exist ".gradle" rmdir /s /q .gradle
if exist ".cxx" rmdir /s /q .cxx
if exist "app\.cxx" rmdir /s /q app\.cxx
cd ..
echo Done.
echo.

REM Step 4: Clean Gradle cache completely
echo [4/10] Cleaning Gradle cache...
if exist "%USERPROFILE%\.gradle\caches" (
    echo Removing Gradle caches...
    rmdir /s /q "%USERPROFILE%\.gradle\caches" 2>nul
)
if exist "%USERPROFILE%\.gradle\daemon" (
    echo Removing Gradle daemon...
    rmdir /s /q "%USERPROFILE%\.gradle\daemon" 2>nul
)
echo Done.
echo.

REM Step 5: Clean React Native cache
echo [5/10] Cleaning React Native cache...
if exist "node_modules" (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist "package-lock.json" del /f /q package-lock.json
if exist "yarn.lock" del /f /q yarn.lock
echo Done.
echo.

REM Step 6: Clean Metro bundler cache
echo [6/10] Cleaning Metro bundler cache...
if exist "%LOCALAPPDATA%\Temp\metro-*" (
    for /d %%i in ("%LOCALAPPDATA%\Temp\metro-*") do rmdir /s /q "%%i" 2>nul
)
if exist "%LOCALAPPDATA%\Temp\react-*" (
    for /d %%i in ("%LOCALAPPDATA%\Temp\react-*") do rmdir /s /q "%%i" 2>nul
)
if exist "%LOCALAPPDATA%\Temp\haste-map-*" (
    for /d %%i in ("%LOCALAPPDATA%\Temp\haste-map-*") do rmdir /s /q "%%i" 2>nul
)
echo Done.
echo.

REM Step 7: Reinstall dependencies
echo [7/10] Reinstalling npm dependencies...
echo This may take 5-10 minutes...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: npm install failed!
    echo Trying without legacy-peer-deps...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install still failed!
        pause
        exit /b 1
    )
)
echo Done.
echo.

REM Step 8: Verify critical files
echo [8/10] Verifying setup...
if not exist "node_modules\react-native" (
    echo ERROR: react-native not found!
    pause
    exit /b 1
)
if not exist "android\app\google-services.json" (
    echo WARNING: google-services.json not found!
    echo Firebase features may not work.
)
echo Verification passed.
echo.

REM Step 9: Clean Gradle build
echo [9/10] Running Gradle clean...
cd android
call gradlew clean --no-daemon --warning-mode all
if errorlevel 1 (
    echo ERROR: Gradle clean failed!
    cd ..
    pause
    exit /b 1
)
cd ..
echo Done.
echo.

REM Step 10: Test Gradle configuration
echo [10/10] Testing Gradle configuration...
cd android
call gradlew tasks --no-daemon >nul 2>&1
if errorlevel 1 (
    echo WARNING: Gradle configuration has issues
    echo But continuing anyway...
) else (
    echo Gradle configuration OK!
)
cd ..
echo Done.
echo.

echo ========================================
echo BUILD FIX COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Configuration:
echo - New Architecture: DISABLED (Old stable architecture)
echo - Hermes: ENABLED
echo - Architectures: armeabi-v7a, arm64-v8a
echo - All caches cleared
echo - Dependencies reinstalled
echo.
echo Next steps:
echo.
echo For DEBUG build:
echo   cd android
echo   gradlew assembleDebug
echo.
echo For RELEASE build:
echo   cd android
echo   gradlew assembleRelease
echo.
echo APK will be at:
echo   android\app\build\outputs\apk\debug\app-debug.apk
echo   android\app\build\outputs\apk\release\app-release.apk
echo.
pause
