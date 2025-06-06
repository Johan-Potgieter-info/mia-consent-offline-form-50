// Form data operations for drafts and completed forms

import { initDB, FORMS_STORE, DRAFTS_STORE } from './database';
import { encryptSensitiveFields, decryptSensitiveFields } from './encryption';

// Save form data with encryption for sensitive fields
export const saveFormData = async (formData: any, isDraft: boolean = false): Promise<number> => {
  const db = await initDB();
  const storeName = isDraft ? DRAFTS_STORE : FORMS_STORE;
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  
  // Ensure we have the minimum required data
  if (!formData) {
    throw new Error('No form data provided to save');
  }
  
  // Encrypt sensitive data
  const processedData = encryptSensitiveFields(formData);
  
  // Generate consistent ID if not present
  const id = formData.id || Date.now();
  const timestamp = new Date().toISOString();
  
  const dataToSave = {
    ...processedData,
    id: id,
    timestamp: timestamp,
    lastModified: timestamp,
    synced: false,
    status: isDraft ? 'draft' : 'completed',
    regionLabel: `${formData.regionCode || 'PTA'}-${isDraft ? 'DRAFT' : 'FORM'}-${id}`,
    submissionRegion: formData.regionCode || 'PTA',
    encrypted: true
  };

  return new Promise((resolve, reject) => {
    try {
      const request = store.put(dataToSave);

      request.onsuccess = () => {
        console.log(`${isDraft ? 'Draft' : 'Form'} data saved to IndexedDB for region: ${formData.regionCode || 'PTA'}`);
        resolve(request.result as number);
      };

      request.onerror = (event) => {
        console.error('IndexedDB save error:', event);
        reject(new Error(`Failed to save ${isDraft ? 'draft' : 'form'} data: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    } catch (error) {
      console.error('Unexpected error during save:', error);
      reject(error);
    }
  });
};

// Get all drafts for resume functionality
export const getAllDrafts = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([DRAFTS_STORE], 'readonly');
    const store = transaction.objectStore(DRAFTS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        const drafts = request.result.map(draft => {
          try {
            return decryptSensitiveFields(draft);
          } catch (decryptError) {
            console.warn('Failed to decrypt draft, returning as is:', decryptError);
            // Return the draft even if decryption fails
            return { ...draft, decryptionFailed: true };
          }
        });
        
        // Sort drafts by lastModified (newest first)
        drafts.sort((a, b) => {
          const dateA = new Date(a.lastModified || a.timestamp);
          const dateB = new Date(b.lastModified || b.timestamp);
          return dateB.getTime() - dateA.getTime();
        });
        
        resolve(drafts);
      };

      request.onerror = (event) => {
        console.error('IndexedDB get drafts error:', event);
        reject(new Error(`Failed to get drafts: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error('Unexpected error getting drafts:', error);
    throw error;
  }
};

// Delete draft after completion
export const deleteDraft = async (id: number): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([DRAFTS_STORE], 'readwrite');
    const store = transaction.objectStore(DRAFTS_STORE);
    
    return new Promise((resolve, reject) => {
      // First check if the draft exists
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        if (!getRequest.result) {
          reject(new Error(`Draft ${id} not found`));
          return;
        }
        
        const request = store.delete(id);
        
        request.onsuccess = () => {
          console.log(`Draft ${id} deleted`);
          resolve();
        };

        request.onerror = (event) => {
          console.error('IndexedDB delete error:', event);
          reject(new Error(`Failed to delete draft ${id}: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
        };
      };
      
      getRequest.onerror = (event) => {
        console.error('IndexedDB get draft error:', event);
        reject(new Error(`Failed to get draft ${id}: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error('Unexpected error deleting draft:', error);
    throw error;
  }
};

// Get all forms
export const getAllForms = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([FORMS_STORE], 'readonly');
    const store = transaction.objectStore(FORMS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error('IndexedDB get forms error:', event);
        reject(new Error(`Failed to get all forms: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error('Unexpected error getting forms:', error);
    throw error;
  }
};

// Get forms by region
export const getFormsByRegion = async (regionCode: string): Promise<any[]> => {
  try {
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

      request.onerror = (event) => {
        console.error('IndexedDB get forms by region error:', event);
        reject(new Error(`Failed to get forms for region ${regionCode}: ${(event.target as IDBRequest).error?.message || 'Unknown error'}`));
      };
    });
  } catch (error) {
    console.error('Unexpected error getting forms by region:', error);
    throw error;
  }
};

// Test IndexedDB connectivity - moved to databaseUtils.ts
export { testDBConnection } from './databaseUtils';
