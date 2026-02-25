# Release Build Guide - CMake Codegen Issue Fix

## Problem
CMake is failing because it can't find codegen directories for React Native modules:
- `@react-native-async-storage/async-storage`
- `@react-native-google-signin/google-signin`
- `react-native-html-to-pdf`
- `react-native-image-picker`

## Solutions (Try in order)

### Solution 1: Use the Fix Script (RECOMMENDED)
```bash
cd android
fix-and-build-release.bat
```

This script:
1. Cleans the build
2. Prebuilds all native modules to generate codegen
3. Generates codegen artifacts
4. Builds the release APK

### Solution 2: Build Bundle Instead of APK
```bash
cd android
build-release-simple.bat
```

This creates an AAB (Android App Bundle) which is what you need for Play Store anyway.

### Solution 3: Manual Steps
```bash
cd android

# Clean
gradlew clean

# Generate codegen for each module
gradlew :react-native-async-storage_async-storage:generateCodegenArtifactsFromSchema
gradlew :react-native-google-signin_google-signin:generateCodegenArtifactsFromSchema
gradlew :react-native-html-to-pdf:generateCodegenArtifactsFromSchema
gradlew :react-native-image-picker:generateCodegenArtifactsFromSchema

# Build release
gradlew assembleRelease
```

### Solution 4: Build Debug for Testing
If release keeps failing, use debug build for testing:
```bash
cd android
gradlew assembleDebug
```

The debug APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

## Why This Happens
React Native 0.76+ uses the New Architecture by default, which requires codegen to be generated before native compilation. The codegen directories are created during the prebuild phase, but sometimes Gradle doesn't run this phase automatically for all modules.

## Quick Test
To test if the app works without building:
```bash
cd android
gradlew installDebug
```

This installs directly to a connected device/emulator.
