
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Wifi, WifiOff, Database } from 'lucide-react';

const Index = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [pendingForms, setPendingForms] = React.useState(0);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending forms in IndexedDB
    checkPendingForms();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPendingForms = async () => {
    try {
      const request = indexedDB.open('MiaFormsDB', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['forms'], 'readonly');
        const store = transaction.objectStore('forms');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          setPendingForms(countRequest.result);
        };
      };
    } catch (error) {
      console.log('IndexedDB not available');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Mia Branding */}
      <div className="bg-[#ef4805] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-4 inline-block rounded-lg">
            <img 
              src="https://emiyxuareujqneuyewzq.supabase.co/storage/v1/object/public/email-assets//logoWeb-ezgif.com-optiwebp.webp" 
              alt="Mia Gesondheidsorgdienste Logo"
              className="h-12 w-auto"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#ef4805] mb-2">
            Mia Information and Consent Form PTA
          </h1>
          <p className="text-gray-600">Dr. Vorster Practice Number: 1227831</p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#ef4805]">
            <div className="flex items-center">
              {isOnline ? (
                <Wifi className="h-8 w-8 text-green-500 mr-3" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-500 mr-3" />
              )}
              <div>
                <h3 className="font-semibold">Connection Status</h3>
                <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h3 className="font-semibold">Local Storage</h3>
                <p className="text-sm text-gray-600">Forms saved locally</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <h3 className="font-semibold">Pending Sync</h3>
                <p className="text-sm text-gray-600">{pendingForms} forms</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <FileText className="h-16 w-16 text-[#ef4805] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Patient Consent Form
          </h2>
          <p className="text-gray-600 mb-6">
            Complete your dental consent form. Data is saved locally and synced when online.
          </p>
          
          <Link 
            to="/consent-form"
            className="inline-block bg-[#ef4805] hover:bg-[#f47d4a] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Start New Form
          </Link>
        </div>

        {/* Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Complete the form online or offline</li>
            <li>• Data is automatically saved to your device</li>
            <li>• Forms sync to our servers when internet is available</li>
            <li>• Your progress is never lost</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;
