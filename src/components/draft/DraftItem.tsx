
import React from 'react';
import { Trash2, Calendar, MapPin, User2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import RegionDropdown from '../RegionDropdown';

interface DraftItemProps {
  draft: any;
  onDelete: (draftId: string, e: React.MouseEvent) => void;
  onDoctorChange: (draft: any, newRegionCode: string) => void;
  formatDate: (timestamp: string) => string;
  getDoctorOptions: () => { code: string; name: string; doctor: string }[];
  onContinue: () => void;
  isSelected?: boolean;
  onToggleSelection?: () => void;
  showCheckbox?: boolean;
}

const DraftItem = ({
  draft,
  onDelete,
  onDoctorChange,
  formatDate,
  getDoctorOptions,
  onContinue,
  isSelected = false,
  onToggleSelection,
  showCheckbox = false
}: DraftItemProps) => {
  const handleContinue = () => {
    const doctorOptions = getDoctorOptions();
    const selectedOption = doctorOptions.find(option => option.code === draft.regionCode) || doctorOptions[0];
    
    const updatedDraft = {
      ...draft,
      regionCode: selectedOption.code,
      region: selectedOption.name,
      doctor: selectedOption.doctor
    };
    
    window.location.href = `/consent-form?draft=${encodeURIComponent(JSON.stringify(updatedDraft))}`;
    onContinue();
  };

  const handleCheckboxChange = (checked: boolean | string) => {
    onToggleSelection?.();
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRegionSelect = (region: any) => {
    onDoctorChange(draft, region.code);
  };

  // Get the current region with all required properties
  const getCurrentRegion = () => {
    const doctorOptions = getDoctorOptions();
    const currentOption = doctorOptions.find(option => option.code === draft.regionCode) || doctorOptions[0];
    
    return {
      code: draft.regionCode || currentOption?.code || 'PTA',
      name: draft.region || currentOption?.name || 'Pretoria',
      doctor: currentOption?.doctor || 'Dr. Unknown',
      practiceNumber: '0123456' // Default practice number
    };
  };

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-[#ef4805] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleContinue}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {showCheckbox && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={handleCheckboxChange}
              onClick={handleCheckboxClick}
              className="mt-1 h-4 w-4"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <User2 className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-900 truncate">
                {draft.patientName || 'Unnamed Patient'}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Last saved: {formatDate(draft.lastModified || draft.timestamp)}</span>
              </div>
              
              {draft.regionCode && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Region: {draft.regionCode}</span>
                </div>
              )}
            </div>

            {(draft.idNumber || draft.cellPhone) && (
              <div className="mt-2 text-xs text-gray-500">
                {draft.idNumber && <span>ID: {draft.idNumber}</span>}
                {draft.idNumber && draft.cellPhone && <span> • </span>}
                {draft.cellPhone && <span>Phone: {draft.cellPhone}</span>}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <RegionDropdown
            currentRegion={getCurrentRegion()}
            onRegionSelect={handleRegionSelect}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => onDelete(draft.id, e)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftItem;
