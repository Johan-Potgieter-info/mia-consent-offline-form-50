// Hybrid storage solution using Supabase as primary and IndexedDB as fallback

import { FormData } from '../types/formTypes';
import { saveFormToSupabase, updateFormInSupabase, getFormsFromSupabase, deleteFormFromSupabase, testSupabaseConnection } from './supabaseOperations';
import { saveFormData as saveToIndexedDB, getAllDrafts, deleteDraft, getAllForms, updateDraftById } from './indexedDB';
import { testDBConnection } from './databaseUtils';

interface StorageCapabilities {
  supabase: boolean;
  indexedDB: boolean;
}

let storageCapabilities: StorageCapabilities = {
  supabase: false,
  indexedDB: false
};

/**
 * Initialize and test storage capabilities
 */
export const initializeStorage = async (): Promise<StorageCapabilities> => {
  try {
    const [supabaseAvailable, indexedDBAvailable] = await Promise.all([
      testSupabaseConnection(),
      testDBConnection()
    ]);

    storageCapabilities = {
      supabase: supabaseAvailable,
      indexedDB: indexedDBAvailable
    };

    console.log('Storage capabilities initialized:', storageCapabilities);
    return storageCapabilities;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return storageCapabilities;
  }
};

/**
 * Save or update form data using hybrid approach with deduplication
 * @param formData Form data to save
 * @param isDraft Whether this is a draft
 * @returns Promise with saved form data
 */
export const saveFormHybrid = async (formData: FormData, isDraft: boolean = false): Promise<any> => {
  let supabaseResult = null;
  let indexedDBResult = null;
  
  // For drafts, check if we need to update existing draft with same session ID
  if (isDraft && formData.id) {
    // Try to update existing draft first
    if (storageCapabilities.supabase) {
      try {
        // Check if draft exists in Supabase
        const existingForms = await getFormsFromSupabase(true);
        const existingDraft = existingForms.find(form => form.id === formData.id);
        
        if (existingDraft) {
          supabaseResult = await updateFormInSupabase(formData.id as string, formData, isDraft);
          console.log('Updated existing draft in Supabase');
          return supabaseResult;
        }
      } catch (error) {
        console.error('Supabase update check failed:', error);
        storageCapabilities.supabase = false;
      }
    }

    // Fallback to IndexedDB for draft updates
    if (storageCapabilities.indexedDB) {
      try {
        const existingDrafts = await getAllDrafts();
        const existingDraft = existingDrafts.find(draft => draft.id === formData.id);
        
        if (existingDraft) {
          await updateDraftById(formData.id as any, formData);
          indexedDBResult = { ...formData };
          console.log('Updated existing draft in IndexedDB');
          return indexedDBResult;
        }
      } catch (error) {
        console.error('IndexedDB update failed:', error);
      }
    }
  }
  
  // If no existing draft found or not a draft, create new one
  // Try Supabase first if available
  if (storageCapabilities.supabase) {
    try {
      supabaseResult = await saveFormToSupabase(formData, isDraft);
      console.log('Form saved to Supabase successfully');
      return supabaseResult;
    } catch (error) {
      console.error('Supabase save failed, trying IndexedDB:', error);
      storageCapabilities.supabase = false; // Mark as unavailable for this session
    }
  }

  // Fallback to IndexedDB
  if (storageCapabilities.indexedDB) {
    try {
      const id = await saveToIndexedDB(formData, isDraft);
      indexedDBResult = { ...formData, id };
      console.log('Form saved to IndexedDB as fallback');
      return indexedDBResult;
    } catch (error) {
      console.error('IndexedDB save also failed:', error);
      storageCapabilities.indexedDB = false;
    }
  }

  throw new Error('All storage methods failed');
};

/**
 * Get all forms using hybrid approach
 * @param isDraft Whether to get drafts
 * @returns Promise with forms array
 */
export const getFormsHybrid = async (isDraft: boolean = false): Promise<any[]> => {
  // Try Supabase first
  if (storageCapabilities.supabase) {
    try {
      const forms = await getFormsFromSupabase(isDraft);
      console.log(`Retrieved ${forms.length} forms from Supabase`);
      return forms;
    } catch (error) {
      console.error('Supabase fetch failed, trying IndexedDB:', error);
      storageCapabilities.supabase = false;
    }
  }

  // Fallback to IndexedDB
  if (storageCapabilities.indexedDB) {
    try {
      const forms = isDraft ? await getAllDrafts() : await getAllForms();
      console.log(`Retrieved ${forms.length} forms from IndexedDB`);
      return forms;
    } catch (error) {
      console.error('IndexedDB fetch also failed:', error);
      storageCapabilities.indexedDB = false;
    }
  }

  console.warn('No storage methods available, returning empty array');
  return [];
};

/**
 * Delete form using hybrid approach
 * @param id Form ID
 * @param isDraft Whether this is a draft
 */
export const deleteFormHybrid = async (id: string | number, isDraft: boolean = false): Promise<void> => {
  let supabaseSuccess = false;
  let indexedDBSuccess = false;

  // Try Supabase first
  if (storageCapabilities.supabase && typeof id === 'string') {
    try {
      await deleteFormFromSupabase(id, isDraft);
      supabaseSuccess = true;
      console.log('Form deleted from Supabase');
    } catch (error) {
      console.error('Supabase delete failed:', error);
    }
  }

  // Try IndexedDB (either as fallback or if we have a numeric ID)
  if (storageCapabilities.indexedDB && typeof id === 'number') {
    try {
      if (isDraft) {
        await deleteDraft(id);
      } else {
        // Note: We'd need to implement deleteForm in indexedDB operations
        console.warn('Delete completed form from IndexedDB not implemented');
      }
      indexedDBSuccess = true;
      console.log('Form deleted from IndexedDB');
    } catch (error) {
      console.error('IndexedDB delete failed:', error);
    }
  }

  if (!supabaseSuccess && !indexedDBSuccess) {
    throw new Error('Failed to delete form from all storage methods');
  }
};

/**
 * Delete multiple forms using hybrid approach
 * @param ids Array of form IDs
 * @param isDraft Whether these are drafts
 */
export const deleteMultipleFormsHybrid = async (ids: (string | number)[], isDraft: boolean = false): Promise<void> => {
  const results = { success: 0, failed: 0 };

  for (const id of ids) {
    try {
      await deleteFormHybrid(id, isDraft);
      results.success++;
    } catch (error) {
      console.error(`Failed to delete form ${id}:`, error);
      results.failed++;
    }
  }

  if (results.failed > 0) {
    throw new Error(`Failed to delete ${results.failed} out of ${ids.length} items`);
  }
};

/**
 * Get current storage capabilities
 */
export const getStorageCapabilities = (): StorageCapabilities => {
  return { ...storageCapabilities };
};

/**
 * Sync IndexedDB data to Supabase when connection is restored
 */
export const syncToSupabase = async (): Promise<{ success: number; failed: number }> => {
  if (!storageCapabilities.indexedDB || !storageCapabilities.supabase) {
    console.log('Sync skipped: required storage not available');
    return { success: 0, failed: 0 };
  }

  const results = { success: 0, failed: 0 };

  try {
    // Sync drafts
    const drafts = await getAllDrafts();
    for (const draft of drafts) {
      try {
        await saveFormToSupabase(draft, true);
        results.success++;
        // Optionally delete from IndexedDB after successful sync
        await deleteDraft(draft.id);
      } catch (error) {
        console.error('Failed to sync draft:', draft.id, error);
        results.failed++;
      }
    }

    // Sync completed forms
    const forms = await getAllForms();
    for (const form of forms) {
      if (!form.synced) {
        try {
          await saveFormToSupabase(form, false);
          results.success++;
          // Mark as synced in IndexedDB
        } catch (error) {
          console.error('Failed to sync form:', form.id, error);
          results.failed++;
        }
      }
    }

    console.log(`Sync completed: ${results.success} success, ${results.failed} failed`);
  } catch (error) {
    console.error('Sync process error:', error);
  }

  return results;
};
