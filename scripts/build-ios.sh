
#!/bin/bash

echo "Building Mia Healthcare iOS App for Production..."

# Exit on any error
set -e

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ Error: iOS builds require macOS"
    echo "Please run this script on a Mac with Xcode installed"
    exit 1
fi

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist
rm -rf ios/App/build

# Build the web app for production
echo "Building web app..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync ios

# Build iOS app
echo "Building iOS app..."
npx cap build ios

echo ""
echo "✅ iOS build complete!"
echo ""
echo "Next steps:"
echo "1. Open ios/App/App.xcworkspace in Xcode"
echo "2. Select your development team"
echo "3. Archive and distribute the app"
echo ""
