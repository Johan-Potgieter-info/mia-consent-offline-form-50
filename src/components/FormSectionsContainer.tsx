
import React from 'react';
import FormSection from './FormSection';
import FormSectionRenderer from './FormSectionRenderer';
import { FormData } from '../types/formTypes';
import { useFormSections } from '../hooks/useFormSections';

interface FormSectionsContainerProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleCheckboxChange: (field: keyof FormData, value: string, checked: boolean) => void;
  validationErrors: string[];
}

const FormSectionsContainer = ({
  activeSection,
  setActiveSection,
  formData,
  handleInputChange,
  handleCheckboxChange,
  validationErrors
}: FormSectionsContainerProps) => {
  const { sections } = useFormSections();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="border-b border-gray-200">
        {sections.map((section) => (
          <FormSection
            key={section.id}
            id={section.id}
            title={section.title}
            isActive={activeSection === section.id}
            onToggle={setActiveSection}
          >
            {activeSection === section.id && (
              <FormSectionRenderer
                activeSection={activeSection}
                formData={formData}
                handleInputChange={handleInputChange}
                handleCheckboxChange={handleCheckboxChange}
                validationErrors={validationErrors}
              />
            )}
          </FormSection>
        ))}
      </div>
    </div>
  );
};

export default FormSectionsContainer;
