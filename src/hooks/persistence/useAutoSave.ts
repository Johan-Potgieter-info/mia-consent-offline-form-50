
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useHybridStorage } from '../useHybridStorage';
import { useFallbackStorage } from './useFallbackStorage';
import { useFormSession } from '../useFormSession';
import { FormData } from '../../types/formTypes';

interface UseAutoSaveProps {
  retryCount: number;
  setLastSaved: (date: Date) => void;
  setIsDirty: (isDirty: boolean) => void;
  setRetryCount: (fn: (prev: number) => number) => void;
}

export const useAutoSave = ({
  retryCount,
  setLastSaved,
  setIsDirty,
  setRetryCount
}: UseAutoSaveProps) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const { saveForm: saveToHybridStorage, capabilities } = useHybridStorage();
  const { saveToFallbackStorage } = useFallbackStorage();
  const { sessionId } = useFormSession();

  const autoSave = async (formData: FormData): Promise<void> => {
    if (!formData.patientName && !formData.idNumber && !formData.cellPhone) {
      console.log('Auto-save skipped: insufficient data to save');
      return;
    }

    console.log('Auto-save triggered for session ID:', sessionId);
    
    if (!capabilities.indexedDB) {
      console.log('Auto-save skipped: No IndexedDB available, trying fallback');
      const fallbackSuccess = saveToFallbackStorage({
        ...formData,
        status: 'draft',
        id: sessionId
      });
      if (fallbackSuccess) {
        setLastSaved(new Date());
        setIsDirty(false);
        setAutoSaveStatus('success');
      } else {
        setAutoSaveStatus('error');
      }
      return;
    }
    
    setAutoSaveStatus('saving');
    
    try {
      const autoSaveData = { 
        ...formData, 
        timestamp: new Date().toISOString(),
        autoSaved: true,
        status: 'draft',
        id: sessionId, // Use persistent session ID
        lastModified: new Date().toISOString()
      };
      
      await saveToHybridStorage(autoSaveData, true);
      
      setLastSaved(new Date());
      setIsDirty(false);
      setAutoSaveStatus('success');
      setRetryCount(() => 0);
      console.log('Auto-saved as draft successfully with session ID:', sessionId);
      
    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('error');
      setRetryCount(prev => prev + 1);
      
      const fallbackSuccess = saveToFallbackStorage({
        ...formData,
        status: 'draft',
        id: sessionId
      });
      if (fallbackSuccess) {
        setLastSaved(new Date());
        setIsDirty(false);
        setAutoSaveStatus('success');
        console.log('Auto-save failed but fallback succeeded');
      } else {
        console.error('Both auto-save and fallback failed');
        
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

  return { autoSave, autoSaveStatus };
};
