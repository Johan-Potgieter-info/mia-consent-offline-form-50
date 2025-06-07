
import { useState } from 'react';
import { FormData } from '../types/formTypes';

interface UseFormDataResult {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, value: string, checked: boolean) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}

export const useFormData = (): UseFormDataResult => {
  const [formData, setFormData] = useState<FormData>({});
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = (prev[name] as string[]) || [];
      if (checked) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        return { ...prev, [name]: currentValues.filter(v => v !== value) };
      }
    });
    setIsDirty(true);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleCheckboxChange,
    isDirty,
    setIsDirty
  };
};
