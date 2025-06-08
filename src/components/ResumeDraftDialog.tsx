
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import DraftList from './draft/DraftList';
import { useDraftOperations } from './draft/useDraftOperations';

interface ResumeDraftDialogProps {
  onDraftsChanged?: () => void;
}

const ResumeDraftDialog = ({ onDraftsChanged }: ResumeDraftDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    drafts,
    isLoading,
    error,
    isBulkDeleting,
    loadDrafts,
    handleDeleteDraft,
    handleBulkDeleteDrafts,
    handleDoctorChange,
    formatDate,
    getDoctorOptions
  } = useDraftOperations(isOpen);

  const handleContinue = () => {
    setIsOpen(false);
  };

  const handleDelete = async (draftId: string, e: React.MouseEvent) => {
    await handleDeleteDraft(draftId, e);
    // Call the callback to refresh the parent component's draft count
    if (onDraftsChanged) {
      onDraftsChanged();
    }
  };

  const handleBulkDelete = async (draftIds: string[]) => {
    await handleBulkDeleteDrafts(draftIds);
    // Call the callback to refresh the parent component's draft count
    if (onDraftsChanged) {
      onDraftsChanged();
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    // Refresh drafts count when dialog closes
    if (!open && onDraftsChanged) {
      onDraftsChanged();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="lg"
          className="inline-flex items-center px-6 py-3 bg-white text-[#ef4805] font-semibold rounded-lg border-2 border-[#ef4805] hover:bg-orange-50 transition-colors"
        >
          <Clock className="w-5 h-5 mr-2" />
          Resume Draft
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Resume a Saved Form</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Select a previously saved form to continue where you left off, or use bulk actions to manage multiple drafts
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh]">
          <DraftList
            drafts={drafts}
            isLoading={isLoading}
            error={error}
            onRetry={loadDrafts}
            onDeleteDraft={handleDelete}
            onBulkDeleteDrafts={handleBulkDelete}
            onDoctorChange={handleDoctorChange}
            formatDate={formatDate}
            getDoctorOptions={getDoctorOptions}
            onContinue={handleContinue}
            isBulkDeleting={isBulkDeleting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDraftDialog;
