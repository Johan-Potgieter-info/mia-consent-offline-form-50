
import React from 'react';
import { FormData } from '../types/formTypes';
import ValidatedInput from './ValidatedInput';

interface PatientDetailsSectionProps {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string) => void;
  onCheckboxChange: (field: keyof FormData, value: string, checked: boolean) => void;
}

const PatientDetailsSection = ({ formData, onInputChange, onCheckboxChange }: PatientDetailsSectionProps) => {
  console.log('PatientDetailsSection - Current form data:', { 
    patientName: formData.patientName, 
    idNumber: formData.idNumber,
    cellPhone: formData.cellPhone,
    email: formData.email 
  });

  return (
    <div className="space-y-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedInput
          label="Patient Name *"
          type="text"
          value={formData.patientName || ''}
          onChange={(value) => {
            console.log('Patient name changed:', value);
            onInputChange('patientName', value);
          }}
          placeholder="Enter full name"
          required
        />

        <ValidatedInput
          label="ID Number *"
          type="text"
          value={formData.idNumber || ''}
          onChange={(value) => {
            console.log('ID number changed:', value);
            onInputChange('idNumber', value);
          }}
          placeholder="Enter ID number"
          required
        />

        <ValidatedInput
          label="Cell Phone *"
          type="tel"
          value={formData.cellPhone || ''}
          onChange={(value) => {
            console.log('Cell phone changed:', value);
            onInputChange('cellPhone', value);
          }}
          placeholder="Enter cell phone number"
          required
        />

        <ValidatedInput
          label="Email Address"
          type="email"
          value={formData.email || ''}
          onChange={(value) => {
            console.log('Email changed:', value);
            onInputChange('email', value);
          }}
          placeholder="Enter email address"
        />

        <ValidatedInput
          label="Date of Birth"
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={(value) => {
            console.log('Date of birth changed:', value);
            onInputChange('dateOfBirth', value);
          }}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => {
              console.log('Gender changed:', e.target.value);
              onInputChange('gender', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Marital Status</label>
          <select
            value={formData.maritalStatus || ''}
            onChange={(e) => {
              console.log('Marital status changed:', e.target.value);
              onInputChange('maritalStatus', e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
          >
            <option value="">Select marital status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>

        <ValidatedInput
          label="Emergency Contact Name"
          type="text"
          value={formData.emergencyContactName || ''}
          onChange={(value) => {
            console.log('Emergency contact name changed:', value);
            onInputChange('emergencyContactName', value);
          }}
          placeholder="Enter emergency contact name"
        />

        <ValidatedInput
          label="Emergency Contact Number"
          type="tel"
          value={formData.emergencyContactNumber || ''}
          onChange={(value) => {
            console.log('Emergency contact number changed:', value);
            onInputChange('emergencyContactNumber', value);
          }}
          placeholder="Enter emergency contact number"
        />
      </div>
    </div>
  );
};

export default PatientDetailsSection;
