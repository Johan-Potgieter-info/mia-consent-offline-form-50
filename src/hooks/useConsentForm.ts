import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveFormData, syncPendingForms, deleteDraft } from '../utils/indexedDB';
import { useToast } from '@/hooks/use-toast';
import { getRegionWithFallback, Region, REGIONS } from '../utils/regionDetection';

interface FormData {
  [key: string]: any;
  id?: number;
  responsibleForPayment?: string;
  paymentPreference?: string;
  region?: string;
  regionCode?: string;
  doctor?: string;
  practiceNumber?: string;
  patientName?: string;
}

export const useConsentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('patientDetails');
  const [formData, setFormData] = useState<FormData>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regionDetected, setRegionDetected] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [regionDetectionComplete, setRegionDetectionComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingForms();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize form only once
    if (!regionDetectionComplete) {
      initializeForm();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [regionDetectionComplete]);

  // Separate effect for auto-save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (autoSaveEnabled && isDirty && Object.keys(formData).length > 0) {
        autoSave();
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
  }, [autoSaveEnabled, isDirty, formData]);

  const initializeForm = async () => {
    if (regionDetectionComplete) return;
    
    // Check if resuming a draft
    const resumeDraft = location.state?.resumeDraft;
    if (resumeDraft) {
      setIsResuming(true);
      setFormData(resumeDraft);
      
      // Set region from draft
      const region = REGIONS[resumeDraft.regionCode] || REGIONS.PTA;
      setCurrentRegion(region);
      setRegionDetected(true);
      setRegionDetectionComplete(true);
      
      toast({
        title: "Draft Resumed",
        description: `Continuing form for ${resumeDraft.patientName || 'patient'}`,
      });
      
      setIsResuming(false);
    } else {
      // Detect region for new form
      await detectAndSetRegion();
    }
  };

  const detectAndSetRegion = async () => {
    if (regionDetectionComplete) return;
    
    try {
      const region = await getRegionWithFallback();
      setCurrentRegion(region);
      setRegionDetected(true);
      setRegionDetectionComplete(true);
      
      // Automatically update form data with region information
      setFormData(prev => ({
        ...prev,
        region: region.name,
        regionCode: region.code,
        doctor: region.doctor,
        practiceNumber: region.practiceNumber
      }));

      toast({
        title: "Region Detected",
        description: `Form will be submitted for ${region.name} (${region.code}) - ${region.doctor}`,
      });
    } catch (error) {
      console.error('Region detection failed:', error);
      toast({
        title: "Region Detection Failed",
        description: "Using default region (PTA)",
        variant: "destructive",
      });
      
      // Set default region
      const defaultRegion = REGIONS.PTA;
      setCurrentRegion(defaultRegion);
      setRegionDetectionComplete(true);
      setFormData(prev => ({
        ...prev,
        region: defaultRegion.name,
        regionCode: defaultRegion.code,
        doctor: defaultRegion.doctor,
        practiceNumber: defaultRegion.practiceNumber
      }));
    }
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

  const autoSave = async () => {
    try {
      const savedId = await saveFormData({ ...formData, timestamp: new Date().toISOString() }, true);
      setFormData(prev => ({ ...prev, id: savedId }));
      setLastSaved(new Date());
      setIsDirty(false);
      console.log('Auto-saved draft');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const saveForm = async () => {
    try {
      const savedId = await saveFormData({ ...formData, timestamp: new Date().toISOString() }, true);
      setFormData(prev => ({ ...prev, id: savedId }));
      setLastSaved(new Date());
      setIsDirty(false);
      toast({
        title: "Form Saved",
        description: "Your progress has been saved locally.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save form data.",
        variant: "destructive",
      });
    }
  };

  const submitForm = async () => {
    try {
      // Validate required fields
      if (!formData.patientName || !formData.idNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in patient name and ID number before submitting.",
          variant: "destructive",
        });
        return;
      }

      const finalData = { 
        ...formData, 
        timestamp: new Date().toISOString(), 
        synced: false,
        submissionId: `${formData.regionCode}-${Date.now()}`,
        status: 'completed'
      };
      
      await saveFormData(finalData, false);
      
      // Delete draft if resuming
      if (formData.id && isResuming) {
        try {
          await deleteDraft(formData.id);
        } catch (error) {
          console.log('Draft deletion failed (may not exist):', error);
        }
      }
      
      if (isOnline) {
        await syncPendingForms();
      }
      
      toast({
        title: "Form Submitted",
        description: isOnline ? 
          `Form submitted successfully for ${currentRegion?.name}!` : 
          "Form saved and will sync when online.",
      });

      // Navigate back to home after successful submission
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit form.",
        variant: "destructive",
      });
    }
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return lastSaved.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return {
    activeSection,
    setActiveSection,
    formData,
    handleInputChange,
    handleCheckboxChange,
    saveForm,
    submitForm,
    isOnline,
    currentRegion,
    regionDetected,
    isResuming,
    lastSaved,
    isDirty,
    formatLastSaved
  };
};
