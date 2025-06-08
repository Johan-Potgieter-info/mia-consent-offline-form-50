
import React, { useState } from 'react';
import { useConsentForm } from '../hooks/useConsentForm';
import { useFormSubmission } from '../hooks/useFormSubmission';
import { FormData } from '../types/formTypes';

export const useConsentFormContainer = () => {
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showOfflineDialog, setShowOfflineDialog] = useState(false);
  const [showOnlineSuccessDialog, setShowOnlineSuccessDialog] = useState(false);
  const [showOfflineSummaryDialog, setShowOfflineSummaryDialog] = useState(false);
  const [offlineFormData, setOfflineFormData] = useState<FormData | undefined>();
  const [onlineFormData, setOnlineFormData] = useState<FormData | undefined>();
  const [pendingForms, setPendingForms] = useState<FormData[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  
  const consentFormData = useConsentForm();
  
  const { submitForm: submitFormHook } = useFormSubmission({ 
    isOnline: consentFormData.isOnline,
    onOfflineSubmission: (formData, pendingFormsList) => {
      console.log('Offline submission callback triggered', { 
        patientName: formData.patientName,
        pendingCount: pendingFormsList.length 
      });
      setOfflineFormData(formData);
      setPendingForms(pendingFormsList);
      setShowOfflineSummaryDialog(true);
      setShowValidationErrors(false); // Hide validation errors on successful submission
    },
    onOnlineSubmission: (formData) => {
      console.log('Online submission callback triggered', { patientName: formData.patientName });
      setOnlineFormData(formData);
      setShowOnlineSuccessDialog(true);
      setShowValidationErrors(false); // Hide validation errors on successful submission
    },
    onValidationErrors: (errors) => {
      console.log('Validation errors callback triggered', { errors });
      setValidationErrors(errors);
      setShowValidationErrors(true);
      // Scroll to top to show validation errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  const handleSave = async () => {
    try {
      console.log('Manual save initiated...');
      await consentFormData.saveForm();
      setSaveMessage('Form saved successfully to ' + (consentFormData.dbInitialized ? 'cloud storage' : 'local storage'));
      setShowSaveConfirmation(true);
      setTimeout(() => setShowSaveConfirmation(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Form submission initiated...', { 
        patientName: consentFormData.formData.patientName,
        consentAgreement: consentFormData.formData.consentAgreement 
      });
      
      // Clear previous validation errors
      setShowValidationErrors(false);
      setValidationErrors([]);
      
      const result = await submitFormHook(
        consentFormData.formData, 
        consentFormData.currentRegion, 
        consentFormData.isResuming
      );
      
      console.log('Submission result:', result);
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  const handleDiscard = () => {
    console.log('Form discarded');
  };

  return {
    ...consentFormData,
    showSaveConfirmation,
    setShowSaveConfirmation,
    saveMessage,
    showOfflineDialog,
    setShowOfflineDialog,
    showOnlineSuccessDialog,
    setShowOnlineSuccessDialog,
    showOfflineSummaryDialog,
    setShowOfflineSummaryDialog,
    offlineFormData,
    onlineFormData,
    pendingForms,
    validationErrors,
    showValidationErrors,
    handleSave,
    handleSubmit,
    handleDiscard
  };
};
