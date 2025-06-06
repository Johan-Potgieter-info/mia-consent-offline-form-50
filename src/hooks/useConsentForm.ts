
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { testDBConnection } from '../utils/databaseUtils';
import { REGIONS } from '../utils/regionDetection';
import { useToast } from '@/hooks/use-toast';
import { useConnectivity } from './useConnectivity';
import { useRegionDetection } from './useRegionDetection';
import { useFormPersistence } from './useFormPersistence';
import { useFormSubmission } from './useFormSubmission';
import { FormData } from '../types/formTypes';

export const useConsentForm = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState('patientDetails');
  const [formData, setFormData] = useState<FormData>({});
  const [isResuming, setIsResuming] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const { toast } = useToast();

  // Custom hooks
  const { isOnline } = useConnectivity();
  const { 
    currentRegion, 
    regionDetected, 
    regionDetectionComplete,
    detectAndSetRegion 
  } = useRegionDetection();
  const { 
    lastSaved, 
    isDirty, 
    setIsDirty, 
    saveForm, 
    autoSave, 
    formatLastSaved 
  } = useFormPersistence({ dbInitialized, isOnline });
  const { submitForm } = useFormSubmission({ dbInitialized, isOnline });

  // Check IndexedDB on mount
  useEffect(() => {
    const checkDB = async () => {
      const isAvailable = await testDBConnection();
      setDbInitialized(isAvailable);
      
      if (!isAvailable) {
        toast({
          title: "Storage Unavailable",
          description: "Local storage is not available. Your form progress won't be saved.",
          variant: "destructive",
          duration: 6000,
        });
      }
    };
    
    checkDB();
  }, [toast]);

  useEffect(() => {
    // Initialize form only once
    if (!regionDetectionComplete) {
      initializeForm();
    }
  }, [regionDetectionComplete]);

  // Separate effect for auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (autoSaveEnabled && isDirty && Object.keys(formData).length > 0 && dbInitialized) {
        autoSave(formData);
      }
    }, 30000); // Auto-save every 30 seconds

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(autoSaveInterval);
    };
  }, [autoSaveEnabled, isDirty, formData, dbInitialized, autoSave]);

  const initializeForm = async () => {
    if (regionDetectionComplete) return;
    
    try {
      // Check for draft in URL query param first (from direct link)
      const draftParam = searchParams.get('draft');
      if (draftParam) {
        try {
          const parsedDraft = JSON.parse(decodeURIComponent(draftParam));
          resumeDraftHandler(parsedDraft);
          return;
        } catch (error) {
          console.error('Failed to parse draft from URL:', error);
          toast({
            title: "Error Resuming Draft",
            description: "Invalid draft data in URL",
            variant: "destructive",
          });
        }
      }
      
      // Then check for draft in location state (from ResumeDraftDialog)
      const resumeDraftFromState = location.state?.resumeDraft;
      if (resumeDraftFromState) {
        resumeDraftHandler(resumeDraftFromState);
        return;
      }
      
      // No draft found, detect region for new form
      const region = await detectAndSetRegion();
      
      // Automatically update form data with region information
      setFormData(prev => ({
        ...prev,
        region: region.name,
        regionCode: region.code,
        doctor: region.doctor,
        practiceNumber: region.practiceNumber
      }));
      
    } catch (error) {
      console.error('Form initialization error:', error);
      toast({
        title: "Form Initialization Error",
        description: "Failed to initialize form. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const resumeDraftHandler = (draft: FormData) => {
    setIsResuming(true);
    setFormData(draft);
    
    // Set region from draft
    const region = REGIONS[draft.regionCode as keyof typeof REGIONS] || REGIONS.PTA;
    
    toast({
      title: "Draft Resumed",
      description: `Continuing form for ${draft.patientName || 'patient'}`,
    });
    
    setIsResuming(false);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = (prev[name] as string[]) || [];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      }
    });
    setIsDirty(true);
  };

  const handleSaveForm = async () => {
    const savedId = await saveForm(formData);
    if (savedId) {
      setFormData(prev => ({ ...prev, id: savedId }));
    }
  };

  const handleSubmitForm = async () => {
    await submitForm(formData, currentRegion, isResuming);
  };

  return {
    activeSection,
    setActiveSection,
    formData,
    handleInputChange,
    handleCheckboxChange,
    saveForm: handleSaveForm,
    submitForm: handleSubmitForm,
    isOnline,
    currentRegion,
    regionDetected,
    isResuming,
    lastSaved,
    isDirty,
    formatLastSaved,
    dbInitialized
  };
};
