
import React from 'react';
import { FormData } from '../types/formTypes';

interface ConsentSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onCheckboxChange: (field: keyof FormData, value: string, checked: boolean) => void;
}

const ConsentSection = ({ formData, onInputChange, onCheckboxChange }: ConsentSectionProps) => {
  console.log('ConsentSection - Current consent agreement:', formData.consentAgreement);

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Consent Agreement</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Dental Treatment Consent</h4>
        <div className="text-sm text-gray-700 space-y-2 mb-4">
          <p>I understand that dentistry is not an exact science and that no guarantee has been made to me as to the outcome of the treatment.</p>
          <p>I consent to the dental treatment as explained to me and understand the risks, benefits, and alternatives.</p>
          <p>I authorize the dentist to perform the agreed-upon treatment and any additional procedures that may be necessary.</p>
          <p>I understand that I am financially responsible for all services rendered on my behalf.</p>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consentAgreement"
            checked={formData.consentAgreement || false}
            onChange={(e) => {
              console.log('Consent agreement changed:', e.target.checked);
              onCheckboxChange('consentAgreement', 'true', e.target.checked);
            }}
            className="mt-1 h-4 w-4 text-[#ef4805] border-gray-300 rounded focus:ring-[#ef4805]"
          />
          <label 
            htmlFor="consentAgreement" 
            className="text-sm text-gray-700 cursor-pointer"
          >
            <span className="font-medium text-red-600">* Required:</span> I have read, understood, and agree to the terms of this dental treatment consent form. I consent to the proposed treatment.
          </label>
        </div>

        {!formData.consentAgreement && (
          <div className="mt-2 text-sm text-red-600">
            You must agree to the consent form to proceed with treatment.
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsentSection;
