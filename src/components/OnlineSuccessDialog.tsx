
import React from 'react';
import { CheckCircle, Cloud } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface OnlineSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: {
    patientName?: string;
    submissionId?: string;
  };
}

const OnlineSuccessDialog = ({ isOpen, onClose, formData }: OnlineSuccessDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            Form Successfully Uploaded to Cloud
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="p-4 bg-green-50 rounded-lg">
              <Cloud className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-800 font-medium">
                Your consent form has been successfully uploaded to the cloud database
              </p>
            </div>
            
            {formData?.patientName && (
              <p className="text-lg font-semibold text-gray-800">
                Patient: {formData.patientName}
              </p>
            )}
            
            {formData?.submissionId && (
              <p className="text-sm text-gray-600">
                Submission ID: {formData.submissionId}
              </p>
            )}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">What happened:</p>
              <ul className="space-y-1 text-xs">
                <li>• Form submitted and saved to cloud database</li>
                <li>• Data is securely stored and accessible from any device</li>
                <li>• Form has been removed from local drafts</li>
              </ul>
            </div>
          </div>

          <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnlineSuccessDialog;
