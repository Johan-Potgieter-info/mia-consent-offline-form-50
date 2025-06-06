
import React from 'react';
import { MapPin, AlertCircle, Save, Database, CheckCircle, Loader2, X } from 'lucide-react';
import { Region } from '../utils/regionDetection';

interface ConsentFormStatusBarProps {
  isOnline: boolean;
  currentRegion: Region | null;
  isDirty: boolean;
  lastSaved: Date | null;
  formatLastSaved: () => string;
  onSave: () => void;
  dbInitialized?: boolean;
  autoSaveStatus?: 'idle' | 'saving' | 'success' | 'error';
  retryCount?: number;
}

const ConsentFormStatusBar = ({ 
  isOnline, 
  currentRegion, 
  isDirty, 
  lastSaved, 
  formatLastSaved, 
  onSave,
  dbInitialized = true,
  autoSaveStatus = 'idle',
  retryCount = 0
}: ConsentFormStatusBarProps) => {
  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Auto-saving...
          </span>
        );
      case 'success':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Auto-saved
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Auto-save failed {retryCount > 0 && `(${retryCount} retries)`}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-6 flex justify-between items-center">
      <div className="flex items-center space-x-4 flex-wrap gap-y-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </span>
        
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          dbInitialized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          <Database className="w-3 h-3 mr-1" />
          {dbInitialized ? 'Storage Available' : 'Using Fallback Storage'}
        </span>
        
        {currentRegion && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <MapPin className="w-3 h-3 mr-1" />
            {currentRegion.code} - {currentRegion.name}
          </span>
        )}
        
        {isDirty && autoSaveStatus !== 'saving' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Unsaved changes
          </span>
        )}
        
        {getAutoSaveIndicator()}
        
        {lastSaved && (
          <span className="text-xs text-gray-500">
            Last saved: {formatLastSaved()}
          </span>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={onSave}
          className={`flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors ${
            autoSaveStatus === 'error' || retryCount > 0
            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          <Save className="w-4 h-4 mr-1" />
          {autoSaveStatus === 'error' || retryCount > 0 ? 'Save Now' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default ConsentFormStatusBar;
