
import { useNavigate } from 'react-router-dom';
import { useHybridStorage } from './useHybridStorage';
import { useToast } from '@/hooks/use-toast';
import { FormData, FormSubmissionResult } from '../types/formTypes';
import { Region } from '../utils/regionDetection';

interface UseFormSubmissionProps {
  isOnline: boolean;
  onOfflineSubmission?: (formData: FormData, pendingForms: FormData[]) => void;
  onOnlineSubmission?: (formData: FormData) => void;
}

export const useFormSubmission = ({ 
  isOnline,
  onOfflineSubmission,
  onOnlineSubmission 
}: UseFormSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveForm, deleteForm, syncData, capabilities, getForms } = useHybridStorage();

  const validateForm = (formData: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Check mandatory fields
    if (!formData.patientName?.trim()) {
      errors.push("Patient name is required");
    }
    
    if (!formData.idNumber?.trim()) {
      errors.push("ID number is required");
    }
    
    if (!formData.cellPhone?.trim()) {
      errors.push("Cell phone number is required");
    }
    
    if (!formData.consentAgreement) {
      errors.push("You must agree to the consent form");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const submitForm = async (
    formData: FormData, 
    currentRegion: Region | null, 
    isResuming: boolean
  ): Promise<FormSubmissionResult> => {
    try {
      console.log('Starting form submission process...');
      
      // Validate the form first
      const validation = validateForm(formData);
      if (!validation.isValid) {
        // Show validation errors
        validation.errors.forEach(error => {
          toast({
            title: "Validation Error",
            description: error,
            variant: "destructive",
          });
        });
        
        return { 
          success: false, 
          message: "Please fix validation errors before submitting"
        };
      }

      console.log('Form validation passed, proceeding with submission...');

      const finalData = { 
        ...formData, 
        timestamp: new Date().toISOString(), 
        synced: capabilities.supabase && isOnline,
        submissionId: `${formData.regionCode || currentRegion?.code || 'UNK'}-${Date.now()}`,
        status: 'completed' as const
      };
      
      console.log('Saving completed form...', { id: finalData.id, status: finalData.status });
      
      // Save COMPLETED form (isDraft = false)
      const savedForm = await saveForm(finalData, false);
      console.log('Form saved successfully:', savedForm);
      
      // Delete draft if resuming and we have an ID
      if (formData.id && isResuming) {
        try {
          console.log('Deleting draft form...', formData.id);
          await deleteForm(formData.id, true);
          console.log('Draft deleted successfully');
        } catch (error) {
          console.log('Draft deletion failed (may not exist):', error);
        }
      }
      
      // Handle offline vs online submission
      if (!isOnline || !capabilities.supabase) {
        console.log('Processing offline submission...');
        
        // Get all pending forms for the summary
        const pendingForms = await getForms(false);
        const allPending = pendingForms.filter(form => !form.synced && form.status === 'completed');
        
        console.log('Triggering offline submission dialog...', { 
          pendingCount: allPending.length,
          currentForm: finalData.patientName 
        });
        
        // Trigger offline submission dialog
        if (onOfflineSubmission) {
          onOfflineSubmission(finalData, allPending);
        }
        
        // Navigate back after a delay to allow dialog to show
        setTimeout(() => {
          console.log('Navigating back to home...');
          navigate('/');
        }, 500);
        
        return { 
          success: true,
          message: "Form captured offline"
        };
      } else {
        console.log('Processing online submission...');
        
        // Online submission - attempt sync
        try {
          await syncData();
          console.log('Post-submission sync completed');
        } catch (error) {
          console.error('Post-submission sync failed:', error);
        }
        
        console.log('Triggering online success dialog...');
        
        // Show online success dialog
        if (onOnlineSubmission) {
          onOnlineSubmission(finalData);
        }
        
        // Navigate back to home after showing dialog
        setTimeout(() => {
          console.log('Navigating back to home...');
          navigate('/');
        }, 500);
        
        return { 
          success: true,
          message: "Form submitted successfully"
        };
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
      return { 
        success: false,
        message: "Form submission failed" 
      };
    }
  };

  return { submitForm };
};
