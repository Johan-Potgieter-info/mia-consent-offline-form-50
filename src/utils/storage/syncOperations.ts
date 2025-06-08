
// Sync operations for hybrid storage

import { saveFormToSupabase } from '../supabaseOperations';
import { getAllDrafts, getAllForms, deleteDraft } from '../indexedDB';
import { getStorageCapabilities } from './capabilities';

/**
 * Sync IndexedDB data to Supabase when connection is restored
 */
export const syncToSupabase = async (): Promise<{ success: number; failed: number }> => {
  const capabilities = getStorageCapabilities();
  
  if (!capabilities.indexedDB || !capabilities.supabase) {
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
