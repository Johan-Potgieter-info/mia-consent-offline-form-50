
import React from 'react';
import { MapPin, AlertCircle, Save } from 'lucide-react';
import { Region } from '../utils/regionDetection';

interface ConsentFormStatusBarProps {
  isOnline: boolean;
  currentRegion: Region | null;
  isDirty: boolean;
  lastSaved: Date | null;
  formatLastSaved: () => string;
  onSave: () => void;
}

const ConsentFormStatusBar = ({ 
  isOnline, 
  currentRegion, 
  isDirty, 
  lastSaved, 
  formatLastSaved, 
  onSave 
}: ConsentFormStatusBarProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {currentRegion && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <MapPin className="w-3 h-3 mr-1" />
            {currentRegion.code} - {currentRegion.name}
          </span>
        )}
        {isDirty && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unsaved changes
          </span>
        )}
        {lastSaved && (
          <span className="text-xs text-gray-500">
            Last saved: {formatLastSaved()}
          </span>
        )}
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onSave}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </button>
      </div>
    </div>
  );
};

export default ConsentFormStatusBar;
