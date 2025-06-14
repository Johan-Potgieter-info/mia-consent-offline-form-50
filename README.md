
# Mia Healthcare - Dental Consent Form PWA

A Progressive Web Application (PWA) for offline dental consent form capture, designed for Mia Healthcare.

**Owner:** Mia Healthcare  
**Developer:** Johan Potgieter

## Features

- **Offline-First Design**: Forms work completely offline with automatic sync when online
- **Progressive Web App**: Installable on desktop and mobile devices
- **Region-Aware**: Automatically detects user location for compliance requirements
- **Draft Management**: Save and resume incomplete forms
- **Hybrid Storage**: Local storage with cloud backup for completed forms
- **Mobile Optimized**: Touch-friendly interface for tablets and smartphones

## PWA Installation

### Desktop Installation
1. Open the app in Chrome, Edge, or other modern browser
2. Look for the "Install" button in the address bar
3. Click "Install" to add the app to your desktop
4. The app will use the Mia Healthcare logo as the desktop icon

### Mobile Installation
1. Open the app in mobile browser (Chrome/Safari)
2. Tap the browser menu
3. Select "Add to Home Screen" or "Install App"
4. The app icon will appear on your home screen

## Technical Specifications

### Technologies Used
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (cloud) with IndexedDB (local fallback)
- **State Management**: TanStack Query
- **PWA Features**: Service Worker with advanced caching
- **Mobile Support**: Capacitor for native mobile apps

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Local Development
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Building for Production
```bash
# Build the PWA
npm run build

# Preview the production build
npm run preview
```

## PWA Deployment

### Web Deployment
The built PWA can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

### Mobile App Deployment (Optional)
For native mobile apps using Capacitor:

```bash
# Build web app first
npm run build

# Sync with mobile platforms
npx cap sync

# Run on Android
npx cap run android

# Run on iOS (macOS with Xcode required)
npx cap run ios
```

## PWA Manifest Configuration

The app includes a comprehensive PWA manifest with:
- **App Name**: "Mia Healthcare Consent Form"
- **Short Name**: "Mia"
- **Theme Color**: #ef4805 (Mia orange)
- **Display Mode**: Standalone (app-like experience)
- **Icons**: Multiple sizes using Mia Healthcare logo
- **Offline Support**: Full functionality without internet

## Service Worker Features

- **Cache-First Strategy**: Static resources cached for instant loading
- **Background Sync**: Automatic form submission when connection restored
- **Update Management**: Seamless app updates
- **Offline Fallbacks**: Graceful degradation when offline

## Data Management

### Storage Strategy
- **Drafts**: Stored locally (IndexedDB) for privacy
- **Completed Forms**: Synced to cloud database (Supabase)
- **Hybrid Approach**: Works offline, syncs when online

### Data Privacy
- Forms stored locally until completion
- Encrypted transmission to cloud
- Compliant with healthcare data requirements

## Configuration

### Environment Variables
Create a `.env` file for production deployment:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### Region Detection
The app automatically detects user region for compliance but can be manually overridden.

## Support and Maintenance

### Developer Contact
**Johan Potgieter**  
Developer and Technical Lead

### Issue Reporting
For technical issues or feature requests, contact the developer directly.

### Updates
The PWA automatically updates when new versions are deployed. Users will be notified of available updates.

## License

Proprietary software owned by Mia Healthcare.  
Developed by Johan Potgieter.

---

*This Progressive Web Application provides Mia Healthcare with a modern, offline-capable solution for dental consent form management.*
