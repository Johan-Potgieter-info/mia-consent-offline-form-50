
// Database utility functions for testing connection and availability

import { initDB } from './indexedDB';

/**
 * Test if IndexedDB is available and can be initialized
 * @returns {Promise<boolean>} True if IndexedDB connection is successful
 */
export const testDBConnection = async (): Promise<boolean> => {
  try {
    await initDB();
    return true;
  } catch (error) {
    console.error('IndexedDB connection test failed:', error);
    return false;
  }
};
