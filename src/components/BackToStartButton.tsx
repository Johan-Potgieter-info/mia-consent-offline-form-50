
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface BackToStartButtonProps {
  isDirty: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

const BackToStartButton = ({ isDirty, onSave, onDiscard }: BackToStartButtonProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleBackToStart = () => {
    if (isDirty) {
      setIsOpen(true);
    } else {
      navigate('/');
    }
  };

  const handleSaveAndExit = async () => {
    setIsSaving(true);
    try {
      await onSave();
      navigate('/');
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  const handleDiscardAndExit = () => {
    onDiscard();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToStart}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Start
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Save Progress?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Would you like to save your progress before returning to the start?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleDiscardAndExit}
            className="w-full sm:w-auto"
          >
            Discard Changes
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSaveAndExit}
            disabled={isSaving}
            className="w-full sm:w-auto bg-[#ef4805] hover:bg-[#d63d04]"
          >
            {isSaving ? 'Saving...' : 'Save & Exit'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BackToStartButton;
