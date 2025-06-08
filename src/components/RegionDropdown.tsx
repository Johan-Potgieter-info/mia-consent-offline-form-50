
import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { Region, REGIONS } from '../utils/regionDetection';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';

interface RegionDropdownProps {
  currentRegion: Region | null;
  onRegionSelect: (region: Region) => void;
  isFromDraft?: boolean;
  isDetected?: boolean;
}

const RegionDropdown = ({ 
  currentRegion, 
  onRegionSelect, 
  isFromDraft = false,
  isDetected = false 
}: RegionDropdownProps) => {
  if (!currentRegion) return null;

  const getIndicatorColor = () => {
    if (isFromDraft) return 'bg-purple-100 text-purple-800';
    if (isDetected) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getIndicatorText = () => {
    if (isFromDraft) return 'From Draft';
    if (isDetected) return 'Auto-detected';
    return 'Manual';
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIndicatorColor()} hover:opacity-80 transition-opacity cursor-pointer`}
        >
          <MapPin className="w-3 h-3 mr-1" />
          {currentRegion.code} - {currentRegion.name}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b bg-gray-50">
          <h4 className="font-medium text-sm text-gray-900">Select Region & Doctor</h4>
          <p className="text-xs text-gray-500 mt-1">
            Current: {getIndicatorText()}
          </p>
        </div>
        <div className="p-3 space-y-2">
          {Object.values(REGIONS).map((region) => (
            <button
              key={region.code}
              onClick={() => onRegionSelect(region)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                currentRegion.code === region.code
                  ? 'border-[#ef4805] bg-orange-50 text-[#ef4805]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-sm">{region.name}</div>
              <div className="text-sm text-gray-600">{region.doctor}</div>
              <div className="text-xs text-gray-500">Practice: {region.practiceNumber}</div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RegionDropdown;
