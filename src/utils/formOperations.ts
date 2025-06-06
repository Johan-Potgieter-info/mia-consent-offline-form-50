
// Form data operations for drafts and completed forms

import { saveCompletedForm, getAllForms, getFormsByRegion } from './formStorage';
import { saveDraftForm, getAllDrafts, deleteDraft } from './draftOperations';
import { FormData } from '../types/formTypes';

/**
 * Save form data - as either draft or completed form
 * @param formData Form data to save
 * @param isDraft Whether this is a draft or completed form
 * @returns Promise with saved ID
 */
export const saveFormData = async (formData: FormData, isDraft: boolean = false): Promise<number> => {
  try {
    // Ensure we have the minimum required data
    if (!formData) {
      throw new Error('No form data provided to save');
    }
    
    if (isDraft) {
      return await saveDraftForm(formData);
    } else {
      return await saveCompletedForm(formData);
    }
  } catch (error) {
    console.error('Unexpected error during save:', error);
    throw error;
  }
};

// Re-export functions from the new modules
export { 
  getAllForms,
  getFormsByRegion,
  getAllDrafts,
  deleteDraft 
};

// Test IndexedDB connectivity - from databaseUtils.ts
export { testDBConnection } from './databaseUtils';
