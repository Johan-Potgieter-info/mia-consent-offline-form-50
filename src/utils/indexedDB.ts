
// IndexedDB utilities for offline storage

const DB_NAME = 'MiaFormsDB';
const DB_VERSION = 1;
const FORMS_STORE = 'forms';

// Initialize IndexedDB
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create forms store if it doesn't exist
      if (!db.objectStoreNames.contains(FORMS_STORE)) {
        const store = db.createObjectStore(FORMS_STORE, { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };
  });
};

// Save form data to IndexedDB
export const saveFormData = async (formData: any): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.add({
      ...formData,
      id: Date.now(), // Simple ID generation
      timestamp: new Date().toISOString(),
      synced: false
    });

    request.onsuccess = () => {
      console.log('Form data saved to IndexedDB');
      resolve();
    };

    request.onerror = () => {
      reject(new Error('Failed to save form data'));
    };
  });
};

// Get all unsynced forms
export const getUnsyncedForms = async (): Promise<any[]> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readonly');
  const store = transaction.objectStore(FORMS_STORE);
  const index = store.index('synced');
  
  return new Promise((resolve, reject) => {
    const request = index.getAll(false);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get unsynced forms'));
    };
  });
};

// Mark form as synced
export const markFormAsSynced = async (id: number): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    
    getRequest.onsuccess = () => {
      const form = getRequest.result;
      if (form) {
        form.synced = true;
        const updateRequest = store.put(form);
        
        updateRequest.onsuccess = () => {
          console.log(`Form ${id} marked as synced`);
          resolve();
        };
        
        updateRequest.onerror = () => {
          reject(new Error(`Failed to mark form ${id} as synced`));
        };
      } else {
        reject(new Error(`Form ${id} not found`));
      }
    };

    getRequest.onerror = () => {
      reject(new Error(`Failed to get form ${id}`));
    };
  });
};

// Sync pending forms to server
export const syncPendingForms = async (): Promise<void> => {
  try {
    const unsyncedForms = await getUnsyncedForms();
    
    for (const form of unsyncedForms) {
      try {
        // Send form to server
        const response = await fetch('/api/submit-consent-form', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (response.ok) {
          await markFormAsSynced(form.id);
          console.log(`Form ${form.id} synced successfully`);
        } else {
          console.error(`Failed to sync form ${form.id}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error syncing form ${form.id}:`, error);
        // Continue with next form even if one fails
      }
    }
  } catch (error) {
    console.error('Error during sync process:', error);
    throw error;
  }
};

// Clear all synced forms (optional cleanup)
export const clearSyncedForms = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  const index = store.index('synced');
  
  return new Promise((resolve, reject) => {
    const request = index.getAllKeys(true);

    request.onsuccess = () => {
      const keys = request.result;
      let deletedCount = 0;
      
      if (keys.length === 0) {
        resolve();
        return;
      }

      keys.forEach(key => {
        const deleteRequest = store.delete(key);
        deleteRequest.onsuccess = () => {
          deletedCount++;
          if (deletedCount === keys.length) {
            console.log(`Cleared ${deletedCount} synced forms`);
            resolve();
          }
        };
        deleteRequest.onerror = () => {
          reject(new Error(`Failed to delete form ${key}`));
        };
      });
    };

    request.onerror = () => {
      reject(new Error('Failed to get synced forms for cleanup'));
    };
  });
};

// Get all forms (for debugging/admin purposes)
export const getAllForms = async (): Promise<any[]> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readonly');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(new Error('Failed to get all forms'));
    };
  });
};
