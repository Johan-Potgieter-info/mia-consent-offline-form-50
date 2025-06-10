
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useConnectivity } from '../hooks/useConnectivity';

const ConsentPage = () => {
  const navigate = useNavigate();
  const { isOnline } = useConnectivity();

  // Redirect to home if offline
  React.useEffect(() => {
    if (!isOnline) {
      navigate('/', { replace: true });
    }
  }, [isOnline, navigate]);

  // Show offline message if user somehow reaches this page while offline
  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <WifiOff className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <CardTitle className="text-xl text-gray-900">
              Consent Form Unavailable Offline
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">
              The consent form requires an internet connection to view. Please connect to the internet and try again.
            </p>
            <Button onClick={() => navigate('/consent-form')} className="w-full">
              Return to Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#ef4805] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-3 inline-block rounded-lg">
            <img 
              src="/lovable-uploads/2741077b-1d2b-4fa2-9829-1d43a1a54427.png" 
              alt="Mia Healthcare" 
              className="h-16 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/consent-form')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#ef4805]">
              Dental Consent Form
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Informed Consent for Dental Treatment
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  I understand that dentistry is not an exact science and that therefore, reputable practitioners cannot properly guarantee results. I acknowledge that no guarantee or assurance has been made by anyone regarding the dental treatment which I have requested and authorized.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Treatment Risks and Complications
                </h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  I understand that all dental procedures may involve risks and potential complications, including but not limited to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Pain, swelling, and discomfort following treatment</li>
                  <li>Infection requiring additional treatment</li>
                  <li>Temporary or permanent nerve damage resulting in numbness</li>
                  <li>Damage to adjacent teeth or existing dental work</li>
                  <li>Allergic reactions to medications or materials</li>
                  <li>Need for additional procedures that are not initially apparent</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Financial Agreement
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  I understand that payment is due at the time of service unless other arrangements have been made. I understand that a service charge may be applied to any account that becomes delinquent.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Acknowledgment and Consent
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  I acknowledge that I have read and understand this consent form. I have had the opportunity to ask questions about my treatment, and all my questions have been answered to my satisfaction. I understand the risks, benefits, and alternatives to the proposed treatment.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  By proceeding with treatment, I give my informed consent for the dental procedures discussed and any additional procedures that may become necessary during treatment.
                </p>
              </section>

              <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Patient Rights
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  You have the right to refuse treatment, seek a second opinion, and have your questions answered. You may withdraw consent for treatment at any time before the procedure begins.
                </p>
              </section>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Return to the form to provide your consent agreement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsentPage;
