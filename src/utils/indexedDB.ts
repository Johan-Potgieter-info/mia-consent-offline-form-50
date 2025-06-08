
// IndexedDB operations - Main entry point

// Re-export everything from the modular files
export { DB_NAME, DB_VERSION, FORMS_STORE, DRAFTS_STORE } from './database/config';
export { initDB } from './database/initialization';
export { saveFormData, getAllForms } from './database/forms';
export { saveDraftData, getAllDrafts, deleteDraft, updateDraftById } from './database/drafts';
export { syncPendingForms } from './database/sync';

// Legacy exports for backward compatibility
export const saveFormData as saveFormDataLegacy = async (formData: any, isDraft: boolean = false): Promise<number> => {
  if (isDraft) {
    const { saveDraftData } = await import('./database/drafts');
    return await saveDraftData(formData);
  } else {
    const { saveFormData } = await import('./database/forms');
    return await saveFormData(formData);
  }
};
