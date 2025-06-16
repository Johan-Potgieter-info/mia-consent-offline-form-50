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
// Correct Service Worker registration for GitHub Pages
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/mia-consent-offline-form-50/sw.js')
      .then(reg => console.log('✅ SW registered:', reg))
      .catch(err => console.error('❌ SW registration failed:', err));
  });
// Cleanup: Unregister all old service workers (e.g., leftover /sw.js)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(() => console.log('🧹 Old SW unregistered'));
    }
  });

  // Correct Service Worker registration for GitHub Pages subpath
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/mia-consent-offline-form-50/sw.js')
      .then(reg => console.log('✅ SW registered:', reg))
      .catch(err => console.error('❌ SW registration failed:', err));
  });
}
}



