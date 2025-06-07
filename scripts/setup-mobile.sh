
#!/bin/bash

echo "Setting up Mia Healthcare Mobile Development Environment..."

# Exit on any error
set -e

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the web app first
echo "Building web app..."
npm run build

# Add platforms
echo "Adding mobile platforms..."

# Add Android platform
if ! npx cap ls | grep -q android; then
    echo "Adding Android platform..."
    npx cap add android
else
    echo "Android platform already exists"
fi

# Add iOS platform (only on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if ! npx cap ls | grep -q ios; then
        echo "Adding iOS platform..."
        npx cap add ios
    else
        echo "iOS platform already exists"
    fi
else
    echo "Skipping iOS setup (requires macOS)"
fi

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync

echo ""
echo "✅ Mobile development environment setup complete!"
echo ""
echo "Next steps:"
echo "- For Android: npx cap run android"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "- For iOS: npx cap run ios"
fi
echo ""
echo "To build for production:"
echo "- Android: ./scripts/build-android.sh"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "- iOS: ./scripts/build-ios.sh"
fi
echo ""
