
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface FormValidationErrorsProps {
  errors: string[];
  isVisible: boolean;
}

const FormValidationErrors = ({ errors, isVisible }: FormValidationErrorsProps) => {
  if (!isVisible || errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-sm font-semibold text-red-800">
          Please fix the following errors before submitting:
        </h3>
      </div>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-sm text-red-700">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormValidationErrors;
