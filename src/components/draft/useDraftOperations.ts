
import { useState, useEffect } from 'react';
import { useHybridStorage } from '../../hooks/useHybridStorage';
import { useToast } from '@/hooks/use-toast';

export const useDraftOperations = (isOpen: boolean) => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { getForms, deleteForm, isInitialized } = useHybridStorage();

  useEffect(() => {
    if (isOpen && isInitialized) {
      loadDrafts();
    }
  }, [isOpen, isInitialized]);

  const loadDrafts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allDrafts = await getForms(true); // true for drafts
      setDrafts(allDrafts);
      console.log('Loaded drafts:', allDrafts.length);
    } catch (error) {
      console.error('Failed to load drafts:', error);
      setError('Could not load saved forms. Please try again.');
      toast({
        title: "Error Loading Drafts",
        description: "Could not load your saved forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteForm(draftId, true); // true for drafts
      toast({
        title: "Draft Deleted",
        description: "Form draft was successfully removed",
      });
      await loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the draft. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDoctorOptions = () => [
    { code: 'CPT', name: 'Cape Town', doctor: 'Dr. Soni' },
    { code: 'PTA', name: 'Pretoria', doctor: 'Dr. Vorster' },
    { code: 'JHB', name: 'Johannesburg', doctor: 'Dr. Essop' }
  ];

  const handleDoctorChange = (draft: any, newRegionCode: string) => {
    const doctorOptions = getDoctorOptions();
    const selectedOption = doctorOptions.find(option => option.code === newRegionCode);
    
    if (selectedOption) {
      const updatedDraft = {
        ...draft,
        regionCode: selectedOption.code,
        region: selectedOption.name,
        doctor: selectedOption.doctor
      };
      
      window.location.href = `/consent-form?draft=${encodeURIComponent(JSON.stringify(updatedDraft))}`;
    }
  };

  return {
    drafts,
    isLoading,
    error,
    loadDrafts,
    handleDeleteDraft,
    handleDoctorChange,
    formatDate,
    getDoctorOptions
  };
};
