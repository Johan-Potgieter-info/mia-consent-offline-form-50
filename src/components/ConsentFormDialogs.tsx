
import React from 'react';
import SaveConfirmation from './SaveConfirmation';
import OfflineSubmissionDialog from './OfflineSubmissionDialog';
import OnlineSuccessDialog from './OnlineSuccessDialog';
import OfflineSummaryDialog from './OfflineSummaryDialog';
import { FormData } from '../types/formTypes';

interface ConsentFormDialogsProps {
  showSaveConfirmation: boolean;
  saveMessage: string;
  isOnline: boolean;
  showOfflineDialog: boolean;
  setShowOfflineDialog: (show: boolean) => void;
  showOnlineSuccessDialog: boolean;
  setShowOnlineSuccessDialog: (show: boolean) => void;
  showOfflineSummaryDialog: boolean;
  setShowOfflineSummaryDialog: (show: boolean) => void;
  offlineFormData: FormData | undefined;
  onlineFormData: FormData | undefined;
  pendingForms: FormData[];
}

const ConsentFormDialogs = ({
  showSaveConfirmation,
  saveMessage,
  isOnline,
  showOfflineDialog,
  setShowOfflineDialog,
  showOnlineSuccessDialog,
  setShowOnlineSuccessDialog,
  showOfflineSummaryDialog,
  setShowOfflineSummaryDialog,
  offlineFormData,
  onlineFormData,
  pendingForms
}: ConsentFormDialogsProps) => {
  return (
    <>
      <SaveConfirmation
        show={showSaveConfirmation}
        message={saveMessage}
        isOnline={isOnline}
        isAutoSave={false}
      />

      <OfflineSubmissionDialog
        isOpen={showOfflineDialog}
        onClose={() => setShowOfflineDialog(false)}
        formData={offlineFormData}
      />

      <OnlineSuccessDialog
        isOpen={showOnlineSuccessDialog}
        onClose={() => setShowOnlineSuccessDialog(false)}
        formData={onlineFormData}
      />

      <OfflineSummaryDialog
        isOpen={showOfflineSummaryDialog}
        onClose={() => setShowOfflineSummaryDialog(false)}
        currentForm={offlineFormData}
        pendingForms={pendingForms}
      />
    </>
  );
};

export default ConsentFormDialogs;
