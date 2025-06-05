
// Main IndexedDB utilities - re-exports from focused modules

// Re-export database initialization
export { initDB, DB_NAME, DB_VERSION, FORMS_STORE, DRAFTS_STORE } from './database';

// Re-export encryption utilities
export { encrypt, decrypt, encryptSensitiveFields, decryptSensitiveFields } from './encryption';

// Re-export form operations
export { 
  saveFormData, 
  getAllDrafts, 
  deleteDraft, 
  getAllForms, 
  getFormsByRegion 
} from './formOperations';

// Re-export sync operations
export { 
  getUnsyncedForms, 
  markFormAsSynced, 
  syncPendingForms, 
  clearSyncedForms 
} from './syncOperations';
