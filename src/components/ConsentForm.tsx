
import React, { useState, useEffect } from 'react';
import { Save, Send, MapPin } from 'lucide-react';
import { saveFormData, syncPendingForms } from '../utils/indexedDB';
import { useToast } from '@/hooks/use-toast';
import { getRegionWithFallback, Region, REGIONS } from '../utils/regionDetection';
import FormSection from './FormSection';
import PatientDetailsSection from './PatientDetailsSection';
import AccountHolderSection from './AccountHolderSection';
import PaymentEmergencySection from './PaymentEmergencySection';
import MedicalHistorySection from './MedicalHistorySection';
import ConsentSection from './ConsentSection';

interface FormData {
  [key: string]: any;
  responsibleForPayment?: string;
  paymentPreference?: string;
  region?: string;
  regionCode?: string;
  doctor?: string;
  practiceNumber?: string;
}

const ConsentForm = () => {
  const [activeSection, setActiveSection] = useState('patientDetails');
  const [formData, setFormData] = useState<FormData>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regionDetected, setRegionDetected] = useState(false);
  const { toast } = useToast();

  const sections = [
    { id: 'patientDetails', title: '1. Patient Details', component: PatientDetailsSection },
    { id: 'accountHolder', title: '2. Account Holder Details', component: AccountHolderSection },
    { id: 'paymentEmergency', title: '3. Payment and Emergency Contact', component: PaymentEmergencySection },
    { id: 'medicalHistory', title: '4. Medical History', component: MedicalHistorySection },
    { id: 'consent', title: '5. Consent', component: ConsentSection },
  ];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingForms();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detect region on component mount
    detectAndSetRegion();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const detectAndSetRegion = async () => {
    try {
      const region = await getRegionWithFallback();
      setCurrentRegion(region);
      setRegionDetected(true);
      
      // Automatically update form data with region information
      setFormData(prev => ({
        ...prev,
        region: region.name,
        regionCode: region.code,
        doctor: region.doctor,
        practiceNumber: region.practiceNumber
      }));

      toast({
        title: "Region Detected",
        description: `Form will be submitted for ${region.name} (${region.code}) - ${region.doctor}`,
      });
    } catch (error) {
      console.error('Region detection failed:', error);
      toast({
        title: "Region Detection Failed",
        description: "Using default region (PTA)",
        variant: "destructive",
      });
      
      // Set default region
      const defaultRegion = REGIONS.PTA;
      setCurrentRegion(defaultRegion);
      setFormData(prev => ({
        ...prev,
        region: defaultRegion.name,
        regionCode: defaultRegion.code,
        doctor: defaultRegion.doctor,
        practiceNumber: defaultRegion.practiceNumber
      }));
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
  };

  const saveForm = async () => {
    try {
      await saveFormData({ ...formData, timestamp: new Date().toISOString(), synced: false });
      toast({
        title: "Form Saved",
        description: "Your progress has been saved locally.",
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: "Failed to save form data.",
        variant: "destructive",
      });
    }
  };

  const submitForm = async () => {
    try {
      const finalData = { 
        ...formData, 
        timestamp: new Date().toISOString(), 
        synced: false,
        submissionId: `${formData.regionCode}-${Date.now()}`
      };
      await saveFormData(finalData);
      
      if (isOnline) {
        await syncPendingForms();
      }
      
      toast({
        title: "Form Submitted",
        description: isOnline ? 
          `Form submitted successfully for ${currentRegion?.name}!` : 
          "Form saved and will sync when online.",
      });
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Failed to submit form.",
        variant: "destructive",
      });
    }
  };

  const getProgressPercentage = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    return ((currentIndex + 1) / sections.length) * 100;
  };

  const renderActiveSection = () => {
    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    const SectionComponent = section.component;
    return (
      <SectionComponent
        formData={formData}
        onInputChange={handleInputChange}
        onCheckboxChange={handleCheckboxChange}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#ef4805] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-3 inline-block rounded-lg">
            <img 
              src="https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//logoWeb-ezgif.com-optiwebp.webp" 
              alt="Mia Gesondheidsorgdienste Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(getProgressPercentage())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#ef4805] h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-sm p-3 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            {currentRegion && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <MapPin className="w-3 h-3 mr-1" />
                {currentRegion.code} - {currentRegion.name}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={saveForm}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Save className="w-4 h-4 mr-1" />
              Save
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Section Navigation */}
          <div className="border-b border-gray-200">
            {sections.map((section) => (
              <FormSection
                key={section.id}
                id={section.id}
                title={section.title}
                isActive={activeSection === section.id}
                onToggle={setActiveSection}
              >
                {activeSection === section.id && renderActiveSection()}
              </FormSection>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#ef4805] mb-2">
                Mia Information and Consent Form {currentRegion?.code || 'PTA'}
              </h1>
              <p className="text-gray-600">
                {currentRegion?.doctor || 'Dr. Vorster'} Practice Number: {currentRegion?.practiceNumber || '1227831'}
              </p>
              {regionDetected && currentRegion && (
                <p className="text-sm text-gray-500 mt-1">
                  Region: {currentRegion.name} ({currentRegion.code})
                </p>
              )}
            </div>

            {/* Navigation and Submit */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sections[currentIndex - 1].id);
                  }
                }}
                disabled={sections.findIndex(s => s.id === activeSection) === 0}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={saveForm}
                  className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </button>

                {sections.findIndex(s => s.id === activeSection) === sections.length - 1 ? (
                  <button
                    onClick={submitForm}
                    className="flex items-center px-6 py-2 bg-[#ef4805] text-white rounded-lg hover:bg-[#f47d4a] transition-colors"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Form
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const currentIndex = sections.findIndex(s => s.id === activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1].id);
                      }
                    }}
                    className="px-4 py-2 bg-[#ef4805] text-white rounded-lg hover:bg-[#f47d4a] transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
