
import React from 'react';

interface MedicalHistorySectionProps {
  formData: any;
  onInputChange: (name: string, value: string) => void;
  onCheckboxChange: (name: string, value: string, checked: boolean) => void;
}

const MedicalHistorySection = ({ formData, onInputChange, onCheckboxChange }: MedicalHistorySectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Medical History</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            34. GP's Name (optional)
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('gpName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            35. GP's Contact No. (optional)
          </label>
          <input
            type="tel"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('gpContact', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          36. Chronic Conditions
        </label>
        <div className="grid md:grid-cols-2 gap-2">
          {[
            'Alzheimers', 'Anaemia', 'Arthritis', 'Asthma/Lung Disease',
            'Bleeding Disorders', 'On warfarin/Aspirin or anticoagulants',
            'Cancer Treatment', 'Diabetes', 'Dizziness/Fainting Spells',
            'Epilepsy', 'Rheumatic Fever', 'Heart Disease',
            'High/low Blood Pressure', 'Hepatitis/Liver Disease',
            'HIV/Aids', 'Sinusitis', 'Ulcers', 'Other'
          ].map(condition => (
            <label key={condition} className="flex items-center">
              <input
                type="checkbox"
                value={condition}
                className="mr-2"
                onChange={(e) => onCheckboxChange('chronicConditions', condition, e.target.checked)}
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          37. Allergies *
        </label>
        <input
          type="text"
          required
          placeholder="Please answer 'Nil' if you have no allergies"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
          onChange={(e) => onInputChange('allergies', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          42. Medication *
        </label>
        <input
          type="text"
          required
          placeholder="Please answer 'Nil' if you are not on any medication"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
          onChange={(e) => onInputChange('medication', e.target.value)}
        />
      </div>
    </>
  );
};

export default MedicalHistorySection;
