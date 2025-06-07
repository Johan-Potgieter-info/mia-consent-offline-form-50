
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SaveConfirmationProps {
  show: boolean;
  message: string;
  duration?: number;
}

const SaveConfirmation = ({ show, message, duration = 3000 }: SaveConfirmationProps) => {
  useEffect(() => {
    if (show) {
      toast({
        title: "Form Saved",
        description: message,
        duration: duration,
      });
    }
  }, [show, message, duration]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg animate-fade-in">
      <div className="flex items-center space-x-3">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <div>
          <p className="font-medium text-green-900">Saved Successfully</p>
          <p className="text-sm text-green-700">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmation;
