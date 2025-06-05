
// Synchronization operations for form data

import { initDB, FORMS_STORE } from './database';
import { decryptSensitiveFields } from './encryption';

// Get region endpoint for form submission
const getRegionEndpoint = (regionCode: string): string => {
  const endpoints = {
    'CPT': '/api/submit-consent-form-cpt',
    'PTA': '/api/submit-consent-form-pta', 
    'JHB': '/api/submit-consent-form-jhb'
  };
  
  return endpoints[regionCode as keyof typeof endpoints] || endpoints.PTA;
};

// Get all unsynced forms with retry mechanism
export const getUnsyncedForms = async (): Promise<any[]> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readonly');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    try {
      // Get all forms and filter for unsynced ones
      const request = store.getAll();

      request.onsuccess = () => {
        const allForms = request.result;
        const unsyncedForms = allForms.filter(form => !form.synced);
        const decryptedForms = unsyncedForms.map(form => decryptSensitiveFields(form));
        resolve(decryptedForms);
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

// Clear synced forms
export const clearSyncedForms = async (): Promise<void> => {
  const db = await initDB();
  const transaction = db.transaction([FORMS_STORE], 'readwrite');
  const store = transaction.objectStore(FORMS_STORE);
  
  return new Promise((resolve, reject) => {
    // Get all forms and filter for synced ones
    const request = store.getAll();

    request.onsuccess = () => {
      const allForms = request.result;
      const syncedForms = allForms.filter(form => form.synced);
      let deletedCount = 0;
      
      if (syncedForms.length === 0) {
        resolve();
        return;
      }

      syncedForms.forEach(form => {
        const deleteRequest = store.delete(form.id);
        deleteRequest.onsuccess = () => {
          deletedCount++;
          if (deletedCount === syncedForms.length) {
            console.log(`Cleared ${deletedCount} synced forms`);
            resolve();
          }
        };
        deleteRequest.onerror = () => {
          reject(new Error(`Failed to delete form ${form.id}`));
        };
      });
    };

    request.onerror = () => {
      reject(new Error('Failed to get synced forms for cleanup'));
    };
  });
};
