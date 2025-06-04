
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface FormSectionProps {
  id: string;
  title: string;
  isActive: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}

const FormSection = ({ id, title, isActive, onToggle, children }: FormSectionProps) => {
  return (
    <>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
          isActive ? 'bg-[#ef4805] text-white' : 'text-gray-700'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-medium">{title}</span>
          {isActive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
        </div>
      </button>
      {isActive && (
        <div className="p-6 space-y-6">
          {children}
        </div>
      )}
    </>
  );
};

export default FormSection;
