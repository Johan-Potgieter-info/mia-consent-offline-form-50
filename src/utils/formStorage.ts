
// Form-specific storage operations

import { FORMS_STORE } from './database';
import { saveToStore, getAllFromStore, filterFromStore, decryptItems } from './databaseOperations';
import { FormData } from '../types/formTypes';

/**
 * Save completed form data
 * @param formData Form data to save
 * @returns Promise with saved form ID
 */
export const saveCompletedForm = async (formData: FormData): Promise<number> => {
  const formMetadata = {
    synced: false,
    status: 'completed',
    regionLabel: `${formData.regionCode || 'PTA'}-FORM-${formData.id || Date.now()}`,
    submissionRegion: formData.regionCode || 'PTA',
  };
  
  const savedId = await saveToStore(FORMS_STORE, formData, formMetadata);
  
  console.log(`Form data saved to IndexedDB for region: ${formData.regionCode || 'PTA'}`);
  return savedId;
};

/**
 * Get all completed forms
 * @returns Promise with all form data
 */
export const getAllForms = async (): Promise<any[]> => {
  return await getAllFromStore(FORMS_STORE);
};

/**
 * Get forms filtered by region code
 * @param regionCode Region code to filter by
 * @returns Promise with filtered forms
 */
export const getFormsByRegion = async (regionCode: string): Promise<any[]> => {
  const predicate = (form: any) => 
    form.regionCode === regionCode || 
    (!form.regionCode && regionCode === 'PTA');
  
  return await filterFromStore(FORMS_STORE, predicate);
};

/**
 * Sort forms by date (newest first)
 * @param forms Array of form data
 * @returns Sorted array
 */
export const sortFormsByDate = (forms: any[]): any[] => {
  return forms.sort((a, b) => {
    const dateA = new Date(a.lastModified || a.timestamp);
    const dateB = new Date(b.lastModified || b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};
