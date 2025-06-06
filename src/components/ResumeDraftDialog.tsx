
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Trash2 } from 'lucide-react';
import { getAllDrafts, deleteDraft } from '../utils/indexedDB';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

const ResumeDraftDialog = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = async () => {
    try {
      const allDrafts = await getAllDrafts();
      setDrafts(allDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const handleDeleteDraft = async (draftId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteDraft(draftId);
      await loadDrafts(); // Reload drafts after deletion
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <Clock className="w-5 h-5 mr-2" />
          Resume Draft
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume a Draft</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {drafts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No drafts found</p>
              <p className="text-sm">Start a new form to create a draft</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div key={draft.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <Link
                      to="/consent-form"
                      state={{ resumeDraft: draft }}
                      className="flex-1 hover:text-blue-600"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {draft.patientName || 'Unnamed Patient'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {draft.regionCode || 'PTA'} - {draft.doctor || 'Dr. Vorster'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Last saved: {formatDate(draft.timestamp || draft.lastModified)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Draft
                          </div>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => handleDeleteDraft(draft.id, e)}
                      className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeDraftDialog;
