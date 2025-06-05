
import React from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface PaymentEmergencySectionProps {
  formData: any;
  onInputChange: (name: string, value: string) => void;
  onCheckboxChange?: (name: string, value: string, checked: boolean) => void;
}

const PaymentEmergencySection = ({ formData, onInputChange }: PaymentEmergencySectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Payment and Emergency Contact</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          25. Payment Preference
        </label>
        <RadioGroup
          value={formData.paymentPreference || ''}
          onValueChange={(value) => onInputChange('paymentPreference', value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Card/EFT/Snapcan" id="cardEft" />
            <label htmlFor="cardEft" className="text-sm">Card/EFT/Snapcan</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Medical Aid" id="medicalAid" />
            <label htmlFor="medicalAid" className="text-sm">Medical Aid</label>
          </div>
        </RadioGroup>
      </div>

      {formData.paymentPreference === 'Medical Aid' && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                26. Medical Aid Name *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.medicalAidName || ''}
                onChange={(e) => onInputChange('medicalAidName', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                27. Medical Aid No. *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.medicalAidNo || ''}
                onChange={(e) => onInputChange('medicalAidNo', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                28. Plan *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.medicalAidPlan || ''}
                onChange={(e) => onInputChange('medicalAidPlan', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                29. Main Member *
              </label>
              <input
                type="text"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.mainMember || ''}
                onChange={(e) => onInputChange('mainMember', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                30. Dependant Code (if applicable)
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                value={formData.dependantCode || ''}
                onChange={(e) => onInputChange('dependantCode', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            31. Emergency Contact Name and Surname *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            value={formData.emergencyName || ''}
            onChange={(e) => onInputChange('emergencyName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            32. Relationship *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            value={formData.emergencyRelationship || ''}
            onChange={(e) => onInputChange('emergencyRelationship', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            33. Cell Phone Number *
          </label>
          <input
            type="tel"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            value={formData.emergencyPhone || ''}
            onChange={(e) => onInputChange('emergencyPhone', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentEmergencySection;
