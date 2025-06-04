
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Database, Wifi, WifiOff } from "lucide-react";
import { getAllForms, clearSyncedForms } from "@/utils/indexedDB";

const Index = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedForms, setSavedForms] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load saved forms count
    loadFormsCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadFormsCount = async () => {
    try {
      const forms = await getAllForms();
      setSavedForms(forms.length);
    } catch (error) {
      console.error('Error loading forms count:', error);
    }
  };

  const clearForms = async () => {
    try {
      await clearSyncedForms();
      await loadFormsCount();
    } catch (error) {
      console.error('Error clearing forms:', error);
    }
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
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4 mr-1" /> : <WifiOff className="w-4 h-4 mr-1" />}
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <span className="text-sm text-gray-600">
              <Database className="w-4 h-4 inline mr-1" />
              {savedForms} saved forms
            </span>
          </div>
          {savedForms > 0 && (
            <Button variant="outline" size="sm" onClick={clearForms}>
              Clear Synced Forms
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#ef4805] mb-2">
              Mia Healthcare Services
            </h1>
            <p className="text-gray-600 mb-8">
              Complete your consent form online or offline. Your data is securely stored and synced when connected.
            </p>
          </div>

          <div className="grid md:grid-cols-1 max-w-md mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-[#ef4805]">
                  <FileText className="w-5 h-5 mr-2" />
                  Patient Consent Form
                </CardTitle>
                <CardDescription>
                  Complete the Mia Information and Consent Form for dental treatment.
                  Works offline and syncs when online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/consent-form')} 
                  className="w-full bg-[#ef4805] hover:bg-[#f47d4a]"
                >
                  Start Form
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Offline Capability</h3>
            <p className="text-sm text-blue-700">
              This application works completely offline. Your form data is saved locally on your device 
              and will automatically sync with our servers when you're back online.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
