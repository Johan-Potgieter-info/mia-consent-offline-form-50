
// Database initialization and management

export const DB_NAME = 'MiaFormsDB';
export const DB_VERSION = 2;
export const FORMS_STORE = 'forms';
export const DRAFTS_STORE = 'drafts';

// Initialize IndexedDB with enhanced schema
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      const db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create forms store if it doesn't exist
      if (!db.objectStoreNames.contains(FORMS_STORE)) {
        const formsStore = db.createObjectStore(FORMS_STORE, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        formsStore.createIndex('timestamp', 'timestamp', { unique: false });
        formsStore.createIndex('synced', 'synced', { unique: false });
        formsStore.createIndex('regionCode', 'regionCode', { unique: false });
        formsStore.createIndex('status', 'status', { unique: false });
      }

      // Create drafts store for auto-save functionality
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        const draftsStore = db.createObjectStore(DRAFTS_STORE, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        draftsStore.createIndex('lastModified', 'lastModified', { unique: false });
        draftsStore.createIndex('regionCode', 'regionCode', { unique: false });
      }
    };
  });
};
