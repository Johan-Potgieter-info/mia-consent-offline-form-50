
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useHybridStorage } from '../useHybridStorage';
import { useFallbackStorage } from './useFallbackStorage';
import { FormData } from '../../types/formTypes';

interface UseManualSaveProps {
  isOnline: boolean;
  setLastSaved: (date: Date) => void;
  setIsDirty: (isDirty: boolean) => void;
  setJustSaved: (justSaved: boolean) => void;
  setRetryCount: (count: number) => void;
}

export const useManualSave = ({
  isOnline,
  setLastSaved,
  setIsDirty,
  setJustSaved,
  setRetryCount
}: UseManualSaveProps) => {
  const { toast } = useToast();
  const { saveForm: saveToHybridStorage, capabilities } = useHybridStorage();
  const { saveToFallbackStorage } = useFallbackStorage();

  const saveForm = async (formData: FormData): Promise<string | number | undefined> => {
    console.log('Manual save triggered - saving as DRAFT only', { id: formData.id });
    
    const draftData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'draft',
      id: formData.id || Date.now()
    };
    
    if (!capabilities.indexedDB) {
      const fallbackSuccess = saveToFallbackStorage(draftData);
      if (fallbackSuccess) {
        toast({
          title: "Draft Saved",
          description: isOnline ? "Form saved as draft to browser storage" : "Form saved as draft locally (offline)",
          variant: "default",
        });
        setLastSaved(new Date());
        setIsDirty(false);
        setJustSaved(true);
        return draftData.id;
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
      const result = await saveToHybridStorage(draftData, true);
      setLastSaved(new Date());
      setIsDirty(false);
      setJustSaved(true);
      setRetryCount(0);
      
      toast({
        title: "Draft Saved",
        description: isOnline ? "Form saved as draft locally - not submitted to cloud" : "Form saved as draft locally (offline)",
      });
      
      console.log('Manual save completed with ID:', result?.id || result);
      return result?.id || result;
    } catch (error) {
      console.error('Manual save error:', error);
      
      const fallbackSuccess = saveToFallbackStorage(draftData);
      if (fallbackSuccess) {
        toast({
          title: "Draft Saved",
          description: "Saved as draft to browser backup",
          variant: "default",
        });
        setLastSaved(new Date());
        setIsDirty(false);
        setJustSaved(true);
        return draftData.id;
      }
      
      toast({
        title: "Save Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { saveForm };
};
