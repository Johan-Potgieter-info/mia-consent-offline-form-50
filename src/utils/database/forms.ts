
// Form-specific database operations

import { saveToIndexedDB, getAllFromIndexedDB } from './operations';
import { FORMS_STORE } from './config';
import { FormData } from '../../types/formTypes';

/**
 * Save form data to IndexedDB
 * @param formData Form data to save
 * @returns Promise with the saved object ID
 */
export const saveFormData = async (formData: FormData): Promise<number> => {
  return await saveToIndexedDB(formData, FORMS_STORE);
};

/**
 * Get all forms from IndexedDB
 * @returns Promise with all forms (decrypted)
 */
export const getAllForms = async (): Promise<any[]> => {
  return await getAllFromIndexedDB(FORMS_STORE);
};
