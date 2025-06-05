
import React, { useState, useEffect } from 'react';
import { Save, Send, MapPin, AlertCircle } from 'lucide-react';
import { saveFormData, syncPendingForms, deleteDraft } from '../utils/indexedDB';
import { useToast } from '@/hooks/use-toast';
import { getRegionWithFallback, Region, REGIONS } from '../utils/regionDetection';
import { useLocation, useNavigate } from 'react-router-dom';
import FormSection from './FormSection';
import PatientDetailsSection from './PatientDetailsSection';
import AccountHolderSection from './AccountHolderSection';
import PaymentEmergencySection from './PaymentEmergencySection';
import MedicalHistorySection from './MedicalHistorySection';
import ConsentSection from './ConsentSection';

interface FormData {
  [key: string]: any;
  id?: number;
  responsibleForPayment?: string;
  paymentPreference?: string;
  region?: string;
  regionCode?: string;
  doctor?: string;
  practiceNumber?: string;
  patientName?: string;
}

const ConsentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('patientDetails');
  const [formData, setFormData] = useState<FormData>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regionDetected, setRegionDetected] = useState(false);
  const [isResuming, setIsResuming] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
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

    // Initialize form
    initializeForm();

    // Set up auto-save interval
    const autoSaveInterval = setInterval(() => {
      if (autoSaveEnabled && isDirty && Object.keys(formData).length > 0) {
        autoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    // Set up beforeunload handler
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(autoSaveInterval);
    };
  }, [autoSaveEnabled, isDirty, formData]);

  const initializeForm = async () => {
    // Check if resuming a draft
    const resumeDraft = location.state?.resumeDraft;
    if (resumeDraft) {
      setIsResuming(true);
      setFormData(resumeDraft);
      
      // Set region from draft
      const region = REGIONS[resumeDraft.regionCode] || REGIONS.PTA;
      setCurrentRegion(region);
      setRegionDetected(true);
      
      toast({
        title: "Draft Resumed",
        description: `Continuing form for ${resumeDraft.patientName || 'patient'}`,
      });
      
      setIsResuming(false);
    } else {
      // Detect region for new form
      await detectAndSetRegion();
    }
  };

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

  const autoSave = async () => {
    try {
      const savedId = await saveFormData({ ...formData, timestamp: new Date().toISOString() }, true);
      setFormData(prev => ({ ...prev, id: savedId }));
      setLastSaved(new Date());
      setIsDirty(false);
      console.log('Auto-saved draft');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const saveForm = async () => {
    try {
      const savedId = await saveFormData({ ...formData, timestamp: new Date().toISOString() }, true);
      setFormData(prev => ({ ...prev, id: savedId }));
      setLastSaved(new Date());
      setIsDirty(false);
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
      // Validate required fields
      if (!formData.patientName || !formData.idNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in patient name and ID number before submitting.",
          variant: "destructive",
        });
        return;
      }

      const finalData = { 
        ...formData, 
        timestamp: new Date().toISOString(), 
        synced: false,
        submissionId: `${formData.regionCode}-${Date.now()}`,
        status: 'completed'
      };
      
      await saveFormData(finalData, false);
      
      // Delete draft if resuming
      if (formData.id && isResuming) {
        try {
          await deleteDraft(formData.id);
        } catch (error) {
          console.log('Draft deletion failed (may not exist):', error);
        }
      }
      
      if (isOnline) {
        await syncPendingForms();
      }
      
      toast({
        title: "Form Submitted",
        description: isOnline ? 
          `Form submitted successfully for ${currentRegion?.name}!` : 
          "Form saved and will sync when online.",
      });

      // Navigate back to home after successful submission
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
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

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return lastSaved.toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
            {isDirty && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                Unsaved changes
              </span>
            )}
            {lastSaved && (
              <span className="text-xs text-gray-500">
                Last saved: {formatLastSaved()}
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
                {isResuming && <span className="text-lg text-gray-600 ml-2">(Resumed)</span>}
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

            {/* Auto-save notification */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Your progress is automatically saved every 30 seconds. You can safely close and resume later.
              </p>
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
