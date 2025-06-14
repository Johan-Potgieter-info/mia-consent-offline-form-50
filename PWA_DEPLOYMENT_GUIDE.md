
# Mia Healthcare PWA - Deployment Guide

**Owner:** Mia Healthcare  
**Developer:** Johan Potgieter

## PWA Packaging Checklist

### ✅ PWA Requirements Met
- [x] HTTPS deployment required
- [x] Service Worker implemented (`public/sw.js`)
- [x] Web App Manifest configured (`public/manifest.json`)
- [x] Responsive design for all devices
- [x] Offline functionality implemented
- [x] App installability verified

### ✅ Icon Configuration
- [x] **Desktop Icon**: Uses Mia Healthcare logo (`/lovable-uploads/2741077b-1d2b-4fa2-9829-1d43a1a54427.png`)
- [x] Multiple icon sizes: 192x192, 512x512
- [x] Maskable icons for Android
- [x] Apple touch icons for iOS
- [x] Favicon configured

## Pre-Deployment Steps

### 1. Build Verification
```bash
# Clean build
rm -rf dist/
npm run build

# Verify build output
ls -la dist/
```

### 2. PWA Audit
Use Chrome DevTools:
1. Open built app in Chrome
2. Go to DevTools > Lighthouse
3. Run PWA audit
4. Ensure score is 90+

### 3. Icon Verification
Verify the Mia logo appears correctly:
- Desktop installation icon
- Browser tab favicon
- Mobile home screen icon
- App splash screen

## Deployment Options

### Option 1: Static Hosting (Recommended)

#### Netlify Deployment
```bash
# Build the app
npm run build

# Deploy to Netlify
# Upload dist/ folder or connect Git repository
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 2: Traditional Web Server

#### Apache Configuration
Create `.htaccess` in web root:
```apache
# Enable HTTPS redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# PWA Manifest MIME type
AddType application/manifest+json .json

# Service Worker
<Files "sw.js">
  Header set Service-Worker-Allowed "/"
  Header set Cache-Control "no-cache"
</Files>

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
  ExpiresActive On
  ExpiresDefault "access plus 1 year"
</FilesMatch>
```

#### Nginx Configuration
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /path/to/dist;
    index index.html;
    
    # PWA Manifest
    location ~* \.json$ {
        add_header Content-Type application/manifest+json;
    }
    
    # Service Worker
    location /sw.js {
        add_header Cache-Control "no-cache";
        add_header Service-Worker-Allowed "/";
    }
    
    # Static assets caching
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Post-Deployment Verification

### 1. PWA Installation Test
1. Visit deployed URL in Chrome
2. Check for "Install" button in address bar
3. Install the app
4. Verify Mia logo appears as desktop icon
5. Launch installed app - should open in standalone mode

### 2. Offline Functionality Test
1. Open the installed PWA
2. Disconnect internet
3. Navigate through the app
4. Fill out a form
5. Verify form saves as draft
6. Reconnect internet
7. Verify form syncs to cloud

### 3. Mobile Installation Test
1. Open app on mobile device
2. Add to home screen
3. Verify Mia logo appears correctly
4. Test offline functionality

## Environment Configuration

### Production Environment Variables
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### Domain Configuration
Update these files for your domain:
- `public/manifest.json`: Update `start_url` and `scope`
- `capacitor.config.ts`: Update server URL if using mobile apps

## Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze
```

### 2. Cache Strategy
The service worker implements:
- **Cache First**: Static assets (images, CSS, JS)
- **Network First**: API calls with fallback
- **Stale While Revalidate**: HTML pages

### 3. Image Optimization
- Mia logo is optimized for web
- Multiple icon sizes for different contexts
- WebP format where supported

## Monitoring and Updates

### 1. Update Deployment
```bash
# Build new version
npm run build

# Deploy to hosting service
# Users will be notified of update automatically
```

### 2. Version Control
- Update version in `package.json`
- Update service worker cache version
- Test update mechanism

## Security Considerations

### 1. HTTPS Required
- PWAs must be served over HTTPS
- Obtain SSL certificate for your domain

### 2. Content Security Policy
Add CSP headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:;
```

### 3. Data Protection
- Forms encrypted in transit
- Local storage secured
- GDPR/HIPAA compliance maintained

## Troubleshooting

### Common Issues
1. **App not installable**: Check HTTPS and manifest validity
2. **Icons not showing**: Verify icon paths and sizes
3. **Service worker not updating**: Clear cache and check SW registration
4. **Offline not working**: Verify service worker cache strategy

### Debug Tools
- Chrome DevTools > Application tab
- Lighthouse PWA audit
- Service Worker debugging

---

**Deployment Checklist Summary:**
- [ ] HTTPS enabled
- [ ] PWA audit score 90+
- [ ] Mia logo displays correctly as desktop icon
- [ ] Offline functionality tested
- [ ] Mobile installation verified
- [ ] Environment variables configured
- [ ] Performance optimized
- [ ] Security headers added

**Contact:** Johan Potgieter (Developer)
