
import React from 'react';
import { Region } from '../utils/regionDetection';

interface ConsentFormHeaderProps {
  currentRegion: Region | null;
  regionDetected: boolean;
  isResuming: boolean;
}

const ConsentFormHeader = ({ currentRegion, regionDetected, isResuming }: ConsentFormHeaderProps) => {
  return (
    <div className="bg-[#ef4805] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-3 inline-block rounded-lg">
          <img 
            src="https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//logoWeb-ezgif.com-optiwebp.webp" 
            alt="Mia Gesondheidsorgdienste Logo"
            className="h-10 w-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default ConsentFormHeader;
