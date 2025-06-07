
import { useState } from 'react';
import { useConnectivity } from './useConnectivity';
import { useRegionDetection } from './useRegionDetection';
import { useHybridStorage } from './useHybridStorage';
import { useFormData } from './useFormData';
import { useFormInitialization } from './useFormInitialization';
import { useFormActions } from './useFormActions';

export const useConsentForm = () => {
  const [activeSection, setActiveSection] = useState('patientDetails');

  // Custom hooks for different concerns
  const { isOnline } = useConnectivity();
  const { capabilities } = useHybridStorage();
  const { currentRegion, regionDetected } = useRegionDetection();
  
  const {
    formData,
    setFormData,
    handleInputChange,
    handleCheckboxChange,
    isDirty,
    setIsDirty
  } = useFormData();

  const { isResuming } = useFormInitialization({ setFormData });

  const {
    saveForm,
    submitForm,
    lastSaved,
    formatLastSaved,
    autoSaveStatus,
    retryCount
  } = useFormActions({ formData, isDirty, setIsDirty, isOnline });

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
    formatLastSaved,
    dbInitialized: capabilities.supabase || capabilities.indexedDB,
    autoSaveStatus,
    retryCount
  };
};
