import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Save, Send } from 'lucide-react';
import { saveFormData, syncPendingForms } from '../utils/indexedDB';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  [key: string]: any;
  responsibleForPayment?: string;
  paymentPreference?: string;
}

const ConsentForm = () => {
  const [activeSection, setActiveSection] = useState('patientDetails');
  const [formData, setFormData] = useState<FormData>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  const sections = [
    { id: 'patientDetails', title: 'Patient Details' },
    { id: 'accountHolder', title: 'Account Holder Details' },
    { id: 'paymentEmergency', title: 'Payment and Emergency Contact' },
    { id: 'medicalHistory', title: 'Medical History' },
    { id: 'consent', title: 'Consent' },
  ];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingForms();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      const finalData = { ...formData, timestamp: new Date().toISOString(), synced: false };
      await saveFormData(finalData);
      
      if (isOnline) {
        await syncPendingForms();
      }
      
      toast({
        title: "Form Submitted",
        description: isOnline ? "Form submitted successfully!" : "Form saved and will sync when online.",
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
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  activeSection === section.id ? 'bg-[#ef4805] text-white' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{index + 1}. {section.title}</span>
                  {activeSection === section.id ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#ef4805] mb-2">
                Mia Information and Consent Form PTA
              </h1>
              <p className="text-gray-600">Dr. Vorster Practice Number: 1227831</p>
            </div>

            {/* Patient Details Section */}
            {activeSection === 'patientDetails' && (
              <div className="space-y-6">
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
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
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
                      onChange={(e) => handleInputChange('age', e.target.value)}
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
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
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
                      onChange={(e) => handleInputChange('idNo', e.target.value)}
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
                          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
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
                          onChange={(e) => handleInputChange('gender', e.target.value)}
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
                      onChange={(e) => handleInputChange('employerSchool', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      8. Occupation/Grade
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('occupationGrade', e.target.value)}
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
                      onChange={(e) => handleInputChange('cellPhone', e.target.value)}
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
                      onChange={(e) => handleInputChange('email', e.target.value)}
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
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    12. Address Postal Code
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Account Holder Section */}
            {activeSection === 'accountHolder' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Account Holder Details</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    13. Person Responsible for Account Payment *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="responsibleForPayment"
                        value="Parent/Main member/Someone else"
                        required
                        className="mr-2"
                        onChange={(e) => handleInputChange('responsibleForPayment', e.target.value)}
                      />
                      <span className="text-sm">Parent/Main member/Someone else</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="responsibleForPayment"
                        value="Myself"
                        className="mr-2"
                        onChange={(e) => handleInputChange('responsibleForPayment', e.target.value)}
                      />
                      <span className="text-sm">Myself</span>
                    </label>
                  </div>
                </div>

                {formData.responsibleForPayment === 'Parent/Main member/Someone else' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          14. Name and Surname
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          15. Age
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('accountHolderAge', e.target.value)}
                        />
                      </div>
                    </div>
                    {/* Additional account holder fields would go here */}
                  </div>
                )}
              </div>
            )}

            {/* Payment and Emergency Contact Section */}
            {activeSection === 'paymentEmergency' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Payment and Emergency Contact</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    25. Payment Preference
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentPreference"
                        value="Card/EFT/Snapcan"
                        className="mr-2"
                        onChange={(e) => handleInputChange('paymentPreference', e.target.value)}
                      />
                      <span className="text-sm">Card/EFT/Snapcan</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentPreference"
                        value="Medical Aid"
                        className="mr-2"
                        onChange={(e) => handleInputChange('paymentPreference', e.target.value)}
                      />
                      <span className="text-sm">Medical Aid</span>
                    </label>
                  </div>
                </div>

                {formData.paymentPreference === 'Medical Aid' && (
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          26. Medical Aid Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('medicalAidName', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          27. Medical Aid No. *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('medicalAidNo', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          28. Plan *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('medicalAidPlan', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          29. Main Member *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('mainMember', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          30. Dependant Code (if applicable)
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                          onChange={(e) => handleInputChange('dependantCode', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      31. Emergency Contact Name and Surname *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      32. Relationship *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      33. Cell Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Section */}
            {activeSection === 'medicalHistory' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Medical History</h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      34. GP's Name (optional)
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('gpName', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      35. GP's Contact No. (optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('gpContact', e.target.value)}
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
                          onChange={(e) => handleCheckboxChange('chronicConditions', condition, e.target.checked)}
                        />
                        <span className="text-sm">{condition}</span>
                      </label>
                    ))}
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
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                  />
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
                    onChange={(e) => handleInputChange('medication', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Consent Section */}
            {activeSection === 'consent' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[#ef4805] mb-4">Consent</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="mb-2">
                    <a 
                      href="https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//Mia%20Consent%20Form.pdf" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#ef4805] underline font-medium"
                    >
                      MIA Consent Form
                    </a>
                  </p>
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> Make sure to return to this form on your browser tab after reading the document. 
                    On some devices, clicking the link may open a new window, but your progress will be saved here.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      44. I have read and agree with terms and conditions provided in the document
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="terms"
                          value="Agree"
                          className="mr-2"
                          onChange={(e) => handleInputChange('terms', e.target.value)}
                        />
                        <span className="text-sm">Agree</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="terms"
                          value="Disagree"
                          className="mr-2"
                          onChange={(e) => handleInputChange('terms', e.target.value)}
                        />
                        <span className="text-sm">Disagree</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      51. Please enter your full name and surname followed by the date
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4805] focus:border-transparent"
                      onChange={(e) => handleInputChange('signature', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

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
