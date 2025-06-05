
// Form data operations for drafts and completed forms

import { initDB, FORMS_STORE, DRAFTS_STORE } from './database';
import { encryptSensitiveFields, decryptSensitiveFields } from './encryption';

// Save form data with encryption for sensitive fields
export const saveFormData = async (formData: any, isDraft: boolean = false): Promise<number> => {
  const db = await initDB();
  const storeName = isDraft ? DRAFTS_STORE : FORMS_STORE;
  const transaction = db.transaction([storeName], 'readwrite');
  const store = transaction.objectStore(storeName);
  
  // Encrypt sensitive data
  const processedData = encryptSensitiveFields(formData);
  
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
      const drafts = request.result.map(draft => decryptSensitiveFields(draft));
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

// Get all forms
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

// Get forms by region
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
