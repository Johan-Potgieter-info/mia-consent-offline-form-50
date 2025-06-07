
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

  // Enhanced auto-save with better error handling - SAVES AS DRAFT ONLY
  useEffect(() => {
    if (!isInitialized) return;

    const autoSaveInterval = setInterval(() => {
      if (isDirty && Object.keys(formData).length > 0) {
        console.log('Auto-save triggered - saving as DRAFT', { 
          capabilities, 
          isDirty, 
          hasData: Object.keys(formData).length > 0,
          autoSaveStatus 
        });
        autoSave(formData); // This saves as draft only
      }
    }, 30000); // Auto-save every 30 seconds

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Try emergency save as draft
        if (capabilities.indexedDB || window.localStorage) {
          try {
            if (capabilities.indexedDB) {
              // Quick emergency save attempt as draft
              autoSave(formData);
            } else {
              // Emergency localStorage save as draft
              localStorage.setItem('emergencyFormDraft', JSON.stringify({
                ...formData,
                timestamp: new Date().toISOString(),
                emergency: true,
                status: 'draft'
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

  // Save button handler - ALWAYS saves as draft
  const handleSaveForm = async () => {
    const savedId = await savePersistence(formData); // This saves as draft only
    if (savedId) {
      console.log('Form saved as draft with ID:', savedId);
    }
  };

  // Submit button handler - saves as completed form to cloud
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
