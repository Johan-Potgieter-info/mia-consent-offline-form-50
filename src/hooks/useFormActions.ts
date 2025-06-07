
import { useEffect } from 'react';
import { useFormPersistence } from './useFormPersistence';
import { useFormSubmission } from './useFormSubmission';
import { useRegionDetection } from './useRegionDetection';
import { useHybridStorage } from './useHybridStorage';
import { FormData } from '../types/formTypes';

interface UseFormActionsProps {
  formData: FormData;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  isOnline: boolean;
}

interface UseFormActionsResult {
  saveForm: () => Promise<void>;
  submitForm: () => Promise<void>;
  lastSaved: Date | null;
  formatLastSaved: () => string;
  autoSaveStatus: 'idle' | 'saving' | 'success' | 'error';
  retryCount: number;
}

export const useFormActions = ({ 
  formData, 
  isDirty, 
  setIsDirty, 
  isOnline 
}: UseFormActionsProps): UseFormActionsResult => {
  const { currentRegion } = useRegionDetection();
  const { capabilities, isInitialized } = useHybridStorage();
  const { 
    lastSaved, 
    saveForm: savePersistence, 
    autoSave, 
    formatLastSaved,
    autoSaveStatus,
    retryCount
  } = useFormPersistence({ isOnline });
  const { submitForm: submitFormSubmission } = useFormSubmission({ isOnline });

  // Enhanced auto-save with better error handling
  useEffect(() => {
    if (!isInitialized) return;

    const autoSaveInterval = setInterval(() => {
      if (isDirty && Object.keys(formData).length > 0) {
        console.log('Auto-save triggered', { 
          capabilities, 
          isDirty, 
          hasData: Object.keys(formData).length > 0,
          autoSaveStatus 
        });
        autoSave(formData);
      }
    }, 30000); // Auto-save every 30 seconds

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Try emergency save
        if (capabilities.supabase || capabilities.indexedDB || window.localStorage) {
          try {
            if (capabilities.supabase || capabilities.indexedDB) {
              // Quick emergency save attempt
              autoSave(formData);
            } else {
              // Emergency localStorage save
              localStorage.setItem('emergencyFormDraft', JSON.stringify({
                ...formData,
                timestamp: new Date().toISOString(),
                emergency: true
              }));
            }
          } catch (error) {
            console.error('Emergency save failed:', error);
          }
        }
        
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(autoSaveInterval);
    };
  }, [isDirty, formData, capabilities, autoSave, autoSaveStatus, isInitialized]);

  const handleSaveForm = async () => {
    const savedId = await savePersistence(formData);
    if (savedId) {
      // Update formData with the saved ID if needed
      console.log('Form saved with ID:', savedId);
    }
  };

  const handleSubmitForm = async () => {
    await submitFormSubmission(formData, currentRegion, false);
  };

  return {
    saveForm: handleSaveForm,
    submitForm: handleSubmitForm,
    lastSaved,
    formatLastSaved,
    autoSaveStatus,
    retryCount
  };
};
