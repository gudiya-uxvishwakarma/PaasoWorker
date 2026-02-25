@echo off
echo ========================================
echo Building Android APK
echo ========================================
echo.

echo Select build type:
echo 1. Debug APK (faster, for testing)
echo 2. Release APK (optimized, for production)
echo.
set /p choice="Enter choice (1 or 2): "

cd android

if "%choice%"=="1" (
    echo.
    echo Building DEBUG APK...
    echo.
    call gradlew assembleDebug --no-daemon --warning-mode all
    
    if errorlevel 1 (
        echo.
        echo ========================================
        echo BUILD FAILED!
        echo ========================================
        echo.
        echo Try running: COMPLETE_BUILD_FIX.bat
        cd ..
        pause
        exit /b 1
    )
    
    echo.
    echo ========================================
    echo DEBUG APK BUILT SUCCESSFULLY!
    echo ========================================
    echo.
    echo APK Location:
    echo %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    
    if exist "app\build\outputs\apk\debug\app-debug.apk" (
        echo APK Size:
        dir "app\build\outputs\apk\debug\app-debug.apk" | find "app-debug.apk"
        echo.
        echo To install:
        echo adb install app\build\outputs\apk\debug\app-debug.apk
    )
    
) else if "%choice%"=="2" (
    echo.
    echo Building RELEASE APK...
    echo.
    call gradlew assembleRelease --no-daemon --warning-mode all
    
    if errorlevel 1 (
        echo.
        echo ========================================
        echo BUILD FAILED!
        echo ========================================
        echo.
        echo Try running: COMPLETE_BUILD_FIX.bat
        cd ..
        pause
        exit /b 1
    )
    
    echo.
    echo ========================================
    echo RELEASE APK BUILT SUCCESSFULLY!
    echo ========================================
    echo.
    echo APK Location:
    echo %CD%\app\build\outputs\apk\release\app-release.apk
    echo.
    
    if exist "app\build\outputs\apk\release\app-release.apk" (
        echo APK Size:
        dir "app\build\outputs\apk\release\app-release.apk" | find "app-release.apk"
        echo.
        echo To install:
        echo adb install app\build\outputs\apk\release\app-release.apk
    )
    
) else (
    echo Invalid choice!
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
pause
