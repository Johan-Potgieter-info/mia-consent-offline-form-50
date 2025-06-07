
@echo off
echo Setting up Mia Healthcare Mobile Development Environment...

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Failed to install dependencies!
    pause
    exit /b 1
)

:: Build the web app first
echo Building web app...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

:: Add Android platform
echo Adding Android platform...
call npx cap add android
if %ERRORLEVEL% neq 0 (
    echo Note: Android platform may already exist
)

:: Sync with Capacitor
echo Syncing with Capacitor...
call npx cap sync
if %ERRORLEVEL% neq 0 (
    echo Sync failed!
    pause
    exit /b 1
)

echo.
echo ✅ Mobile development environment setup complete!
echo.
echo Next steps:
echo - For Android: npx cap run android
echo.
echo To build for production:
echo - Android: scripts\build-android.bat
echo.
echo Note: iOS development requires macOS with Xcode
echo.
pause
