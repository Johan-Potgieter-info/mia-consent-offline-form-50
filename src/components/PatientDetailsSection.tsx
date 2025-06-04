
import React from 'react';

interface PatientDetailsSectionProps {
  formData: any;
  onInputChange: (name: string, value: string) => void;
}

const PatientDetailsSection = ({ formData, onInputChange }: PatientDetailsSectionProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Patient Details</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1. Patient Name *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('patientName', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            2. Age *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('age', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            3. Birth Date *
          </label>
          <input
            type="date"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('birthDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            4. ID No. *
          </label>
          <input
            type="text"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('idNo', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          5. Marital Status
        </label>
        <div className="space-y-2">
          {['Single', 'Married', 'Divorced', 'Widowed'].map(status => (
            <label key={status} className="flex items-center">
              <input
                type="radio"
                name="maritalStatus"
                value={status}
                className="mr-2"
                onChange={(e) => onInputChange('maritalStatus', e.target.value)}
              />
              <span className="text-sm">{status}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          6. Gender *
        </label>
        <div className="space-y-2">
          {['Male', 'Female', 'Prefer not to say', 'Other'].map(gender => (
            <label key={gender} className="flex items-center">
              <input
                type="radio"
                name="gender"
                value={gender}
                required
                className="mr-2"
                onChange={(e) => onInputChange('gender', e.target.value)}
              />
              <span className="text-sm">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            7. Employer/School
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('employerSchool', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            8. Occupation/Grade
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('occupationGrade', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            9. Cell Phone No. *
          </label>
          <input
            type="tel"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('cellPhone', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            10. Email *
          </label>
          <input
            type="email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
            onChange={(e) => onInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          11. Address *
        </label>
        <input
          type="text"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
          onChange={(e) => onInputChange('address', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          12. Address Postal Code
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
          onChange={(e) => onInputChange('postalCode', e.target.value)}
        />
      </div>
    </>
  );
};

export default PatientDetailsSection;
