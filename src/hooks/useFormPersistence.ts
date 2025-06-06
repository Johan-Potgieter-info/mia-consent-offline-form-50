
import { useState } from 'react';
import { useHybridStorage } from './useHybridStorage';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types/formTypes';

interface UseFormPersistenceProps {
  isOnline: boolean;
}

interface UseFormPersistenceResult {
  lastSaved: Date | null;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  saveForm: (formData: FormData) => Promise<string | number | undefined>;
  autoSave: (formData: FormData) => Promise<void>;
  formatLastSaved: () => string;
  autoSaveStatus: 'idle' | 'saving' | 'success' | 'error';
  retryCount: number;
}

export const useFormPersistence = ({ 
  isOnline 
}: UseFormPersistenceProps): UseFormPersistenceResult => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const { saveForm: saveToHybridStorage, capabilities } = useHybridStorage();

  const saveToFallbackStorage = (formData: FormData) => {
    try {
      const dataToStore = {
        ...formData,
        timestamp: new Date().toISOString(),
        fallbackStorage: true
      };
      localStorage.setItem('formDraftFallback', JSON.stringify(dataToStore));
      console.log('Saved to localStorage fallback');
      return true;
    } catch (error) {
      console.error('Fallback storage failed:', error);
      try {
        sessionStorage.setItem('formDraftSession', JSON.stringify(formData));
        console.log('Saved to sessionStorage as last resort');
        return true;
      } catch (sessionError) {
        console.error('Session storage also failed:', sessionError);
        return false;
      }
    }
  };

  const saveForm = async (formData: FormData): Promise<string | number | undefined> => {
    console.log('Manual save triggered', { capabilities, dataKeys: Object.keys(formData) });
    
    if (!capabilities.supabase && !capabilities.indexedDB) {
      const fallbackSuccess = saveToFallbackStorage(formData);
      if (fallbackSuccess) {
        toast({
          title: "Saved to Browser Storage",
          description: "Database unavailable - saved locally instead",
          variant: "default",
        });
        setLastSaved(new Date());
        setIsDirty(false);
        return Date.now();
      } else {
        toast({
          title: "Save Failed",
          description: "Unable to save form data - please copy important information",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      const result = await saveToHybridStorage({ ...formData, timestamp: new Date().toISOString() }, true);
      setLastSaved(new Date());
      setIsDirty(false);
      setRetryCount(0);
      toast({
        title: "Form Saved",
        description: capabilities.supabase ? "Saved to cloud storage" : "Saved locally - will sync when online",
      });
      return result?.id || result;
    } catch (error) {
      console.error('Manual save error:', error);
      
      // Try fallback storage on manual save failure
      const fallbackSuccess = saveToFallbackStorage(formData);
      if (fallbackSuccess) {
        toast({
          title: "Saved to Browser Storage",
          description: "Primary storage failed - saved to browser backup",
          variant: "default",
        });
        setLastSaved(new Date());
        setIsDirty(false);
        return Date.now();
      }
      
      toast({
        title: "Save Error",
        description: "Failed to save form data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const autoSave = async (formData: FormData): Promise<void> => {
    if (!capabilities.supabase && !capabilities.indexedDB) {
      console.log('Auto-save skipped: No storage available, trying fallback');
      const fallbackSuccess = saveToFallbackStorage(formData);
      if (fallbackSuccess) {
        setLastSaved(new Date());
        setIsDirty(false);
        setAutoSaveStatus('success');
      } else {
        setAutoSaveStatus('error');
      }
      return;
    }

    // Don't auto-save if we don't have essential data
    if (!formData.patientName && !formData.idNumber && !formData.cellPhone) {
      console.log('Auto-save skipped: insufficient data to save');
      return;
    }
    
    setAutoSaveStatus('saving');
    
    try {
      await saveToHybridStorage({ 
        ...formData, 
        timestamp: new Date().toISOString(),
        autoSaved: true 
      }, true);
      
      setLastSaved(new Date());
      setIsDirty(false);
      setAutoSaveStatus('success');
      setRetryCount(0);
      console.log('Auto-saved draft successfully');
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      setRetryCount(prev => prev + 1);
      
      // Try fallback on auto-save failure
      const fallbackSuccess = saveToFallbackStorage(formData);
      if (fallbackSuccess) {
        setLastSaved(new Date());
        setIsDirty(false);
        setAutoSaveStatus('success');
        console.log('Auto-save failed but fallback succeeded');
      } else {
        console.error('Both auto-save and fallback failed');
        
        // Show error toast only after multiple failures
        if (retryCount >= 2) {
          toast({
            title: "Auto-save Issues",
            description: "Having trouble saving automatically. Please save manually.",
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    }
  };

  const formatLastSaved = (): string => {
    if (!lastSaved) return '';
    return lastSaved.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return {
    lastSaved,
    isDirty,
    setIsDirty,
    saveForm,
    autoSave,
    formatLastSaved,
    autoSaveStatus,
    retryCount,
  };
};
