
@echo off
echo Building Mia Healthcare Android App for Production...

:: Clean previous builds
echo Cleaning previous builds...
rmdir /s /q dist 2>nul
rmdir /s /q android\app\build 2>nul

:: Build the web app for production
echo Building web app...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

:: Sync with Capacitor
echo Syncing with Capacitor...
call npx cap sync android
if %ERRORLEVEL% neq 0 (
    echo Sync failed!
    pause
    exit /b 1
)

:: Build Android APK
echo Building Android APK...
cd android
call gradlew assembleRelease
if %ERRORLEVEL% neq 0 (
    echo Android build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Android build complete!
echo.
echo APK location: android\app\build\outputs\apk\release\app-release.apk
echo.
echo Next steps:
echo 1. Test the APK on Android devices
echo 2. Distribute via Google Drive or email
echo 3. Install on staff devices
echo.
pause
