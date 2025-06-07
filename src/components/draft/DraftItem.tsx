
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface DraftItemProps {
  draft: any;
  onDelete: (draftId: string, e: React.MouseEvent) => void;
  onDoctorChange: (draft: any, newRegionCode: string) => void;
  formatDate: (timestamp: string) => string;
  getDoctorOptions: () => { code: string; name: string; doctor: string }[];
  onContinue: () => void;
}

const DraftItem = ({ 
  draft, 
  onDelete, 
  onDoctorChange, 
  formatDate, 
  getDoctorOptions,
  onContinue 
}: DraftItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">
              {draft.patient_name || draft.patientName || 'Unnamed Patient'}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span className="inline-flex items-center">
                <User className="w-4 h-4 mr-1" />
                {draft.doctor || 'Dr. Vorster'}
              </span>
              <span>{draft.region_code || draft.regionCode || 'PTA'}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Last saved: {formatDate(draft.timestamp || draft.last_modified || draft.lastModified)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              Draft
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onDelete(draft.id, e)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Delete draft"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              to={`/consent-form?draft=${encodeURIComponent(JSON.stringify(draft))}`}
              onClick={onContinue}
            >
              <Button className="bg-[#ef4805] hover:bg-[#d63d04]">
                Continue Form
              </Button>
            </Link>
            
            <div className="text-sm text-gray-500 flex items-center">
              <span className="mr-2">Change Doctor:</span>
              <select
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                value={draft.region_code || draft.regionCode || 'PTA'}
                onChange={(e) => onDoctorChange(draft, e.target.value)}
              >
                {getDoctorOptions().map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.doctor} ({option.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftItem;
