
import { useNavigate } from 'react-router-dom';
import { useHybridStorage } from './useHybridStorage';
import { useToast } from '@/hooks/use-toast';
import { FormData, FormSubmissionResult } from '../types/formTypes';
import { Region } from '../utils/regionDetection';

interface UseFormSubmissionProps {
  isOnline: boolean;
}

export const useFormSubmission = ({ 
  isOnline 
}: UseFormSubmissionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { saveForm, deleteForm, syncData, capabilities } = useHybridStorage();

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
        synced: capabilities.supabase, // Mark as synced if saved to Supabase
        submissionId: `${formData.regionCode}-${Date.now()}`,
        status: 'completed'
      };
      
      // Save completed form
      const savedForm = await saveForm(finalData, false);
      
      // Delete draft if resuming and we have an ID
      if (formData.id && isResuming) {
        try {
          await deleteForm(formData.id, true);
        } catch (error) {
          console.log('Draft deletion failed (may not exist):', error);
        }
      }
      
      // Attempt sync if online and we have Supabase capability
      if (isOnline && capabilities.supabase) {
        try {
          await syncData();
        } catch (error) {
          console.error('Post-submission sync failed:', error);
        }
      }
      
      toast({
        title: "Form Submitted",
        description: capabilities.supabase ? 
          `Form submitted successfully for ${currentRegion?.name}!` : 
          "Form saved locally and will sync when online.",
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
