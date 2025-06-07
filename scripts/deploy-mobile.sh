
#!/bin/bash

echo "Building Mia Healthcare Mobile App..."

# Build the web app
npm run build

# Sync with Capacitor
npx cap sync

echo "Mobile app build complete!"
echo ""
echo "To run on Android: npx cap run android"
echo "To run on iOS: npx cap run ios"
echo ""
echo "To build for production:"
echo "Android: npx cap build android"
echo "iOS: npx cap build ios"
