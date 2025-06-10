
// Cache management utilities for offline forms

/**
 * Clear all application caches including service worker caches
 */
export const clearAllCaches = async (): Promise<void> => {
  try {
    // Clear service worker caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Service worker caches cleared');
    }

    // Clear localStorage
    localStorage.clear();
    console.log('localStorage cleared');

    // Clear sessionStorage
    sessionStorage.clear();
    console.log('sessionStorage cleared');

    // Force reload to reinitialize everything
    window.location.reload();
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};

/**
 * Clear only form-related caches and data
 */
export const clearFormCaches = async (): Promise<void> => {
  try {
    // Clear form-related localStorage items
    const formKeys = ['emergencyFormDraft', 'formSession'];
    formKeys.forEach(key => localStorage.removeItem(key));

    // Clear form-related caches
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const formCacheNames = cacheNames.filter(name => 
        name.includes('form') || name.includes('mia-consent')
      );
      await Promise.all(
        formCacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    console.log('Form caches cleared');
  } catch (error) {
    console.error('Error clearing form caches:', error);
  }
};

/**
 * Force refresh of IndexedDB connection
 */
export const refreshIndexedDB = async (): Promise<void> => {
  try {
    // Close any existing database connections
    const { initDB } = await import('./database/initialization');
    
    // Force a fresh database connection
    await initDB();
    console.log('IndexedDB connection refreshed');
  } catch (error) {
    console.error('Error refreshing IndexedDB:', error);
  }
};

/**
 * Check if the application is experiencing cache issues
 */
export const detectCacheIssues = (): boolean => {
  try {
    // Check if IndexedDB is available
    if (!window.indexedDB) {
      return true;
    }

    // Check if localStorage is corrupted
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch {
      return true;
    }

    return false;
  } catch {
    return true;
  }
};
