
// Draft-specific database operations

import { saveToIndexedDB, getAllFromIndexedDB, deleteFromIndexedDB, updateInIndexedDB } from './operations';
import { DRAFTS_STORE } from './config';
import { FormData } from '../../types/formTypes';

/**
 * Save draft form data to IndexedDB
 * @param formData Form data to save as draft
 * @returns Promise with the saved object ID
 */
export const saveDraftData = async (formData: FormData): Promise<number> => {
  return await saveToIndexedDB(formData, DRAFTS_STORE);
};

/**
 * Get all drafts from IndexedDB
 * @returns Promise with all drafts (decrypted and sorted)
 */
export const getAllDrafts = async (): Promise<any[]> => {
  const drafts = await getAllFromIndexedDB(DRAFTS_STORE);
  
  // Sort drafts by lastModified (newest first)
  return drafts.sort((a, b) => {
    const dateA = new Date(a.lastModified || a.timestamp);
    const dateB = new Date(b.lastModified || b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
};

/**
 * Delete a draft from IndexedDB
 * @param id Draft ID to delete
 * @returns Promise that resolves when draft is deleted
 */
export const deleteDraft = async (id: number): Promise<void> => {
  return await deleteFromIndexedDB(id, DRAFTS_STORE);
};

/**
 * Update an existing draft by ID
 * @param id Draft ID to update
 * @param formData Updated form data
 * @returns Promise that resolves when draft is updated
 */
export const updateDraftById = async (id: number | string, formData: FormData): Promise<void> => {
  return await updateInIndexedDB(id, formData, DRAFTS_STORE);
};
