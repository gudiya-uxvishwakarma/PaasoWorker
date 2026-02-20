@echo off
echo Starting React Native Android build...
cd /d "%~dp0"
call npx react-native run-android
pause
