
import React, { useState } from 'react';
import { Save, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsentFormNavigationProps {
  sections: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  onSave: () => Promise<void>;
  onSubmit: () => Promise<void>;
}

const ConsentFormNavigation = ({ 
  sections, 
  activeSection, 
  setActiveSection, 
  onSave, 
  onSubmit 
}: ConsentFormNavigationProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentIndex = sections.findIndex(s => s.id === activeSection);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 mt-8 pt-6 border-t border-gray-200">
      {/* Mobile-first navigation */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            if (currentIndex > 0) {
              setActiveSection(sections[currentIndex - 1].id);
            }
          }}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex items-center gap-2 h-12 px-6 text-base font-medium border-2 border-gray-300 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5" />
          Previous
        </Button>

        {currentIndex === sections.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 h-12 px-8 bg-[#ef4805] text-white text-base font-medium hover:bg-[#d63d04] transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1].id);
              }
            }}
            className="flex items-center gap-2 h-12 px-6 bg-[#ef4805] text-white text-base font-medium hover:bg-[#d63d04] transition-colors"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Save button - full width on mobile */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        variant="outline"
        className="w-full h-12 flex items-center justify-center gap-2 text-base font-medium border-2 border-blue-300 text-blue-700 hover:bg-blue-50 disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {isSaving ? 'Saving...' : 'Save Progress'}
      </Button>
    </div>
  );
};

export default ConsentFormNavigation;
