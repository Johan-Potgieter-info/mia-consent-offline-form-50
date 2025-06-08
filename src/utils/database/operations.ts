
// Core database operations

import { initDB } from './initialization';
import { encryptSensitiveFields, decryptSensitiveFields } from '../encryption';
import { FormData } from '../../types/formTypes';

/**
 * Save form data to IndexedDB
 * @param formData Form data to save
 * @param storeName Store name to save to
 * @returns Promise with the saved object ID
 */
export const saveToIndexedDB = async (formData: FormData, storeName: string): Promise<number> => {
  if (!formData) {
    throw new Error(`No form data provided to save to ${storeName}`);
  }

  try {
    const db = await initDB();
    
    // Generate consistent ID if not present
    const id = formData.id || Date.now();
    const timestamp = new Date().toISOString();
    
    // Encrypt sensitive data
    const processedData = encryptSensitiveFields(formData);
    
    const dataToSave = {
      ...processedData,
      id,
      timestamp,
      lastModified: timestamp,
      encrypted: true
    };

    const result = await db.put(storeName, dataToSave);
    return result as number;
  } catch (error) {
    console.error(`Error saving to ${storeName}:`, error);
    throw error;
  }
};

/**
 * Get all items from a store
 * @param storeName Store name to query
 * @returns Promise with all items (decrypted)
 */
export const getAllFromIndexedDB = async (storeName: string): Promise<any[]> => {
  try {
    const db = await initDB();
    const items = await db.getAll(storeName);
    
    return items.map(item => {
      try {
        if (item.encrypted) {
          return { ...item, ...decryptSensitiveFields(item) };
        }
        return item;
      } catch (decryptError) {
        console.warn('Failed to decrypt item, returning as is:', decryptError);
        return { ...item, decryptionFailed: true };
      }
    });
  } catch (error) {
    console.error(`Error getting all items from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Delete an item from IndexedDB
 * @param id Item ID to delete
 * @param storeName Store name
 * @returns Promise that resolves when item is deleted
 */
export const deleteFromIndexedDB = async (id: number, storeName: string): Promise<void> => {
  try {
    const db = await initDB();
    
    // First check if the item exists
    const existingItem = await db.get(storeName, id);
    
    if (!existingItem) {
      throw new Error(`Item ${id} not found in ${storeName}`);
    }
    
    await db.delete(storeName, id);
    console.log(`Item ${id} deleted from ${storeName}`);
  } catch (error) {
    console.error(`Error deleting item from ${storeName}:`, error);
    throw error;
  }
};

/**
 * Update an existing item by ID
 * @param id Item ID to update
 * @param formData Updated form data
 * @param storeName Store name
 * @returns Promise that resolves when item is updated
 */
export const updateInIndexedDB = async (id: number | string, formData: FormData, storeName: string): Promise<void> => {
  try {
    const db = await initDB();
    
    // Get existing item first
    const existingItem = await db.get(storeName, id);
    
    if (!existingItem) {
      throw new Error(`Item with ID ${id} not found in ${storeName}`);
    }
    
    // Encrypt sensitive data
    const processedData = encryptSensitiveFields(formData);
    
    const updatedData = {
      ...existingItem,
      ...processedData,
      lastModified: new Date().toISOString(),
      encrypted: true
    };
    
    await db.put(storeName, updatedData);
    console.log(`Item ${id} updated successfully in ${storeName}`);
  } catch (error) {
    console.error(`Error updating item in ${storeName}:`, error);
    throw error;
  }
};
