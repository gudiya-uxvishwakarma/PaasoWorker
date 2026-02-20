@echo off
echo Cleaning Android build folders...

cd /d "%~dp0"

echo Stopping Gradle daemon...
call gradlew --stop

echo Deleting .cxx folder...
if exist "app\.cxx" rmdir /s /q "app\.cxx"

echo Deleting build folders...
if exist "app\build" rmdir /s /q "app\build"
if exist "build" rmdir /s /q "build"
if exist ".gradle" rmdir /s /q ".gradle"

echo Clean complete! Now run: gradlew assembleDebug
pause
