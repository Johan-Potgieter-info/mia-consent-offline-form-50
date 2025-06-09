
import { useEffect, useRef } from 'react';
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
  justSaved: boolean;
  resetJustSaved: () => void;
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
    retryCount,
    justSaved,
    resetJustSaved
  } = useFormPersistence({ isOnline });
  const { submitForm: submitFormSubmission } = useFormSubmission({ isOnline });

  // Refs to prevent excessive auto-saves on mobile
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAutoSaveDataRef = useRef<string>('');
  const isAutoSavingRef = useRef(false);

  // Enhanced auto-save with better mobile optimization
  useEffect(() => {
    if (!isInitialized || !isDirty || Object.keys(formData).length === 0) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Check if form data actually changed to prevent duplicate saves
    const currentDataString = JSON.stringify(formData);
    if (currentDataString === lastAutoSaveDataRef.current || isAutoSavingRef.current) {
      return;
    }

    // Set a longer delay for mobile to prevent excessive saves
    const autoSaveDelay = 45000; // 45 seconds instead of 30

    autoSaveTimeoutRef.current = setTimeout(async () => {
      if (isDirty && !isAutoSavingRef.current) {
        console.log('Auto-save triggered - saving as DRAFT', { 
          capabilities, 
          isDirty, 
          hasData: Object.keys(formData).length > 0,
          autoSaveStatus 
        });
        
        isAutoSavingRef.current = true;
        lastAutoSaveDataRef.current = currentDataString;
        
        try {
          await autoSave(formData);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          isAutoSavingRef.current = false;
        }
      }
    }, autoSaveDelay);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isAutoSavingRef.current) {
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
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [isDirty, formData, capabilities, autoSave, autoSaveStatus, isInitialized]);

  // Save button handler - ALWAYS saves as draft
  const handleSaveForm = async () => {
    if (isAutoSavingRef.current) {
      console.log('Manual save skipped - auto-save in progress');
      return;
    }
    
    const savedId = await savePersistence(formData);
    if (savedId) {
      console.log('Form saved as draft with ID:', savedId);
      lastAutoSaveDataRef.current = JSON.stringify(formData);
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
    retryCount,
    justSaved,
    resetJustSaved
  };
};
