
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Database, Wifi, WifiOff, Clock, MapPin, Trash2 } from "lucide-react";
import { getAllForms, clearSyncedForms, getAllDrafts, deleteDraft, syncPendingForms } from "@/utils/indexedDB";
import { useToast } from "@/hooks/use-toast";

interface Draft {
  id: number;
  patientName?: string;
  lastModified: string;
  regionCode: string;
  status: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedForms, setSavedForms] = useState(0);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<string>('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      handleAutoSync();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize app data
    initializeApp();

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const initializeApp = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadFormsCount(),
        loadDrafts()
      ]);
      
      // Auto-sync if online
      if (navigator.onLine) {
        handleAutoSync();
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      toast({
        title: "Initialization Error",
        description: "Some features may not work properly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Listen for sync messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data.type === 'SYNC_COMPLETE') {
            setSyncStatus('Sync completed successfully');
            loadFormsCount();
            setTimeout(() => setSyncStatus(''), 3000);
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const loadFormsCount = async () => {
    try {
      const forms = await getAllForms();
      setSavedForms(forms.length);
    } catch (error) {
      console.error('Error loading forms count:', error);
    }
  };

  const loadDrafts = async () => {
    try {
      const draftsList = await getAllDrafts();
      setDrafts(draftsList.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()));
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const handleAutoSync = async () => {
    if (!navigator.onLine) return;
    
    setSyncStatus('Syncing...');
    try {
      const results = await syncPendingForms();
      if (results.success > 0 || results.failed > 0) {
        setSyncStatus(`Synced: ${results.success} success, ${results.failed} failed`);
        loadFormsCount();
        toast({
          title: "Sync Complete",
          description: `${results.success} forms synced successfully`,
        });
      } else {
        setSyncStatus('All forms up to date');
      }
    } catch (error) {
      console.error('Auto-sync failed:', error);
      setSyncStatus('Sync failed');
    }
    
    setTimeout(() => setSyncStatus(''), 5000);
  };

  const clearForms = async () => {
    try {
      await clearSyncedForms();
      await loadFormsCount();
      toast({
        title: "Forms Cleared",
        description: "Synced forms have been cleared from local storage.",
      });
    } catch (error) {
      console.error('Error clearing forms:', error);
      toast({
        title: "Clear Error",
        description: "Failed to clear forms.",
        variant: "destructive",
      });
    }
  };

  const resumeDraft = (draft: Draft) => {
    // Navigate to consent form with draft data
    navigate('/consent-form', { state: { resumeDraft: draft } });
  };

  const handleDeleteDraft = async (draftId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteDraft(draftId);
      await loadDrafts();
      toast({
        title: "Draft Deleted",
        description: "Draft has been removed.",
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast({
        title: "Delete Error",
        description: "Failed to delete draft.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4805] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Mia Healthcare...</p>
        </div>
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
            {syncStatus && (
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {syncStatus}
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            {isOnline && (
              <Button variant="outline" size="sm" onClick={handleAutoSync}>
                Sync Now
              </Button>
            )}
            {savedForms > 0 && (
              <Button variant="outline" size="sm" onClick={clearForms}>
                Clear Synced Forms
              </Button>
            )}
          </div>
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

          {/* Resume Drafts Section */}
          {drafts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#ef4805]" />
                Resume Previous Forms
              </h2>
              <div className="grid gap-3">
                {drafts.map((draft) => (
                  <Card key={draft.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => resumeDraft(draft)}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium text-gray-900">
                                {draft.patientName || 'Unnamed Patient'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Last modified: {formatDate(draft.lastModified)}
                              </p>
                            </div>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <MapPin className="w-3 h-3 mr-1" />
                              {draft.regionCode}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteDraft(draft.id, e)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* New Form Section */}
          <div className="grid md:grid-cols-1 max-w-md mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-[#ef4805]">
                  <FileText className="w-5 h-5 mr-2" />
                  New Patient Consent Form
                </CardTitle>
                <CardDescription>
                  Complete the Mia Information and Consent Form for dental treatment.
                  Works offline and automatically saves your progress.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate('/consent-form')} 
                  className="w-full bg-[#ef4805] hover:bg-[#f47d4a]"
                >
                  Start New Form
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Security & Offline Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Offline Capability</h3>
              <p className="text-sm text-blue-700">
                This application works completely offline. Your form data is saved locally on your device 
                and will automatically sync with our servers when you're back online.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Data Security</h3>
              <p className="text-sm text-green-700">
                All sensitive information is encrypted before storage. Your data is secure and 
                automatically submitted to the correct regional office based on your location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
