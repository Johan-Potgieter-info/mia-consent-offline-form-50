
import React from 'react';
import { Clock, Database, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { FormData } from '../types/formTypes';

interface OfflineSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentForm?: {
    patientName?: string;
    submissionId?: string;
  };
  pendingForms: FormData[];
}

const OfflineSummaryDialog = ({ isOpen, onClose, currentForm, pendingForms }: OfflineSummaryDialogProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    console.log('OfflineSummaryDialog: Closing and navigating to home');
    onClose();
    navigate('/');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <CheckCircle className="w-6 h-6" />
            Form Captured - Offline Mode
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="p-4 bg-amber-50 rounded-lg">
              <Database className="w-8 h-8 text-amber-600 mx-auto mb-2" />
              <p className="text-sm text-amber-800 font-medium">
                Your consent form has been saved locally and will upload when online
              </p>
            </div>
            
            {currentForm?.patientName && (
              <p className="text-lg font-semibold text-gray-800">
                Latest: {currentForm.patientName}
              </p>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Clock className="w-4 h-4" />
              <span>All Pending Offline Submissions ({pendingForms.length})</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
              {pendingForms.length > 0 ? (
                <ul className="space-y-2">
                  {pendingForms.map((form, index) => (
                    <li key={form.id || index} className="flex justify-between items-center text-sm">
                      <span className="font-medium">
                        {form.patientName || 'Unknown Patient'}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {form.timestamp ? new Date(form.timestamp).toLocaleString() : 'Unknown time'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center">No pending submissions</p>
              )}
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">What happens next:</p>
              <ul className="space-y-1 text-xs">
                <li>• All forms are safely stored on this device</li>
                <li>• Will automatically upload when internet connection is restored</li>
                <li>• You can continue working with new forms</li>
              </ul>
            </div>
          </div>

          <Button onClick={handleClose} className="w-full">
            Return to Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineSummaryDialog;
