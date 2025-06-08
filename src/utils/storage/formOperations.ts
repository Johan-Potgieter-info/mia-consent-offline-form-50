
// Hybrid storage form operations

import { FormData } from '../../types/formTypes';
import { saveFormToSupabase, updateFormInSupabase, getFormsFromSupabase, deleteFormFromSupabase } from '../supabaseOperations';
import { saveDraftData, getAllDrafts, deleteDraft, getAllForms, updateDraftById, saveFormData } from '../indexedDB';
import { getStorageCapabilities, updateStorageCapabilities } from './capabilities';

/**
 * Save or update form data using hybrid approach with deduplication
 * @param formData Form data to save
 * @param isDraft Whether this is a draft
 * @returns Promise with saved form data
 */
export const saveFormHybrid = async (formData: FormData, isDraft: boolean = false): Promise<any> => {
  const capabilities = getStorageCapabilities();
  let supabaseResult = null;
  let indexedDBResult = null;
  
  // For drafts, check if we need to update existing draft with same session ID
  if (isDraft && formData.id) {
    // Try to update existing draft first
    if (capabilities.supabase) {
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
        updateStorageCapabilities({ supabase: false });
      }
    }

    // Fallback to IndexedDB for draft updates
    if (capabilities.indexedDB) {
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
  if (capabilities.supabase) {
    try {
      supabaseResult = await saveFormToSupabase(formData, isDraft);
      console.log('Form saved to Supabase successfully');
      return supabaseResult;
    } catch (error) {
      console.error('Supabase save failed, trying IndexedDB:', error);
      updateStorageCapabilities({ supabase: false }); // Mark as unavailable for this session
    }
  }

  // Fallback to IndexedDB
  if (capabilities.indexedDB) {
    try {
      const id = isDraft ? await saveDraftData(formData) : await saveFormData(formData);
      indexedDBResult = { ...formData, id };
      console.log('Form saved to IndexedDB as fallback');
      return indexedDBResult;
    } catch (error) {
      console.error('IndexedDB save also failed:', error);
      updateStorageCapabilities({ indexedDB: false });
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
  const capabilities = getStorageCapabilities();
  
  // Try Supabase first
  if (capabilities.supabase) {
    try {
      const forms = await getFormsFromSupabase(isDraft);
      console.log(`Retrieved ${forms.length} forms from Supabase`);
      return forms;
    } catch (error) {
      console.error('Supabase fetch failed, trying IndexedDB:', error);
      updateStorageCapabilities({ supabase: false });
    }
  }

  // Fallback to IndexedDB
  if (capabilities.indexedDB) {
    try {
      const forms = isDraft ? await getAllDrafts() : await getAllForms();
      console.log(`Retrieved ${forms.length} forms from IndexedDB`);
      return forms;
    } catch (error) {
      console.error('IndexedDB fetch also failed:', error);
      updateStorageCapabilities({ indexedDB: false });
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
  const capabilities = getStorageCapabilities();
  let supabaseSuccess = false;
  let indexedDBSuccess = false;

  // Try Supabase first
  if (capabilities.supabase && typeof id === 'string') {
    try {
      await deleteFormFromSupabase(id, isDraft);
      supabaseSuccess = true;
      console.log('Form deleted from Supabase');
    } catch (error) {
      console.error('Supabase delete failed:', error);
    }
  }

  // Try IndexedDB (either as fallback or if we have a numeric ID)
  if (capabilities.indexedDB && typeof id === 'number') {
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
