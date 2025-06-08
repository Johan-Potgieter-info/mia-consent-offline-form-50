
import React from 'react';
import { useConsentFormContainer } from './ConsentFormContainer';
import ConsentFormLayout from './ConsentFormLayout';
import ConsentFormDialogs from './ConsentFormDialogs';

const ConsentForm = () => {
  const containerData = useConsentFormContainer();

  return (
    <>
      <ConsentFormLayout
        currentRegion={containerData.currentRegion}
        regionDetected={containerData.regionDetected}
        isResuming={containerData.isResuming}
        activeSection={containerData.activeSection}
        setActiveSection={containerData.setActiveSection}
        formData={containerData.formData}
        handleInputChange={containerData.handleInputChange}
        handleCheckboxChange={containerData.handleCheckboxChange}
        isDirty={containerData.isDirty}
        justSaved={containerData.justSaved}
        onSave={containerData.handleSave}
        onSubmit={containerData.handleSubmit}
        onDiscard={containerData.handleDiscard}
        onResetJustSaved={containerData.resetJustSaved}
        isOnline={containerData.isOnline}
        lastSaved={containerData.lastSaved}
        formatLastSaved={containerData.formatLastSaved}
        dbInitialized={containerData.dbInitialized}
        autoSaveStatus={containerData.autoSaveStatus}
        retryCount={containerData.retryCount}
        showManualSelector={containerData.showManualSelector}
        setRegionManually={containerData.setRegionManually}
        isRegionFromDraft={containerData.isRegionFromDraft}
        isRegionDetected={containerData.isRegionDetected}
      />

      <ConsentFormDialogs
        showSaveConfirmation={containerData.showSaveConfirmation}
        saveMessage={containerData.saveMessage}
        isOnline={containerData.isOnline}
        showOfflineDialog={containerData.showOfflineDialog}
        setShowOfflineDialog={containerData.setShowOfflineDialog}
        showOnlineSuccessDialog={containerData.showOnlineSuccessDialog}
        setShowOnlineSuccessDialog={containerData.setShowOnlineSuccessDialog}
        showOfflineSummaryDialog={containerData.showOfflineSummaryDialog}
        setShowOfflineSummaryDialog={containerData.setShowOfflineSummaryDialog}
        offlineFormData={containerData.offlineFormData}
        onlineFormData={containerData.onlineFormData}
        pendingForms={containerData.pendingForms}
      />
    </>
  );
};

export default ConsentForm;
