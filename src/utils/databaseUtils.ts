
// Database utility functions for testing connection and availability

import { initDB } from './indexedDB';

/**
 * Test if IndexedDB is available and can be initialized
 * @returns {Promise<boolean>} True if IndexedDB connection is successful
 */
export const testDBConnection = async (): Promise<boolean> => {
  try {
    // Check if IndexedDB is supported
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported in this browser');
      return false;
    }

    // Test basic IndexedDB functionality
    const testDB = await initDB();
    
    // Try a simple operation to verify it's working
    const transaction = testDB.transaction(['forms'], 'readonly');
    const store = transaction.objectStore('forms');
    
    // This will throw if there are permission issues
    await new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    testDB.close();
    console.log('IndexedDB connection test successful');
    return true;
  } catch (error) {
    console.error('IndexedDB connection test failed:', error);
    
    // Log specific error types for debugging
    if (error instanceof DOMException) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
      } else if (error.name === 'SecurityError') {
        console.error('Security error - possibly private browsing mode');
      } else if (error.name === 'VersionError') {
        console.error('Database version error');
      }
    }
    
    return false;
  }
};

/**
 * Get browser and device information for debugging
 */
export const getBrowserInfo = () => {
  const info = {
    userAgent: navigator.userAgent,
    cookieEnabled: navigator.cookieEnabled,
    language: navigator.language,
    onLine: navigator.onLine,
    storage: {
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
    },
    connection: (navigator as any).connection ? {
      effectiveType: (navigator as any).connection.effectiveType,
      downlink: (navigator as any).connection.downlink,
      rtt: (navigator as any).connection.rtt,
    } : null
  };
  
  console.log('Browser environment info:', info);
  return info;
};

/**
 * Test storage quota and available space
 */
export const checkStorageQuota = async () => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const info = {
        quota: estimate.quota,
        usage: estimate.usage,
        available: estimate.quota ? estimate.quota - (estimate.usage || 0) : null,
        usageDetails: (estimate as any).usageDetails || null
      };
      console.log('Storage quota info:', info);
      return info;
    }
  } catch (error) {
    console.error('Could not check storage quota:', error);
  }
  return null;
};

/**
 * Test if localStorage is accessible and working
 */
export const testLocalStorage = (): boolean => {
  try {
    const testKey = '__storage_test__';
    const testValue = 'test';
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return retrieved === testValue;
  } catch (error) {
    console.error('localStorage test failed:', error);
    return false;
  }
};

/**
 * Test if sessionStorage is accessible and working
 */
export const testSessionStorage = (): boolean => {
  try {
    const testKey = '__session_test__';
    const testValue = 'test';
    sessionStorage.setItem(testKey, testValue);
    const retrieved = sessionStorage.getItem(testKey);
    sessionStorage.removeItem(testKey);
    return retrieved === testValue;
  } catch (error) {
    console.error('sessionStorage test failed:', error);
    return false;
  }
};

/**
 * Get comprehensive storage availability info
 */
export const getStorageCapabilities = async () => {
  const capabilities = {
    indexedDB: await testDBConnection(),
    localStorage: testLocalStorage(),
    sessionStorage: testSessionStorage(),
    quota: await checkStorageQuota(),
    browserInfo: getBrowserInfo()
  };
  
  console.log('Storage capabilities:', capabilities);
  return capabilities;
};
