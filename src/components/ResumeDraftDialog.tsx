
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Trash2, User } from 'lucide-react';
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

  const getDoctorOptions = () => [
    { code: 'CPT', name: 'Cape Town', doctor: 'Dr. Soni' },
    { code: 'PTA', name: 'Pretoria', doctor: 'Dr. Vorster' },
    { code: 'JHB', name: 'Johannesburg', doctor: 'Dr. Essop' }
  ];

  const handleDoctorChange = (draft: any, newRegionCode: string) => {
    const doctorOptions = getDoctorOptions();
    const selectedOption = doctorOptions.find(option => option.code === newRegionCode);
    
    if (selectedOption) {
      const updatedDraft = {
        ...draft,
        regionCode: selectedOption.code,
        region: selectedOption.name,
        doctor: selectedOption.doctor
      };
      
      // Navigate with updated draft
      window.location.href = `/consent-form?draft=${encodeURIComponent(JSON.stringify(updatedDraft))}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center px-6 py-3 bg-white text-[#ef4805] font-semibold rounded-lg border-2 border-[#ef4805] hover:bg-orange-50 transition-colors">
          <Clock className="w-5 h-5 mr-2" />
          Resume Draft
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Resume a Saved Form</DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {drafts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Forms</h3>
              <p className="text-gray-500">You don't have any unfinished forms yet.</p>
              <p className="text-sm text-gray-400 mt-1">Start a new form and it will be automatically saved as you progress.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Found {drafts.length} unfinished form{drafts.length !== 1 ? 's' : ''}. Click on any form to continue where you left off.
              </p>
              {drafts.map((draft) => (
                <div key={draft.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {draft.patientName || 'Unnamed Patient'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span className="inline-flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {draft.doctor || 'Dr. Vorster'}
                          </span>
                          <span>{draft.regionCode || 'PTA'}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Last saved: {formatDate(draft.timestamp || draft.lastModified)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          Draft
                        </div>
                        <button
                          onClick={(e) => handleDeleteDraft(draft.id, e)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link
                          to="/consent-form"
                          state={{ resumeDraft: draft }}
                          className="inline-flex items-center px-4 py-2 bg-[#ef4805] text-white font-medium rounded-lg hover:bg-[#d63d04] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Continue Form
                        </Link>
                        
                        <div className="text-sm text-gray-500">
                          Change Doctor:
                          <select
                            className="ml-2 px-2 py-1 border border-gray-300 rounded text-sm"
                            value={draft.regionCode || 'PTA'}
                            onChange={(e) => handleDoctorChange(draft, e.target.value)}
                          >
                            {getDoctorOptions().map((option) => (
                              <option key={option.code} value={option.code}>
                                {option.doctor} ({option.name})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
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
