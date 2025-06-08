
// Storage capabilities detection and management

import { testSupabaseConnection } from '../supabaseOperations';
import { testDBConnection } from '../databaseUtils';

export interface StorageCapabilities {
  supabase: boolean;
  indexedDB: boolean;
}

let storageCapabilities: StorageCapabilities = {
  supabase: false,
  indexedDB: false
};

/**
 * Initialize and test storage capabilities
 */
export const initializeStorage = async (): Promise<StorageCapabilities> => {
  try {
    const [supabaseAvailable, indexedDBAvailable] = await Promise.all([
      testSupabaseConnection(),
      testDBConnection()
    ]);

    storageCapabilities = {
      supabase: supabaseAvailable,
      indexedDB: indexedDBAvailable
    };

    console.log('Storage capabilities initialized:', storageCapabilities);
    return storageCapabilities;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return storageCapabilities;
  }
};

/**
 * Get current storage capabilities
 */
export const getStorageCapabilities = (): StorageCapabilities => {
  return { ...storageCapabilities };
};

/**
 * Update storage capabilities (used when connectivity changes)
 */
export const updateStorageCapabilities = (updates: Partial<StorageCapabilities>): void => {
  storageCapabilities = { ...storageCapabilities, ...updates };
};
