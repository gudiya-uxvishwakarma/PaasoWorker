@echo off
echo ========================================
echo Quick Build Test
echo ========================================
echo.

cd android

echo Testing Gradle configuration...
call gradlew tasks --no-daemon

if errorlevel 1 (
    echo.
    echo ERROR: Gradle configuration failed!
    echo Run fix-build-complete.bat first
    cd ..
    pause
    exit /b 1
)

echo.
echo ========================================
echo Gradle configuration OK!
echo ========================================
echo.
echo Ready to build. Run:
echo   build-release.bat
echo.

cd ..
pause
