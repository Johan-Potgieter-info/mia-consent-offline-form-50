
// Core database operations for IndexedDB

import { initDB, FORMS_STORE, DRAFTS_STORE } from './database';
import { encryptSensitiveFields, decryptSensitiveFields } from './encryption';

/**
 * Base function to save data to any IndexedDB store
 * @param storeName Store name (forms or drafts)
 * @param data Data object to save
 * @param metadata Additional metadata to add
 * @returns Promise with the saved object ID
 */
export const saveToStore = async (
  storeName: string,
  data: any,
  metadata: Record<string, any> = {}
): Promise<number> => {
  if (!data) {
    throw new Error(`No data provided to save to ${storeName}`);
  }

  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // Generate consistent ID if not present
    const id = data.id || Date.now();
    const timestamp = new Date().toISOString();
    
    // Encrypt sensitive data
    const processedData = encryptSensitiveFields(data);
    
    const dataToSave = {
      ...processedData,
      id,
      timestamp,
      lastModified: timestamp,
      encrypted: true,
      ...metadata
    };

    return new Promise((resolve, reject) => {
      const request = store.put(dataToSave);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = (event) => {
        console.error(`IndexedDB ${storeName} save error:`, event);
        reject(new Error(`Failed to save to ${storeName}: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error(`Error saving to ${storeName}:`, error);
    throw error;
  }
};

/**
 * Generic function to get all items from a store with optional processing
 * @param storeName Store to query
 * @param processItem Optional function to process each item
 * @returns Promise with array of items
 */
export const getAllFromStore = async <T>(
  storeName: string,
  processItem?: (item: any) => any
): Promise<T[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result.map(item => {
          // Process item if processor provided
          if (processItem) {
            return processItem(item);
          }
          return item;
        });
        
        resolve(items as T[]);
      };

      request.onerror = (event) => {
        console.error(`IndexedDB get ${storeName} error:`, event);
        reject(new Error(`Failed to get items from ${storeName}: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error(`Error getting items from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Delete an item from a store
 * @param storeName Store name
 * @param id Item ID to delete
 */
export const deleteFromStore = async (storeName: string, id: number): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    // First check if the item exists
    const getRequest = await new Promise<IDBRequest>((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request);
      request.onerror = (event) => reject(event);
    });
    
    if (!getRequest.result) {
      throw new Error(`Item ${id} not found in ${storeName}`);
    }
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      
      request.onsuccess = () => {
        console.log(`Item ${id} deleted from ${storeName}`);
        resolve();
      };

      request.onerror = (event) => {
        console.error(`IndexedDB delete error from ${storeName}:`, event);
        reject(new Error(`Failed to delete item ${id}: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error(`Error deleting item from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Filter items from a store based on a predicate
 * @param storeName Store to query
 * @param predicate Function to filter items
 * @param processItem Optional function to process each matching item
 * @returns Promise with filtered array of items
 */
export const filterFromStore = async <T>(
  storeName: string,
  predicate: (item: any) => boolean,
  processItem?: (item: any) => any
): Promise<T[]> => {
  try {
    const allItems = await getAllFromStore(storeName);
    
    return allItems
      .filter(predicate)
      .map(item => {
        if (processItem) {
          return processItem(item);
        }
        return item;
      }) as T[];
  } catch (error) {
    console.error(`Error filtering items from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Decrypt items from a store that have the encrypted flag
 * @param items Array of potentially encrypted items
 * @returns Array of decrypted items
 */
export const decryptItems = (items: any[]): any[] => {
  return items.map(item => {
    try {
      if (item.encrypted) {
        return decryptSensitiveFields(item);
      }
      return item;
    } catch (decryptError) {
      console.warn('Failed to decrypt item, returning as is:', decryptError);
      return { ...item, decryptionFailed: true };
    }
  });
};
