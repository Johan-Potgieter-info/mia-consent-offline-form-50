
import React from 'react';
import { useConsentForm } from '../hooks/useConsentForm';
import ConsentFormHeader from './ConsentFormHeader';
import ConsentFormProgress from './ConsentFormProgress';
import ConsentFormStatusBar from './ConsentFormStatusBar';
import ConsentFormContent from './ConsentFormContent';
import ConsentFormNavigation from './ConsentFormNavigation';
import FormSection from './FormSection';
import PatientDetailsSection from './PatientDetailsSection';
import AccountHolderSection from './AccountHolderSection';
import PaymentEmergencySection from './PaymentEmergencySection';
import MedicalHistorySection from './MedicalHistorySection';
import ConsentSection from './ConsentSection';

const ConsentForm = () => {
  const {
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
    dbInitialized,
    autoSaveStatus,
    retryCount
  } = useConsentForm();

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
          onSave={saveForm}
          dbInitialized={dbInitialized}
          autoSaveStatus={autoSaveStatus}
          retryCount={retryCount}
        />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Section Navigation */}
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
              onSave={saveForm}
              onSubmit={submitForm}
            />
          </ConsentFormContent>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
