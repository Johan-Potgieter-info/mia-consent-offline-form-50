
import React from 'react';
import { FormData } from '../types/formTypes';
import ValidatedInput from './ValidatedInput';

interface PatientDetailsSectionProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  validationErrors: string[];
}

const PatientDetailsSection = ({ formData, updateFormData, validationErrors }: PatientDetailsSectionProps) => {
  const hasError = (field: string) => {
    return validationErrors.some(error => error.toLowerCase().includes(field.toLowerCase()));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Patient Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ValidatedInput
          label="Patient Name"
          value={formData.patientName || ''}
          onChange={(value) => updateFormData({ patientName: value })}
          placeholder="Enter full name"
          required
          hasError={hasError('patient name')}
        />

        <ValidatedInput
          label="ID Number"
          value={formData.idNumber || ''}
          onChange={(value) => updateFormData({ idNumber: value })}
          placeholder="Enter ID number"
          required
          hasError={hasError('id number')}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status
          </label>
          <select
            value={formData.maritalStatus || ''}
            onChange={(e) => updateFormData({ maritalStatus: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            value={formData.gender || ''}
            onChange={(e) => updateFormData({ gender: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <ValidatedInput
          label="Age"
          type="number"
          value={formData.age?.toString() || ''}
          onChange={(value) => updateFormData({ age: value ? parseInt(value) : undefined })}
          placeholder="Enter age"
        />

        <ValidatedInput
          label="Date of Birth"
          type="date"
          value={formData.birthDate || ''}
          onChange={(value) => updateFormData({ birthDate: value })}
        />

        <ValidatedInput
          label="Employer/School"
          value={formData.employerSchool || ''}
          onChange={(value) => updateFormData({ employerSchool: value })}
          placeholder="Enter employer or school name"
        />

        <ValidatedInput
          label="Occupation/Grade"
          value={formData.occupationGrade || ''}
          onChange={(value) => updateFormData({ occupationGrade: value })}
          placeholder="Enter occupation or grade"
        />

        <ValidatedInput
          label="Cell Phone"
          value={formData.cellPhone || ''}
          onChange={(value) => updateFormData({ cellPhone: value })}
          placeholder="Enter cell phone number"
          required
          hasError={hasError('cell phone')}
        />

        <ValidatedInput
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(value) => updateFormData({ email: value })}
          placeholder="Enter email address"
        />

        <div className="md:col-span-2">
          <ValidatedInput
            label="Address"
            value={formData.address || ''}
            onChange={(value) => updateFormData({ address: value })}
            placeholder="Enter full address"
          />
        </div>

        <ValidatedInput
          label="Postal Code"
          value={formData.postalCode || ''}
          onChange={(value) => updateFormData({ postalCode: value })}
          placeholder="Enter postal code"
        />
      </div>
    </div>
  );
};

export default PatientDetailsSection;
