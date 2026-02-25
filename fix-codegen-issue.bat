@echo off
echo ========================================
echo Creating Missing Codegen Directories
echo ========================================

cd /d "%~dp0"

echo Creating codegen directories...

mkdir "node_modules\@react-native-async-storage\async-storage\android\build\generated\source\codegen\jni" 2>nul
mkdir "node_modules\@react-native-google-signin\google-signin\android\build\generated\source\codegen\jni" 2>nul
mkdir "node_modules\react-native-html-to-pdf\android\build\generated\source\codegen\jni" 2>nul
mkdir "node_modules\react-native-image-picker\android\build\generated\source\codegen\jni" 2>nul

echo.
echo Creating placeholder CMakeLists.txt files...

echo cmake_minimum_required(VERSION 3.13) > "node_modules\@react-native-async-storage\async-storage\android\build\generated\source\codegen\jni\CMakeLists.txt"
echo add_library(react_codegen_rnasyncstorage INTERFACE) >> "node_modules\@react-native-async-storage\async-storage\android\build\generated\source\codegen\jni\CMakeLists.txt"

echo cmake_minimum_required(VERSION 3.13) > "node_modules\@react-native-google-signin\google-signin\android\build\generated\source\codegen\jni\CMakeLists.txt"
echo add_library(react_codegen_RNGoogleSignInCGen INTERFACE) >> "node_modules\@react-native-google-signin\google-signin\android\build\generated\source\codegen\jni\CMakeLists.txt"

echo cmake_minimum_required(VERSION 3.13) > "node_modules\react-native-html-to-pdf\android\build\generated\source\codegen\jni\CMakeLists.txt"
echo add_library(react_codegen_HtmlToPdfSpec INTERFACE) >> "node_modules\react-native-html-to-pdf\android\build\generated\source\codegen\jni\CMakeLists.txt"

echo cmake_minimum_required(VERSION 3.13) > "node_modules\react-native-image-picker\android\build\generated\source\codegen\jni\CMakeLists.txt"
echo add_library(react_codegen_RNImagePickerSpec INTERFACE) >> "node_modules\react-native-image-picker\android\build\generated\source\codegen\jni\CMakeLists.txt"

echo [OK] Placeholder files created

echo.
echo Now building APK...
cd android
call gradlew assembleRelease --no-daemon

echo.
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo ========================================
    echo BUILD SUCCESS!
    echo ========================================
    echo APK: app\build\outputs\apk\release\app-release.apk
    dir "app\build\outputs\apk\release\app-release.apk" | find "app-release"
) else (
    echo BUILD FAILED
)
pause
