
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { REGIONS } from '../utils/regionDetection';
import { useToast } from '@/hooks/use-toast';
import { useRegionDetection } from './useRegionDetection';
import { useHybridStorage } from './useHybridStorage';
import { FormData } from '../types/formTypes';

interface UseFormInitializationProps {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

interface UseFormInitializationResult {
  isResuming: boolean;
  setIsResuming: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useFormInitialization = ({ 
  setFormData 
}: UseFormInitializationProps): UseFormInitializationResult => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isResuming, setIsResuming] = useState(false);
  const { toast } = useToast();
  const { isInitialized } = useHybridStorage();
  const { 
    regionDetectionComplete,
    detectAndSetRegion 
  } = useRegionDetection();

  // Initialize form when storage and region detection are ready
  useEffect(() => {
    if (isInitialized && regionDetectionComplete) {
      initializeForm();
    }
  }, [isInitialized, regionDetectionComplete]);

  const initializeForm = async () => {
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

  return {
    isResuming,
    setIsResuming
  };
};
