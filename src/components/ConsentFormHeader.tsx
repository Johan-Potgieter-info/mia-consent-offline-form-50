
import React from 'react';
import { Region } from '../utils/regionDetection';

interface ConsentFormHeaderProps {
  currentRegion: Region | null;
  regionDetected: boolean;
  isResuming: boolean;
}

const ConsentFormHeader = ({ currentRegion, regionDetected, isResuming }: ConsentFormHeaderProps) => {
  console.log('ConsentFormHeader - Logo path: /lovable-uploads/25d24f1c-8eda-4e3e-a4f7-0412eebf2eb9.png');
  
  return (
    <div className="bg-[#ef4805] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-3 inline-block rounded-lg">
          <img 
            src="/lovable-uploads/25d24f1c-8eda-4e3e-a4f7-0412eebf2eb9.png" 
            alt="Mia Healthcare"
            className="h-16 w-auto"
            onError={(e) => {
              console.error('ConsentFormHeader - Logo failed to load:', e);
              console.log('ConsentFormHeader - Attempted path:', e.currentTarget.src);
            }}
            onLoad={() => {
              console.log('ConsentFormHeader - Logo loaded successfully');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsentFormHeader;
