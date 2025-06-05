
import React from 'react';

interface ConsentFormProgressProps {
  currentSection: string;
  sections: Array<{ id: string; title: string; component: React.ComponentType<any> }>;
}

const ConsentFormProgress = ({ currentSection, sections }: ConsentFormProgressProps) => {
  const getProgressPercentage = () => {
    const currentIndex = sections.findIndex(s => s.id === currentSection);
    return ((currentIndex + 1) / sections.length) * 100;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-[#ef4805] h-2 rounded-full transition-all duration-300"
          style={{ width: `${getProgressPercentage()}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ConsentFormProgress;
