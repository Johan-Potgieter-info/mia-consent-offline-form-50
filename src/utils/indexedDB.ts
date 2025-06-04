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

// Save form data to IndexedDB with region information
export const saveFormData = async (formData: any): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.add({
      ...formData,
      id: Date.now(), // Simple ID generation
      timestamp: new Date().toISOString(),
      synced: false,
      regionLabel: `${formData.regionCode || 'PTA'}-${formData.regionCode || 'PTA'}`, // Regional labeling
      submissionRegion: formData.regionCode || 'PTA'
    });

    request.onsuccess = () => {
      console.log(`Form data saved to IndexedDB for region: ${formData.regionCode || 'PTA'}`);
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
    const request = index.getAll(IDBKeyRange.only(false));

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

// Sync pending forms to server with region-specific endpoints
export const syncPendingForms = async (): Promise<void> => {
  try {
    const unsyncedForms = await getUnsyncedForms();
    
    for (const form of unsyncedForms) {
      try {
        // Determine endpoint based on region
        const endpoint = getRegionEndpoint(form.regionCode || 'PTA');
        
        // Send form to appropriate regional server/endpoint
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...form,
            regionLabel: `${form.regionCode || 'PTA'}-FORM-${form.id}`,
            submissionRegion: form.regionCode || 'PTA'
          }),
        });

        if (response.ok) {
          await markFormAsSynced(form.id);
          console.log(`Form ${form.id} synced successfully for region ${form.regionCode || 'PTA'}`);
        } else {
          console.error(`Failed to sync form ${form.id} for region ${form.regionCode}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error syncing form ${form.id} for region ${form.regionCode}:`, error);
        // Continue with next form even if one fails
      }
    }
  } catch (error) {
    console.error('Error during sync process:', error);
    throw error;
  }
};

// Get region-specific endpoint for form submission
const getRegionEndpoint = (regionCode: string): string => {
  const endpoints = {
    'CPT': '/api/submit-consent-form-cpt',
    'PTA': '/api/submit-consent-form-pta', 
    'JHB': '/api/submit-consent-form-jhb'
  };
  
  return endpoints[regionCode as keyof typeof endpoints] || endpoints.PTA;
};

// Get forms by region (for regional reporting)
export const getFormsByRegion = async (regionCode: string): Promise<any[]> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readonly');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      const allForms = request.result;
      const regionForms = allForms.filter(form => 
        form.regionCode === regionCode || 
        (!form.regionCode && regionCode === 'PTA') // Default to PTA for legacy forms
      );
      resolve(regionForms);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get forms for region ${regionCode}`));
    };
  });
};

// Clear all synced forms (optional cleanup)
export const clearSyncedForms = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  const index = store.index('synced');
  
  return new Promise((resolve, reject) => {
    const request = index.getAllKeys(IDBKeyRange.only(true));

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
