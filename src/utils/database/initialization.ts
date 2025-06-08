
// Database initialization logic

import { openDB, IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, FORMS_STORE, DRAFTS_STORE } from './config';

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
      upgrade(db, oldVersion, newVersion, transaction) {
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
          if (db.objectStoreNames.contains(DRAFTS_STORE)) {
            const tx = transaction;
            const draftsStore = tx.objectStore(DRAFTS_STORE);
            if (!draftsStore.indexNames.contains('sessionId')) {
              draftsStore.createIndex('sessionId', 'id', { unique: false });
              console.log(`Index 'sessionId' created in '${DRAFTS_STORE}'`);
            }
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
