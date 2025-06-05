
import React from 'react';
import { Save, Send } from 'lucide-react';

interface ConsentFormNavigationProps {
  sections: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
  activeSection: string;
  setActiveSection: (sectionId: string) => void;
  onSave: () => void;
  onSubmit: () => void;
}

const ConsentFormNavigation = ({ 
  sections, 
  activeSection, 
  setActiveSection, 
  onSave, 
  onSubmit 
}: ConsentFormNavigationProps) => {
  const currentIndex = sections.findIndex(s => s.id === activeSection);

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <button
        onClick={() => {
          if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1].id);
          }
        }}
        disabled={currentIndex === 0}
        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <div className="flex space-x-3">
        <button
          onClick={onSave}
          className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Progress
        </button>

        {currentIndex === sections.length - 1 ? (
          <button
            onClick={onSubmit}
            className="flex items-center px-6 py-2 bg-[#ef4805] text-white rounded-lg hover:bg-[#f47d4a] transition-colors"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Form
          </button>
        ) : (
          <button
            onClick={() => {
              if (currentIndex < sections.length - 1) {
                setActiveSection(sections[currentIndex + 1].id);
              }
            }}
            className="px-4 py-2 bg-[#ef4805] text-white rounded-lg hover:bg-[#f47d4a] transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ConsentFormNavigation;
