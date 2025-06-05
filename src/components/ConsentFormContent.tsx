
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Region } from '../utils/regionDetection';

interface ConsentFormContentProps {
  currentRegion: Region | null;
  regionDetected: boolean;
  isResuming: boolean;
  children: React.ReactNode;
}

const ConsentFormContent = ({ 
  currentRegion, 
  regionDetected, 
  isResuming, 
  children 
}: ConsentFormContentProps) => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#ef4805] mb-2">
          Mia Information and Consent Form {currentRegion?.code || 'PTA'}
          {isResuming && <span className="text-lg text-gray-600 ml-2">(Resumed)</span>}
        </h1>
        <p className="text-gray-600">
          {currentRegion?.doctor || 'Dr. Vorster'} Practice Number: {currentRegion?.practiceNumber || '1227831'}
        </p>
        {regionDetected && currentRegion && (
          <p className="text-sm text-gray-500 mt-1">
            Region: {currentRegion.name} ({currentRegion.code})
          </p>
        )}
      </div>

      {/* Auto-save notification */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
        <p className="text-sm text-gray-600">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Your progress is automatically saved every 30 seconds. You can safely close and resume later.
        </p>
      </div>

      {children}
    </div>
  );
};

export default ConsentFormContent;
