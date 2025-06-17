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

// Service Worker registration
if ('serviceWorker' in navigator) {
  // Unregister old service workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister().then(() => console.log('  Old SW unregistered'));
    }
  });
  // Register custom service worker
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/mia-consent-offline-form-50/sw.js?v=1')
      .then(reg => console.log('✅ SW registered:', reg))
      .catch(err => console.error('❌ SW registration failed:', err));
  });
}
