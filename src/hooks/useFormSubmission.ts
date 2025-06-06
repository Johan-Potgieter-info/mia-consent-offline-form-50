
import { useNavigate } from 'react-router-dom';
import { saveFormData, deleteDraft, syncPendingForms } from '../utils/indexedDB';
import { useToast } from '@/hooks/use-toast';
import { FormData, FormSubmissionResult } from '../types/formTypes';
import { Region } from '../utils/regionDetection';

interface UseFormSubmissionProps {
  dbInitialized: boolean;
  isOnline: boolean;
}

export const useFormSubmission = ({ 
  dbInitialized, 
  isOnline 
}: UseFormSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitForm = async (
    formData: FormData, 
    currentRegion: Region | null, 
    isResuming: boolean
  ): Promise<FormSubmissionResult> => {
    try {
      // Validate required fields
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

      const finalData = { 
        ...formData, 
        timestamp: new Date().toISOString(), 
        synced: false,
        submissionId: `${formData.regionCode}-${Date.now()}`,
        status: 'completed'
      };
      
      if (dbInitialized) {
        await saveFormData(finalData, false);
        
        // Delete draft if resuming
        if (formData.id && isResuming) {
          try {
            await deleteDraft(formData.id);
          } catch (error) {
            console.log('Draft deletion failed (may not exist):', error);
          }
        }
      }
      
      if (isOnline && dbInitialized) {
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
      
      return { 
        success: true,
        message: "Form submitted successfully"
      };
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit form.",
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
