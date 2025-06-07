
#!/bin/bash

echo "Building Mia Healthcare Android App for Production..."

# Exit on any error
set -e

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist
rm -rf android/app/build

# Build the web app for production
echo "Building web app..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Build Android APK
echo "Building Android APK..."
cd android
./gradlew assembleRelease

echo ""
echo "✅ Android build complete!"
echo ""
echo "APK location: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "Next steps:"
echo "1. Test the APK on Android devices"
echo "2. Distribute via Google Drive or email"
echo "3. Install on staff devices using: adb install app-release.apk"
echo ""
