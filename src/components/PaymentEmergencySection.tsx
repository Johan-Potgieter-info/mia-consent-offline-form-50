
import React from 'react';

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
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentPreference"
              value="Card/EFT/Snapcan"
              className="mr-2"
              onChange={(e) => onInputChange('paymentPreference', e.target.value)}
            />
            <span className="text-sm">Card/EFT/Snapcan</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentPreference"
              value="Medical Aid"
              className="mr-2"
              onChange={(e) => onInputChange('paymentPreference', e.target.value)}
            />
            <span className="text-sm">Medical Aid</span>
          </label>
        </div>
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
            onChange={(e) => onInputChange('emergencyPhone', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default PaymentEmergencySection;
