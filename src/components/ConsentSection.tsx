
import React from 'react';
import { ExternalLink, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormData } from '../types/formTypes';
import { useConnectivity } from '../hooks/useConnectivity';

interface ConsentSectionProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  validationErrors: string[];
}

const ConsentSection = ({ formData, updateFormData, validationErrors }: ConsentSectionProps) => {
  const { isOnline } = useConnectivity();
  const hasConsentError = validationErrors.includes("You must agree to the consent form");

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Consent and Agreement
      </h3>
      
      {/* Consent Form Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">
          Review Dental Consent Form
        </h4>
        <p className="text-blue-800 mb-4 text-sm">
          Before proceeding, please review our complete consent form which outlines the risks, 
          benefits, and your rights regarding dental treatment.
        </p>
        
        {isOnline ? (
          <Link to="/consent-page" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Consent Form (Opens in new tab)
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-orange-600 bg-orange-50 p-3 rounded border border-orange-200">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm">
              Consent form requires internet connection. Please connect to view the full consent details.
            </span>
          </div>
        )}
      </div>

      {/* Consent Agreement Checkbox */}
      <div className={`space-y-3 ${hasConsentError ? 'border border-red-300 rounded-lg p-4 bg-red-50' : ''}`}>
        {hasConsentError && (
          <p className="text-red-600 text-sm font-medium">
            You must agree to the consent form to proceed
          </p>
        )}
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="consentAgreement"
            checked={formData.consentAgreement || false}
            onCheckedChange={(checked) => 
              updateFormData({ consentAgreement: checked as boolean })
            }
            className="mt-1"
          />
          <label 
            htmlFor="consentAgreement" 
            className="text-sm text-gray-700 leading-relaxed cursor-pointer flex-1"
          >
            I acknowledge that I have read and understand the consent form (or have had it explained to me), 
            and I agree to the dental treatment as outlined. I understand the risks, benefits, and alternatives 
            to the proposed treatment, and I give my informed consent to proceed.
          </label>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p>
          <strong>Note:</strong> By checking the agreement above, you confirm that you have reviewed 
          the complete consent form and agree to the terms of treatment. If you have any questions 
          or concerns, please discuss them with your dental provider before proceeding.
        </p>
      </div>
    </div>
  );
};

export default ConsentSection;
