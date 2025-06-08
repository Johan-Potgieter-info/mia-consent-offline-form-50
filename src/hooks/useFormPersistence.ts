
import { useState } from 'react';
import { useManualSave } from './persistence/useManualSave';
import { useAutoSave } from './persistence/useAutoSave';
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
  justSaved: boolean;
  resetJustSaved: () => void;
}

export const useFormPersistence = ({ 
  isOnline 
}: UseFormPersistenceProps): UseFormPersistenceResult => {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [justSaved, setJustSaved] = useState(false);

  const resetJustSaved = () => {
    setJustSaved(false);
  };

  const { saveForm } = useManualSave({
    isOnline,
    setLastSaved,
    setIsDirty,
    setJustSaved,
    setRetryCount
  });

  const { autoSave, autoSaveStatus } = useAutoSave({
    retryCount,
    setLastSaved,
    setIsDirty,
    setRetryCount
  });

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
    justSaved,
    resetJustSaved,
  };
};
