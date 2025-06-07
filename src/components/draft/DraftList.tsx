
import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import DraftItem from './DraftItem';

interface DraftListProps {
  drafts: any[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onDeleteDraft: (draftId: string, e: React.MouseEvent) => void;
  onDoctorChange: (draft: any, newRegionCode: string) => void;
  formatDate: (timestamp: string) => string;
  getDoctorOptions: () => { code: string; name: string; doctor: string }[];
  onContinue: () => void;
}

const DraftList = ({
  drafts,
  isLoading,
  error,
  onRetry,
  onDeleteDraft,
  onDoctorChange,
  formatDate,
  getDoctorOptions,
  onContinue
}: DraftListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 mx-auto border-4 border-gray-300 border-t-[#ef4805] rounded-full mb-4"></div>
        <p className="text-gray-500">Loading your saved forms...</p>
      </div>
    );
  }

  if (error && !isLoading) {
    return (
      <div className="text-center py-12 text-red-500">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Drafts</h3>
        <p>{error}</p>
        <Button 
          onClick={onRetry}
          variant="outline"
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!isLoading && !error && drafts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Forms</h3>
        <p className="text-gray-500">You don't have any unfinished forms yet.</p>
        <p className="text-sm text-gray-400 mt-1">Start a new form and it will be automatically saved as you progress.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Found {drafts.length} unfinished form{drafts.length !== 1 ? 's' : ''}. Click on any form to continue where you left off.
      </p>
      {drafts.map((draft) => (
        <DraftItem
          key={draft.id}
          draft={draft}
          onDelete={onDeleteDraft}
          onDoctorChange={onDoctorChange}
          formatDate={formatDate}
          getDoctorOptions={getDoctorOptions}
          onContinue={onContinue}
        />
      ))}
    </div>
  );
};

export default DraftList;
