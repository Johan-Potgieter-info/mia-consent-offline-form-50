
import React from 'react';

interface ConsentSectionProps {
  formData: any;
  onInputChange: (name: string, value: string) => void;
}

const ConsentSection = ({ formData, onInputChange }: ConsentSectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Consent</h2>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="mb-2">
          <a 
            href="https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//Mia%20Consent%20Form.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#ef4805] underline font-medium"
          >
            MIA Consent Form
          </a>
        </p>
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Make sure to return to this form on your browser tab after reading the document. 
          On some devices, clicking the link may open a new window, but your progress will be saved here.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            44. I have read and agree with terms and conditions provided in the document
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="terms"
                value="Agree"
                className="mr-2"
                onChange={(e) => onInputChange('terms', e.target.value)}
              />
              <span className="text-sm">Agree</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="terms"
                value="Disagree"
                className="mr-2"
                onChange={(e) => onInputChange('terms', e.target.value)}
              />
              <span className="text-sm">Disagree</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            51. Please enter your full name and surname followed by the date
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('signature', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default ConsentSection;
