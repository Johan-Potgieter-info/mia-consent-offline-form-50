
import React, { useEffect } from 'react';
import { CheckCircle, Cloud, HardDrive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SaveConfirmationProps {
  show: boolean;
  message: string;
  duration?: number;
  isOnline?: boolean;
  isAutoSave?: boolean;
}

const SaveConfirmation = ({ 
  show, 
  message, 
  duration = 3000, 
  isOnline = false,
  isAutoSave = false 
}: SaveConfirmationProps) => {
  useEffect(() => {
    if (show) {
      const getToastMessage = () => {
        if (isAutoSave) {
          return isOnline ? "Auto-saved to cloud" : "Auto-saved locally";
        }
        return isOnline ? "Draft saved to cloud" : "Draft saved locally";
      };

      const getDescription = () => {
        if (isAutoSave) {
          return isOnline 
            ? "Your changes have been automatically saved to the cloud database" 
            : "Your changes have been automatically saved to local storage and will sync when online";
        }
        return isOnline 
          ? "Your draft has been saved to the cloud database" 
          : "Your draft has been saved locally and will sync when online";
      };

      toast({
        title: getToastMessage(),
        description: getDescription(),
        duration: duration,
      });
    }
  }, [show, message, duration, isOnline, isAutoSave]);

  if (!show) return null;

  const getIcon = () => {
    return isOnline ? <Cloud className="w-6 h-6 text-green-600" /> : <HardDrive className="w-6 h-6 text-blue-600" />;
  };

  const getBgColor = () => {
    return isOnline ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200';
  };

  const getTextColor = () => {
    return isOnline ? 'text-green-900' : 'text-blue-900';
  };

  const getSecondaryColor = () => {
    return isOnline ? 'text-green-700' : 'text-blue-700';
  };

  return (
    <div className={`fixed top-4 right-4 z-50 ${getBgColor()} rounded-lg p-4 shadow-lg animate-fade-in`}>
      <div className="flex items-center space-x-3">
        {getIcon()}
        <div>
          <p className={`font-medium ${getTextColor()}`}>
            {isAutoSave ? (isOnline ? 'Auto-saved to Cloud' : 'Auto-saved Locally') : 'Draft Saved Successfully'}
          </p>
          <p className={`text-sm ${getSecondaryColor()}`}>
            {isOnline ? 'Saved to cloud database' : 'Saved locally - will sync when online'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaveConfirmation;
