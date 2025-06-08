
import { useState, useCallback } from 'react';
import { FormData } from '../types/formTypes';

const initialFormData: FormData = {
  // Generate a consistent ID at form initialization
  id: Date.now(),
  patientName: '',
  idNumber: '',
  cellPhone: '',
  email: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  medicalAidScheme: '',
  medicalAidNumber: '',
  accountHolderName: '',
  accountHolderIdNumber: '',
  relationshipToPatient: '',
  paymentMethod: '',
  allergies: '',
  medications: '',
  medicalConditions: '',
  previousDentalWork: '',
  consentAgreement: false,
  timestamp: new Date().toISOString(),
  regionCode: '',
  status: 'draft'
};

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Preserve the original ID throughout the form lifecycle
      id: prev.id || Date.now(),
      lastModified: new Date().toISOString()
    }));
    setIsDirty(true);
  }, []);

  const handleCheckboxChange = useCallback((field: keyof FormData, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked,
      // Preserve the original ID throughout the form lifecycle
      id: prev.id || Date.now(),
      lastModified: new Date().toISOString()
    }));
    setIsDirty(true);
  }, []);

  return {
    formData,
    setFormData: useCallback((data: FormData) => {
      // When setting form data (like from a draft), preserve or generate ID
      setFormData({
        ...data,
        id: data.id || Date.now(),
        lastModified: new Date().toISOString()
      });
      setIsDirty(false);
    }, []),
    handleInputChange,
    handleCheckboxChange,
    isDirty,
    setIsDirty
  };
};
