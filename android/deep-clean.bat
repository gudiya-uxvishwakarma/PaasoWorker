@echo off
echo Deep cleaning Android build...
echo.

cd /d "%~dp0"

echo Stopping Gradle daemon...
call gradlew --stop

echo.
echo Deleting .cxx cache...
if exist "app\.cxx" (
    rmdir /s /q "app\.cxx"
    echo Deleted app\.cxx
)

echo.
echo Deleting build directories...
if exist "build" (
    rmdir /s /q "build"
    echo Deleted android\build
)
if exist "app\build" (
    rmdir /s /q "app\build"
    echo Deleted app\build
)

echo.
echo Deleting .gradle cache...
if exist ".gradle" (
    rmdir /s /q ".gradle"
    echo Deleted .gradle
)

echo.
echo Cleaning node_modules build artifacts...
cd ..
if exist "node_modules\@react-native-async-storage\async-storage\android\build" (
    rmdir /s /q "node_modules\@react-native-async-storage\async-storage\android\build"
)
if exist "node_modules\@react-native-google-signin\google-signin\android\build" (
    rmdir /s /q "node_modules\@react-native-google-signin\google-signin\android\build"
)
if exist "node_modules\react-native-html-to-pdf\android\build" (
    rmdir /s /q "node_modules\react-native-html-to-pdf\android\build"
)
if exist "node_modules\react-native-image-picker\android\build" (
    rmdir /s /q "node_modules\react-native-image-picker\android\build"
)

echo.
echo Deep clean complete!
echo Now run: gradlew assembleDebug
pause
