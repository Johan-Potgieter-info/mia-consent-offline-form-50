
import { useState } from 'react';
import { saveFormData, deleteDraft } from '../utils/indexedDB';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types/formTypes';

interface UseFormPersistenceProps {
  dbInitialized: boolean;
  isOnline: boolean;
}

interface UseFormPersistenceResult {
  lastSaved: Date | null;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  saveForm: (formData: FormData) => Promise<number | undefined>;
  autoSave: (formData: FormData) => Promise<void>;
  formatLastSaved: () => string;
}

export const useFormPersistence = ({ 
  dbInitialized, 
  isOnline 
}: UseFormPersistenceProps): UseFormPersistenceResult => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  const saveForm = async (formData: FormData): Promise<number | undefined> => {
    if (!dbInitialized) {
      toast({
        title: "Storage Unavailable",
        description: "Cannot save form: local storage is not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const savedId = await saveFormData({ ...formData, timestamp: new Date().toISOString() }, true);
      setLastSaved(new Date());
      setIsDirty(false);
      toast({
        title: "Form Saved",
        description: "Your progress has been saved locally.",
      });
      return savedId;
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save form data.",
        variant: "destructive",
      });
      console.error('Save error:', error);
    }
  };

  const autoSave = async (formData: FormData): Promise<void> => {
    if (!dbInitialized) {
      console.log('Auto-save skipped: IndexedDB not available');
      return;
    }
    
    try {
      const savedId = await saveFormData({ ...formData, timestamp: new Date().toISOString() }, true);
      setLastSaved(new Date());
      setIsDirty(false);
      console.log('Auto-saved draft', savedId);
    } catch (error) {
      console.error('Auto-save failed:', error);
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
  };
};
