import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// ✅ Clean and correct Service Worker setup for GitHub Pages deployment
if ('serviceWorker' in navigator) {
  // 🧹 Unregister all previously cached Service Workers (e.g., bad /sw.js ones)
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then(() => console.log('🧹 Old SW unregistered'));
    }
  });

  // ✅ Register the correct SW with cache-busting version query param
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/mia-consent-offline-form-50/sw.js?v=1')
      .then((reg) => console.log('✅ SW registered:', reg))
      .catch((err) => console.error('❌ SW registration failed:', err));
  });
}




