
import React from 'react';
import { CheckCircle, Wifi, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface OfflineSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: {
    patientName?: string;
    submissionId?: string;
  };
}

const OfflineSubmissionDialog = ({ isOpen, onClose, formData }: OfflineSubmissionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Form Captured Successfully
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="p-4 bg-green-50 rounded-lg">
              <Upload className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800 font-medium">
                Your consent form has been saved locally
              </p>
            </div>
            
            {formData?.patientName && (
              <p className="text-sm text-gray-600">
                Patient: <span className="font-medium">{formData.patientName}</span>
              </p>
            )}
            
            {formData?.submissionId && (
              <p className="text-xs text-gray-500">
                ID: {formData.submissionId}
              </p>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Wifi className="w-4 h-4" />
              <span>Currently offline</span>
            </div>
            
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">What happens next:</p>
              <ul className="space-y-1 text-xs">
                <li>• Form is safely stored on this device</li>
                <li>• Will automatically upload when internet connection is restored</li>
                <li>• You can continue working with other forms</li>
                <li>• Check "Pending Upload" section for sync status</li>
              </ul>
            </div>
          </div>

          <Button onClick={onClose} className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineSubmissionDialog;
