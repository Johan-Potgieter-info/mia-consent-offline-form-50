
// Hook for managing hybrid storage operations

import { useState, useEffect } from 'react';
import { initializeStorage, getStorageCapabilities, saveFormHybrid, getFormsHybrid, deleteFormHybrid, syncToSupabase } from '../utils/hybridStorage';
import { useToast } from '@/hooks/use-toast';

interface UseHybridStorageResult {
  isInitialized: boolean;
  capabilities: {
    supabase: boolean;
    indexedDB: boolean;
  };
  saveForm: (formData: any, isDraft?: boolean) => Promise<any>;
  getForms: (isDraft?: boolean) => Promise<any[]>;
  deleteForm: (id: string | number, isDraft?: boolean) => Promise<void>;
  syncData: () => Promise<{ success: number; failed: number }>;
  isOnline: boolean;
}

export const useHybridStorage = (): UseHybridStorageResult => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [capabilities, setCapabilities] = useState({ supabase: false, indexedDB: false });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        const caps = await initializeStorage();
        setCapabilities(caps);
        setIsInitialized(true);
        
        if (!caps.supabase && !caps.indexedDB) {
          toast({
            title: "Storage Warning",
            description: "No storage methods available. Data may be lost.",
            variant: "destructive",
          });
        } else if (!caps.supabase) {
          toast({
            title: "Offline Mode",
            description: "Using local storage only. Data will sync when online.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Storage initialization failed:', error);
        toast({
          title: "Storage Error",
          description: "Failed to initialize storage systems.",
          variant: "destructive",
        });
      }
    };

    initialize();
  }, [toast]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      
      // Reinitialize storage to test Supabase connectivity
      const caps = await initializeStorage();
      setCapabilities(caps);
      
      if (caps.supabase) {
        toast({
          title: "Back Online",
          description: "Connected to cloud storage. Syncing data...",
        });
        
        try {
          const results = await syncData();
          if (results.success > 0) {
            toast({
              title: "Sync Complete",
              description: `Successfully synced ${results.success} items.`,
            });
          }
        } catch (error) {
          console.error('Auto-sync failed:', error);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setCapabilities(prev => ({ ...prev, supabase: false }));
      toast({
        title: "Offline Mode",
        description: "Using local storage only.",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const saveForm = async (formData: any, isDraft: boolean = false): Promise<any> => {
    try {
      const result = await saveFormHybrid(formData, isDraft);
      
      if (!capabilities.supabase && capabilities.indexedDB) {
        toast({
          title: "Saved Locally",
          description: "Data saved to local storage. Will sync when online.",
        });
      }
      
      return result;
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Unable to save form data.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getForms = async (isDraft: boolean = false): Promise<any[]> => {
    try {
      return await getFormsHybrid(isDraft);
    } catch (error) {
      console.error('Get forms failed:', error);
      toast({
        title: "Load Failed",
        description: "Unable to load form data.",
        variant: "destructive",
      });
      return [];
    }
  };

  const deleteForm = async (id: string | number, isDraft: boolean = false): Promise<void> => {
    try {
      await deleteFormHybrid(id, isDraft);
      toast({
        title: "Deleted",
        description: "Form deleted successfully.",
      });
    } catch (error) {
      console.error('Delete failed:', error);
      toast({
        title: "Delete Failed",
        description: "Unable to delete form.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const syncData = async (): Promise<{ success: number; failed: number }> => {
    try {
      return await syncToSupabase();
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Unable to sync data to cloud storage.",
        variant: "destructive",
      });
      return { success: 0, failed: 0 };
    }
  };

  return {
    isInitialized,
    capabilities,
    saveForm,
    getForms,
    deleteForm,
    syncData,
    isOnline
  };
};
