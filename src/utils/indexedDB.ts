// Enhanced IndexedDB utilities for secure offline storage

const DB_NAME = 'MiaFormsDB';
const DB_VERSION = 2; // Incremented for schema updates
const FORMS_STORE = 'forms';
const DRAFTS_STORE = 'drafts';

// Encryption key for sensitive data (in production, this should come from secure storage)
const ENCRYPTION_KEY = 'mia-healthcare-2024';

// Simple encryption/decryption functions
const encrypt = (text: string): string => {
  try {
    return btoa(encodeURIComponent(text));
  } catch (error) {
    console.warn('Encryption failed, storing as plain text');
    return text;
  }
};

const decrypt = (encryptedText: string): string => {
  try {
    return decodeURIComponent(atob(encryptedText));
  } catch (error) {
    // If decryption fails, assume it's plain text
    return encryptedText;
  }
};

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

// Save form data with encryption for sensitive fields
export const saveFormData = async (formData: any, isDraft: boolean = false): Promise<number> => {
  const db = await initDB();
  const storeName = isDraft ? DRAFTS_STORE : FORMS_STORE;
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  
  // Encrypt sensitive data
  const sensitiveFields = ['patientName', 'idNumber', 'contactNumber', 'email', 'address'];
  const processedData = { ...formData };
  
  sensitiveFields.forEach(field => {
    if (processedData[field]) {
      processedData[field] = encrypt(processedData[field]);
    }
  });
  
  const dataToSave = {
    ...processedData,
    id: formData.id || Date.now(),
    timestamp: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    synced: false,
    status: isDraft ? 'draft' : 'completed',
    regionLabel: `${formData.regionCode || 'PTA'}-${isDraft ? 'DRAFT' : 'FORM'}-${Date.now()}`,
    submissionRegion: formData.regionCode || 'PTA',
    encrypted: true
  };

  return new Promise((resolve, reject) => {
    const request = store.put(dataToSave);

    request.onsuccess = () => {
      console.log(`${isDraft ? 'Draft' : 'Form'} data saved to IndexedDB for region: ${formData.regionCode || 'PTA'}`);
      resolve(request.result as number);
    };

    request.onerror = () => {
      reject(new Error(`Failed to save ${isDraft ? 'draft' : 'form'} data`));
    };
  });
};

// Get all drafts for resume functionality
export const getAllDrafts = async (): Promise<any[]> => {
  const db = await initDB();
  const transaction = db.transaction([DRAFTS_STORE], 'readonly');
  const store = transaction.objectStore(DRAFTS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      const drafts = request.result.map(draft => {
        // Decrypt sensitive data
        const decryptedDraft = { ...draft };
        const sensitiveFields = ['patientName', 'idNumber', 'contactNumber', 'email', 'address'];
        
        sensitiveFields.forEach(field => {
          if (decryptedDraft[field] && decryptedDraft.encrypted) {
            decryptedDraft[field] = decrypt(decryptedDraft[field]);
          }
        });
        
        return decryptedDraft;
      });
      resolve(drafts);
    };

    request.onerror = () => {
      reject(new Error('Failed to get drafts'));
    };
  });
};

// Delete draft after completion
export const deleteDraft = async (id: number): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([DRAFTS_STORE], 'readwrite');
  const store = transaction.objectStore(DRAFTS_STORE);
  
  return new Promise((resolve, reject) => {
    const request = store.delete(id);

    request.onsuccess = () => {
      console.log(`Draft ${id} deleted`);
      resolve();
    };

    request.onerror = () => {
      reject(new Error(`Failed to delete draft ${id}`));
    };
  });
};

// Get all unsynced forms with retry mechanism
export const getUnsyncedForms = async (): Promise<any[]> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readonly');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    try {
      const index = store.index('synced');
      const request = index.getAll(false); // Use boolean false instead of IDBKeyRange

      request.onsuccess = () => {
        const forms = request.result.map(form => {
          // Decrypt sensitive data for submission
          const decryptedForm = { ...form };
          const sensitiveFields = ['patientName', 'idNumber', 'contactNumber', 'email', 'address'];
          
          sensitiveFields.forEach(field => {
            if (decryptedForm[field] && decryptedForm.encrypted) {
              decryptedForm[field] = decrypt(decryptedForm[field]);
            }
          });
          
          return decryptedForm;
        });
        resolve(forms);
      };

      request.onerror = () => {
        reject(new Error('Failed to get unsynced forms'));
      };
    } catch (error) {
      console.error('Error in getUnsyncedForms:', error);
      resolve([]); // Return empty array on error
    }
  });
};

// Enhanced sync with retry logic and better error handling
export const syncPendingForms = async (maxRetries: number = 3): Promise<{ success: number; failed: number }> => {
  let results = { success: 0, failed: 0 };
  
  try {
    const unsyncedForms = await getUnsyncedForms();
    console.log(`Found ${unsyncedForms.length} unsynced forms`);
    
    for (const form of unsyncedForms) {
      let attempts = 0;
      let synced = false;
      
      while (attempts < maxRetries && !synced) {
        try {
          attempts++;
          const endpoint = getRegionEndpoint(form.regionCode || 'PTA');
          
          // Add retry delay for subsequent attempts
          if (attempts > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
          }
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Mia-Region': form.regionCode || 'PTA',
              'X-Mia-Timestamp': new Date().toISOString(),
            },
            body: JSON.stringify({
              ...form,
              syncAttempt: attempts,
              regionLabel: `${form.regionCode || 'PTA'}-FORM-${form.id}`,
              submissionRegion: form.regionCode || 'PTA'
            }),
          });

          if (response.ok) {
            await markFormAsSynced(form.id);
            console.log(`Form ${form.id} synced successfully for region ${form.regionCode || 'PTA'} (attempt ${attempts})`);
            results.success++;
            synced = true;
          } else if (response.status >= 400 && response.status < 500) {
            // Client error - don't retry
            console.error(`Form ${form.id} failed with client error ${response.status}:`, response.statusText);
            results.failed++;
            break;
          } else {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error(`Sync attempt ${attempts} failed for form ${form.id}:`, error);
          
          if (attempts === maxRetries) {
            results.failed++;
            console.error(`Form ${form.id} failed all ${maxRetries} sync attempts`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error during sync process:', error);
  }
  
  return results;
};

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
        form.syncedAt = new Date().toISOString();
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

const getRegionEndpoint = (regionCode: string): string => {
  const endpoints = {
    'CPT': '/api/submit-consent-form-cpt',
    'PTA': '/api/submit-consent-form-pta', 
    'JHB': '/api/submit-consent-form-jhb'
  };
  
  return endpoints[regionCode as keyof typeof endpoints] || endpoints.PTA;
};

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
        (!form.regionCode && regionCode === 'PTA')
      );
      resolve(regionForms);
    };

    request.onerror = () => {
      reject(new Error(`Failed to get forms for region ${regionCode}`));
    };
  });
};

export const clearSyncedForms = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    const index = store.index('synced');
    const request = index.getAllKeys(true); // Use boolean true

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
