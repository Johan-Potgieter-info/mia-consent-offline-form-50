
import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface AccountHolderSectionProps {
  formData: any;
  onInputChange: (name: string, value: string) => void;
  onCheckboxChange?: (name: string, value: string, checked: boolean) => void;
}

const AccountHolderSection = ({ formData, onInputChange }: AccountHolderSectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Account Holder Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          13. Person Responsible for Account Payment *
        </label>
        <RadioGroup
          value={formData.responsibleForPayment || ''}
          onValueChange={(value) => onInputChange('responsibleForPayment', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Parent/Main member/Someone else" id="parentMember" />
            <label htmlFor="parentMember" className="text-sm">Parent/Main member/Someone else</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Myself" id="myself" />
            <label htmlFor="myself" className="text-sm">Myself</label>
          </div>
        </RadioGroup>
      </div>

      {formData.responsibleForPayment === 'Parent/Main member/Someone else' && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                14. Name and Surname
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.accountHolderName || ''}
                onChange={(e) => onInputChange('accountHolderName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                15. Age
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.accountHolderAge || ''}
                onChange={(e) => onInputChange('accountHolderAge', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountHolderSection;
