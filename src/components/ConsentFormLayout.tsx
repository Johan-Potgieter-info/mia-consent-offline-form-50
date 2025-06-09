
import React from 'react';
import ConsentFormHeader from './ConsentFormHeader';
import ConsentFormProgress from './ConsentFormProgress';
import ConsentFormStatusBar from './ConsentFormStatusBar';
import ConsentFormContent from './ConsentFormContent';
import ConsentFormNavigation from './ConsentFormNavigation';
import BackToStartButton from './BackToStartButton';
import RegionSelector from './RegionSelector';
import FormSection from './FormSection';
import FormValidationErrors from './FormValidationErrors';
import PatientDetailsSection from './PatientDetailsSection';
import AccountHolderSection from './AccountHolderSection';
import PaymentEmergencySection from './PaymentEmergencySection';
import MedicalHistorySection from './MedicalHistorySection';
import ConsentSection from './ConsentSection';
import { FormData } from '../types/formTypes';
import { Region } from '../utils/regionDetection';

interface ConsentFormLayoutProps {
  currentRegion: Region | null;
  regionDetected: boolean;
  isResuming: boolean;
  activeSection: string;
  setActiveSection: (section: string) => void;
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: string) => void;
  handleCheckboxChange: (field: keyof FormData, value: string, checked: boolean) => void;
  isDirty: boolean;
  justSaved: boolean;
  onSave: () => Promise<void>;
  onSubmit: () => Promise<void>;
  onDiscard: () => void;
  onResetJustSaved: () => void;
  isOnline: boolean;
  lastSaved: Date | null;
  formatLastSaved: () => string;
  dbInitialized: boolean;
  autoSaveStatus: 'idle' | 'saving' | 'success' | 'error';
  retryCount: number;
  showManualSelector: boolean;
  setRegionManually: (region: Region) => void;
  isRegionFromDraft: boolean;
  isRegionDetected: boolean;
  validationErrors: string[];
  showValidationErrors: boolean;
}

const ConsentFormLayout = ({
  currentRegion,
  regionDetected,
  isResuming,
  activeSection,
  setActiveSection,
  formData,
  handleInputChange,
  handleCheckboxChange,
  isDirty,
  justSaved,
  onSave,
  onSubmit,
  onDiscard,
  onResetJustSaved,
  isOnline,
  lastSaved,
  formatLastSaved,
  dbInitialized,
  autoSaveStatus,
  retryCount,
  showManualSelector,
  setRegionManually,
  isRegionFromDraft,
  isRegionDetected,
  validationErrors,
  showValidationErrors
}: ConsentFormLayoutProps) => {
  // Helper function to update form data
  const updateFormData = (updates: Partial<FormData>) => {
    Object.keys(updates).forEach(key => {
      const value = updates[key as keyof FormData];
      if (typeof value === 'string') {
        handleInputChange(key as keyof FormData, value);
      }
    });
  };

  const sections = [
    { id: 'patientDetails', title: '1. Patient Details', component: PatientDetailsSection },
    { id: 'accountHolder', title: '2. Account Holder Details', component: AccountHolderSection },
    { id: 'paymentEmergency', title: '3. Payment and Emergency Contact', component: PaymentEmergencySection },
    { id: 'medicalHistory', title: '4. Medical History', component: MedicalHistorySection },
    { id: 'consent', title: '5. Consent', component: ConsentSection },
  ];

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
        />
      );
    }
    
    // All other sections use the standard props
    return (
      <SectionComponent
        formData={formData}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ConsentFormHeader 
        currentRegion={currentRegion}
        regionDetected={regionDetected}
        isResuming={isResuming}
      />

      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <BackToStartButton
            isDirty={isDirty}
            justSaved={justSaved}
            onSave={onSave}
            onDiscard={onDiscard}
            onResetJustSaved={onResetJustSaved}
          />
        </div>

        <RegionSelector
          onRegionSelect={setRegionManually}
          currentRegion={currentRegion}
          isVisible={showManualSelector}
        />

        <ConsentFormProgress 
          currentSection={activeSection}
          sections={sections}
        />

        <ConsentFormStatusBar 
          isOnline={isOnline}
          currentRegion={currentRegion}
          isDirty={isDirty}
          lastSaved={lastSaved}
          formatLastSaved={formatLastSaved}
          onSave={onSave}
          dbInitialized={dbInitialized}
          autoSaveStatus={autoSaveStatus}
          retryCount={retryCount}
          onRegionSelect={setRegionManually}
          isRegionFromDraft={isRegionFromDraft}
          isRegionDetected={isRegionDetected}
        />

        {/* Validation Errors Display */}
        <FormValidationErrors 
          errors={validationErrors}
          isVisible={showValidationErrors}
        />

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
                {activeSection === section.id && renderActiveSection()}
              </FormSection>
            ))}
          </div>

          <ConsentFormContent
            currentRegion={currentRegion}
            regionDetected={regionDetected}
            isResuming={isResuming}
          >
            <ConsentFormNavigation
              sections={sections}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              onSave={onSave}
              onSubmit={onSubmit}
            />
          </ConsentFormContent>
        </div>
      </div>
    </div>
  );
};

export default ConsentFormLayout;
