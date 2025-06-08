
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

  const submitForm = async (
    formData: FormData, 
    currentRegion: Region | null, 
    isResuming: boolean
  ): Promise<FormSubmissionResult> => {
    try {
      // Validate required fields for submission
      if (!formData.patientName || !formData.idNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in patient name and ID number before submitting.",
          variant: "destructive",
        });
        return { 
          success: false, 
          message: "Missing required fields"
        };
      }

      // Additional validation for complete submission
      if (!formData.consentAgreement) {
        toast({
          title: "Validation Error",
          description: "Please agree to the consent form before submitting.",
          variant: "destructive",
        });
        return { 
          success: false, 
          message: "Consent agreement required"
        };
      }

      const finalData = { 
        ...formData, 
        timestamp: new Date().toISOString(), 
        synced: capabilities.supabase && isOnline, // Only mark as synced if online and Supabase available
        submissionId: `${formData.regionCode || currentRegion?.code || 'UNK'}-${Date.now()}`,
        status: 'completed' // ONLY submitted forms get 'completed' status
      };
      
      // Save COMPLETED form (isDraft = false) - this goes to cloud if available
      const savedForm = await saveForm(finalData, false);
      
      // Delete draft if resuming and we have an ID
      if (formData.id && isResuming) {
        try {
          await deleteForm(formData.id, true); // Delete from drafts
        } catch (error) {
          console.log('Draft deletion failed (may not exist):', error);
        }
      }
      
      // Handle offline vs online submission
      if (!isOnline || !capabilities.supabase) {
        // Get all pending forms for the summary
        const pendingForms = await getForms(false);
        const allPending = pendingForms.filter(form => !form.synced && form.status === 'completed');
        
        // Offline submission - show special dialog with pending summary
        onOfflineSubmission?.(finalData, allPending);
        
        // Navigate back after a delay to allow user to see the dialog
        setTimeout(() => {
          navigate('/');
        }, 100);
        
        return { 
          success: true,
          message: "Form captured offline"
        };
      } else {
        // Online submission - attempt sync
        try {
          await syncData();
        } catch (error) {
          console.error('Post-submission sync failed:', error);
        }
        
        // Show online success dialog
        onOnlineSubmission?.(finalData);
        
        // Navigate back to home after showing dialog
        setTimeout(() => {
          navigate('/');
        }, 100);
        
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
