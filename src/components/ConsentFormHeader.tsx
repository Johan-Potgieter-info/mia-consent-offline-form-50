
import React from 'react';
import { Region } from '../utils/regionDetection';

interface ConsentFormHeaderProps {
  currentRegion: Region | null;
  regionDetected: boolean;
  isResuming: boolean;
}

const ConsentFormHeader = ({ currentRegion, regionDetected, isResuming }: ConsentFormHeaderProps) => {
  console.log('ConsentFormHeader - Using new Mia logo: /mia-consent-offline-form-50/images/icon-192.png');
  
  return (
    <div className="bg-[#ef4805] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-3 inline-block rounded-lg">
          <img 
            src="/mia-consent-offline-form-50/images/icon-192.png" 
            alt="Mia Healthcare"
            className="h-16 w-auto"
            onError={(e) => {
              console.error('ConsentFormHeader - New Mia logo failed to load:', e);
              console.log('ConsentFormHeader - Attempted path:', e.currentTarget.src);
            }}
            onLoad={() => {
              console.log('ConsentFormHeader - New Mia logo loaded successfully');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsentFormHeader;
