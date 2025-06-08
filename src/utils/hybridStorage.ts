
// Hybrid storage solution using Supabase as primary and IndexedDB as fallback

// Re-export everything from the modular files
export { 
  initializeStorage, 
  getStorageCapabilities, 
  updateStorageCapabilities,
  type StorageCapabilities 
} from './storage/capabilities';

export { 
  saveFormHybrid, 
  getFormsHybrid, 
  deleteFormHybrid, 
  deleteMultipleFormsHybrid 
} from './storage/formOperations';

export { syncToSupabase } from './storage/syncOperations';
