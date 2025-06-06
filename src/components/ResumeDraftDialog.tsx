
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, FileText, Trash2, User, AlertCircle } from 'lucide-react';
import { getAllDrafts, deleteDraft } from '../utils/draftOperations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

const ResumeDraftDialog = () => {
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  console.log('ResumeDraftDialog component rendered');

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allDrafts = await getAllDrafts();
      setDrafts(allDrafts);
      console.log('Loaded drafts:', allDrafts.length);
    } catch (error) {
      console.error('Failed to load drafts:', error);
      setError('Could not load saved forms. Please try again.');
      toast({
        title: "Error Loading Drafts",
        description: "Could not load your saved forms",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDraft = async (draftId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await deleteDraft(draftId);
      toast({
        title: "Draft Deleted",
        description: "Form draft was successfully removed",
      });
      await loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the draft. Please try again.",
        variant: "destructive",
      });
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
      
      window.location.href = `/consent-form?draft=${encodeURIComponent(JSON.stringify(updatedDraft))}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Resume a Saved Form</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Select a previously saved form to continue where you left off
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 mx-auto border-4 border-gray-300 border-t-[#ef4805] rounded-full mb-4"></div>
              <p className="text-gray-500">Loading your saved forms...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-12 text-red-500">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-medium text-red-500 mb-2">Error Loading Drafts</h3>
              <p>{error}</p>
              <Button 
                onClick={loadDrafts}
                variant="outline"
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          )}

          {!isLoading && !error && drafts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Forms</h3>
              <p className="text-gray-500">You don't have any unfinished forms yet.</p>
              <p className="text-sm text-gray-400 mt-1">Start a new form and it will be automatically saved as you progress.</p>
            </div>
          )}
          
          {!isLoading && !error && drafts.length > 0 && (
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteDraft(draft.id, e)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Delete draft"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Link
                          to={`/consent-form?draft=${encodeURIComponent(JSON.stringify(draft))}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button className="bg-[#ef4805] hover:bg-[#d63d04]">
                            Continue Form
                          </Button>
                        </Link>
                        
                        <div className="text-sm text-gray-500 flex items-center">
                          <span className="mr-2">Change Doctor:</span>
                          <select
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
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
