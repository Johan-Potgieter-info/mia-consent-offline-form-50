// IndexedDB operations

import { openDB, IDBPDatabase } from 'idb';
import { FormData } from '../types/formTypes';
import { encryptSensitiveFields, decryptSensitiveFields } from './encryption';

const DB_NAME = 'consentFormDB';
const DB_VERSION = 2;
export const FORMS_STORE = 'forms';
export const DRAFTS_STORE = 'drafts';

let dbInstance: IDBPDatabase<any> | null = null;

/**
 * Initialize the IndexedDB database
 * @returns Promise with the database instance
 */
export const initDB = async (): Promise<IDBPDatabase<any>> => {
  if (dbInstance) {
    console.log('Reusing existing database instance');
    return dbInstance;
  }

  try {
    dbInstance = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        console.log(`Upgrading database from version ${oldVersion} to ${DB_VERSION}`);

        if (oldVersion < 1) {
          // Create forms store
          if (!db.objectStoreNames.contains(FORMS_STORE)) {
            const formsStore = db.createObjectStore(FORMS_STORE, { keyPath: 'id', autoIncrement: true });
            formsStore.createIndex('submissionId', 'submissionId', { unique: true });
            console.log(`Object store '${FORMS_STORE}' created`);
          }

          // Create drafts store
          if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
            const draftsStore = db.createObjectStore(DRAFTS_STORE, { keyPath: 'id', autoIncrement: true });
            draftsStore.createIndex('regionCode', 'regionCode', { unique: false });
            console.log(`Object store '${DRAFTS_STORE}' created`);
          }
        }

        if (oldVersion < 2) {
          // Add index for session ID in drafts store
          const draftsStore = db.transaction.objectStore(DRAFTS_STORE);
          if (!draftsStore.indexNames.contains('sessionId')) {
            draftsStore.createIndex('sessionId', 'id', { unique: false });
            console.log(`Index 'sessionId' created in '${DRAFTS_STORE}'`);
          }
        }
      },
      blocked() {
        console.warn('Database blocked, close other instances');
      },
      blocking() {
        console.warn('Database is blocking, try to close this tab');
      },
      terminated() {
        console.warn('Database terminated');
      }
    });

    console.log('Database initialized successfully');
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    dbInstance = null; // Reset instance on failure
    throw error;
  }
};

/**
 * Save form data to IndexedDB
 * @param formData Form data to save
 * @param isDraft Whether this is a draft
 * @returns Promise with the saved object ID
 */
export const saveFormData = async (formData: FormData, isDraft: boolean = false): Promise<number> => {
  const storeName = isDraft ? DRAFTS_STORE : FORMS_STORE;

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
 * Get all forms from IndexedDB
 * @returns Promise with all forms (decrypted)
 */
export const getAllForms = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    const forms = await db.getAll(FORMS_STORE);
    
    return forms.map(form => {
      try {
        if (form.encrypted) {
          return { ...form, ...decryptSensitiveFields(form) };
        }
        return form;
      } catch (decryptError) {
        console.warn('Failed to decrypt form, returning as is:', decryptError);
        return { ...form, decryptionFailed: true };
      }
    });
  } catch (error) {
    console.error('Error getting all forms:', error);
    throw error;
  }
};

/**
 * Get all drafts from IndexedDB
 * @returns Promise with all drafts (decrypted)
 */
export const getAllDrafts = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    const drafts = await db.getAll(DRAFTS_STORE);
    
    const decryptedDrafts = drafts.map(draft => {
      try {
        if (draft.encrypted) {
          return { ...draft, ...decryptSensitiveFields(draft) };
        }
        return draft;
      } catch (decryptError) {
        console.warn('Failed to decrypt draft, returning as is:', decryptError);
        return { ...draft, decryptionFailed: true };
      }
    });
    
    // Sort drafts by lastModified (newest first)
    decryptedDrafts.sort((a, b) => {
      const dateA = new Date(a.lastModified || a.timestamp);
      const dateB = new Date(b.lastModified || b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });
    
    return decryptedDrafts;
  } catch (error) {
    console.error('Error getting all drafts:', error);
    throw error;
  }
};

/**
 * Delete a draft from IndexedDB
 * @param id Draft ID to delete
 * @returns Promise that resolves when draft is deleted
 */
export const deleteDraft = async (id: number): Promise<void> => {
  try {
    const db = await initDB();
    
    // First check if the item exists
    const existingItem = await db.get(DRAFTS_STORE, id);
    
    if (!existingItem) {
      throw new Error(`Item ${id} not found in drafts`);
    }
    
    await db.delete(DRAFTS_STORE, id);
    console.log(`Draft ${id} deleted`);
  } catch (error) {
    console.error('Error deleting draft:', error);
    throw error;
  }
};

/**
 * Update an existing draft by ID
 * @param id Draft ID to update
 * @param formData Updated form data
 * @returns Promise that resolves when draft is updated
 */
export const updateDraftById = async (id: number | string, formData: FormData): Promise<void> => {
  try {
    const db = await initDB();
    
    // Get existing draft first
    const existingDraft = await db.get(DRAFTS_STORE, id);
    
    if (!existingDraft) {
      throw new Error(`Draft with ID ${id} not found`);
    }
    
    // Encrypt sensitive data
    const processedData = encryptSensitiveFields(formData);
    
    const updatedData = {
      ...existingDraft,
      ...processedData,
      lastModified: new Date().toISOString(),
      encrypted: true
    };
    
    await db.put(DRAFTS_STORE, updatedData);
    console.log(`Draft ${id} updated successfully`);
  } catch (error) {
    console.error('Error updating draft:', error);
    throw error;
  }
};

/**
 * Sync pending forms to server (placeholder for now)
 */
export const syncPendingForms = async (): Promise<void> => {
  console.log('Sync pending forms called - placeholder implementation');
  // TODO: Implement actual sync logic if needed
};
