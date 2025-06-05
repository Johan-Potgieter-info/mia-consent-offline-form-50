
import React from 'react';
import { Checkbox } from './ui/checkbox';

interface MedicalHistorySectionProps {
  formData: any;
  onInputChange: (name: string, value: string) => void;
  onCheckboxChange: (name: string, value: string, checked: boolean) => void;
}

const MedicalHistorySection = ({ formData, onInputChange, onCheckboxChange }: MedicalHistorySectionProps) => {
  const handleNilCheckbox = (fieldName: string, checked: boolean) => {
    if (checked) {
      onInputChange(fieldName, 'Nil');
    } else {
      onInputChange(fieldName, '');
    }
  };

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
            value={formData.gpName || ''}
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
            value={formData.gpContact || ''}
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
                checked={(formData.chronicConditions || []).includes(condition)}
                onChange={(e) => onCheckboxChange('chronicConditions', condition, e.target.checked)}
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <Checkbox
            id="noChronicConditions"
            checked={formData.chronicConditions === 'None'}
            onCheckedChange={(checked) => {
              if (checked) {
                onInputChange('chronicConditions', 'None');
              } else {
                onInputChange('chronicConditions', '');
              }
            }}
          />
          <label htmlFor="noChronicConditions" className="text-sm text-gray-600">
            No chronic conditions
          </label>
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
          value={formData.allergies || ''}
          onChange={(e) => onInputChange('allergies', e.target.value)}
        />
        <div className="mt-2 flex items-center space-x-2">
          <Checkbox
            id="nilAllergies"
            checked={formData.allergies === 'Nil'}
            onCheckedChange={(checked) => handleNilCheckbox('allergies', checked === true)}
          />
          <label htmlFor="nilAllergies" className="text-sm text-gray-600">
            No allergies (Nil)
          </label>
        </div>
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
          value={formData.medication || ''}
          onChange={(e) => onInputChange('medication', e.target.value)}
        />
        <div className="mt-2 flex items-center space-x-2">
          <Checkbox
            id="nilMedication"
            checked={formData.medication === 'Nil'}
            onCheckedChange={(checked) => handleNilCheckbox('medication', checked === true)}
          />
          <label htmlFor="nilMedication" className="text-sm text-gray-600">
            No medication (Nil)
          </label>
        </div>
      </div>
    </>
  );
};

export default MedicalHistorySection;
