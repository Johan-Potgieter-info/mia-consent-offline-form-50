
import React from 'react';
import { FormData } from '../types/formTypes';
import { useFormSections } from '../hooks/useFormSections';

interface FormSectionRendererProps {
  activeSection: string;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleCheckboxChange: (field: keyof FormData, value: string, checked: boolean) => void;
  validationErrors: string[];
}

const FormSectionRenderer = ({
  activeSection,
  formData,
  handleInputChange,
  handleCheckboxChange,
  validationErrors
}: FormSectionRendererProps) => {
  const { sections } = useFormSections();

  // Helper function to update form data
  const updateFormData = (updates: Partial<FormData>) => {
    Object.keys(updates).forEach(key => {
      const value = updates[key as keyof FormData];
      if (typeof value === 'string') {
        handleInputChange(key as keyof FormData, value);
      }
    });
  };

  const renderActiveSection = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    const SectionComponent = section.component;
    
    // PatientDetailsSection uses different props than other sections
    if (section.id === 'patientDetails') {
      return (
        <SectionComponent
          formData={formData}
          updateFormData={updateFormData}
          validationErrors={validationErrors}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />
      );
    }
    
    // All other sections need both prop patterns to satisfy their interfaces
    return (
      <SectionComponent
        formData={formData}
        updateFormData={updateFormData}
        validationErrors={validationErrors}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
      />
    );
  };

  return <>{renderActiveSection()}</>;
};

export default FormSectionRenderer;
