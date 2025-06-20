
import { useNavigate } from 'react-router-dom';
import { useHybridStorage } from './useHybridStorage';
import { useToast } from '@/hooks/use-toast';
import { useFormSession } from './useFormSession';
import { FormData, FormSubmissionResult } from '../types/formTypes';
import { Region } from '../utils/regionDetection';

interface UseFormSubmissionProps {
  isOnline: boolean;
  onOfflineSubmission?: (formData: FormData, pendingForms: FormData[]) => void;
  onOnlineSubmission?: (formData: FormData) => void;
  onValidationErrors?: (errors: string[]) => void;
}

export const useFormSubmission = ({ 
  isOnline,
  onOfflineSubmission,
  onOnlineSubmission,
  onValidationErrors
}: UseFormSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveForm, deleteForm, syncData, capabilities, getForms } = useHybridStorage();
  const { clearSession } = useFormSession();

  const validateForm = (formData: FormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    console.log('Validating form data:', {
      patientName: formData.patientName,
      idNumber: formData.idNumber,
      cellPhone: formData.cellPhone,
      consentAgreement: formData.consentAgreement
    });

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

    console.log('Validation result:', { isValid: errors.length === 0, errors });

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
      console.log('Starting form submission process...', {
        formData: {
          patientName: formData.patientName,
          idNumber: formData.idNumber,
          cellPhone: formData.cellPhone,
          consentAgreement: formData.consentAgreement
        },
        isResuming,
        draftId: formData.id
      });
      
      // Validate the form first
      const validation = validateForm(formData);
      if (!validation.isValid) {
        console.log('Validation failed:', validation.errors);
        
        // Trigger validation error callback to show errors in UI
        if (onValidationErrors) {
          onValidationErrors(validation.errors);
        }
        
        // Also show toast for immediate feedback
        toast({
          title: "Validation Error",
          description: "Please complete all required fields before submitting.",
          variant: "destructive",
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
      
      // IMPORTANT: Delete the draft IMMEDIATELY after successful completion
      if (formData.id && isResuming) {
        try {
          console.log('Deleting draft form after successful submission...', formData.id);
          await deleteForm(formData.id, true); // true = isDraft
          console.log('Draft deleted successfully after submission');
        } catch (error) {
          console.error('Draft deletion failed after submission (may not exist):', error);
        }
      }
      
      // Also try to delete any draft with the same session ID to ensure cleanup
      if (formData.id) {
        try {
          const allDrafts = await getForms(true);
          const matchingDrafts = allDrafts.filter(draft => 
            draft.id === formData.id || 
            (draft.patientName === formData.patientName && draft.idNumber === formData.idNumber)
          );
          
          for (const draft of matchingDrafts) {
            try {
              console.log('Cleaning up related draft:', draft.id);
              await deleteForm(draft.id, true);
            } catch (cleanupError) {
              console.error('Cleanup error for draft:', draft.id, cleanupError);
            }
          }
        } catch (error) {
          console.error('Error during draft cleanup:', error);
        }
      }
      
      // Clear the form session since we successfully submitted
      clearSession();
      console.log('Form session cleared after successful submission');
      
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
        
        // Trigger offline submission dialog immediately
        if (onOfflineSubmission) {
          setTimeout(() => {
            onOfflineSubmission(finalData, allPending);
          }, 100);
        }
        
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
        
        // Show online success dialog immediately
        if (onOnlineSubmission) {
          setTimeout(() => {
            onOnlineSubmission(finalData);
          }, 100);
        }
        
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
