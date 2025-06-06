
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { testDBConnection, getBrowserInfo, checkStorageQuota } from '../utils/databaseUtils';
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
    formatLastSaved,
    autoSaveStatus,
    retryCount
  } = useFormPersistence({ dbInitialized, isOnline });
  const { submitForm } = useFormSubmission({ dbInitialized, isOnline });

  // Enhanced IndexedDB initialization with better error handling
  useEffect(() => {
    const initializeStorage = async () => {
      console.log('Initializing storage system...');
      
      // Get browser info for debugging
      getBrowserInfo();
      await checkStorageQuota();
      
      const isAvailable = await testDBConnection();
      setDbInitialized(isAvailable);
      
      if (!isAvailable) {
        console.warn('IndexedDB unavailable, will use fallback storage');
        toast({
          title: "Storage Notice",
          description: "Using browser fallback storage. Your data will still be saved locally.",
          variant: "default",
          duration: 8000,
        });
      } else {
        console.log('IndexedDB initialized successfully');
      }
    };
    
    initializeStorage();
  }, [toast]);

  useEffect(() => {
    // Initialize form only once
    if (!regionDetectionComplete) {
      initializeForm();
    }
  }, [regionDetectionComplete]);

  // Enhanced auto-save with better error handling
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      if (isDirty && Object.keys(formData).length > 0) {
        console.log('Auto-save triggered', { 
          dbInitialized, 
          isDirty, 
          hasData: Object.keys(formData).length > 0,
          autoSaveStatus 
        });
        autoSave(formData);
      }
    }, 30000); // Auto-save every 30 seconds

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Try emergency save
        if (dbInitialized || window.localStorage) {
          try {
            if (dbInitialized) {
              // Quick emergency save attempt
              autoSave(formData);
            } else {
              // Emergency localStorage save
              localStorage.setItem('emergencyFormDraft', JSON.stringify({
                ...formData,
                timestamp: new Date().toISOString(),
                emergency: true
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
  }, [autoSaveEnabled, isDirty, formData, dbInitialized, autoSave, autoSaveStatus]);

  const initializeForm = async () => {
    if (regionDetectionComplete) return;
    
    try {
      // Check for emergency recovery first
      const emergencyDraft = localStorage.getItem('emergencyFormDraft');
      if (emergencyDraft) {
        try {
          const parsedEmergency = JSON.parse(emergencyDraft);
          console.log('Found emergency draft, recovering...');
          setFormData(parsedEmergency);
          localStorage.removeItem('emergencyFormDraft');
          toast({
            title: "Form Recovered",
            description: "Recovered your form from an unexpected closure",
          });
          return;
        } catch (error) {
          console.error('Failed to parse emergency draft:', error);
          localStorage.removeItem('emergencyFormDraft');
        }
      }

      // Check for draft in URL query param first
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
      
      // Check for draft in location state
      const resumeDraftFromState = location.state?.resumeDraft;
      if (resumeDraftFromState) {
        resumeDraftHandler(resumeDraftFromState);
        return;
      }
      
      // No draft found, detect region for new form
      const region = await detectAndSetRegion();
      
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
    dbInitialized,
    autoSaveStatus,
    retryCount
  };
};
