
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useConnectivity } from '../hooks/useConnectivity';
import { useRegionDetection } from '../hooks/useRegionDetection';
import { useHybridStorage } from '../hooks/useHybridStorage';
import ResumeDraftDialog from '../components/ResumeDraftDialog';
import { FormData } from '../types/formTypes';

const Index = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<FormData[]>([]);
  const [showResumeDraftDialog, setShowResumeDraftDialog] = useState(false);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  
  const { isOnline } = useConnectivity();
  const { currentRegion, detectAndSetRegion, regionDetected } = useRegionDetection();
  const { getDrafts, capabilities, isInitialized } = useHybridStorage();

  console.log('Index component loaded');

  useEffect(() => {
    if (isInitialized) {
      loadDrafts();
    }
  }, [isInitialized]);

  const loadDrafts = async () => {
    if (!isInitialized) return;
    
    setIsLoadingDrafts(true);
    try {
      const savedDrafts = await getDrafts();
      setDrafts(savedDrafts);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const handleStartNewForm = async () => {
    if (!regionDetected) {
      await detectAndSetRegion();
    }
    navigate('/consent-form');
  };

  const handleResumeDraft = (draft: FormData) => {
    navigate('/consent-form', { 
      state: { resumeDraft: draft }
    });
  };

  const handleDeleteDraft = async () => {
    await loadDrafts();
  };

  const ConnectionIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4 text-green-600" />
          <span className="text-green-600">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-orange-600" />
          <span className="text-orange-600">Offline</span>
        </>
      )}
    </div>
  );

  const RegionIndicator = () => (
    <div className="flex items-center gap-2 text-sm">
      <MapPin className="w-4 h-4 text-blue-600" />
      <span className="text-blue-600">
        {currentRegion ? currentRegion.name : 'Detecting location...'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/25d24f1c-8eda-4e3e-a4f7-0412eebf2eb9.png" 
              alt="Mia Healthcare" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mia Healthcare
          </h1>
          <p className="text-xl text-gray-600">
            Dental Consent Form
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white rounded-lg shadow-sm">
          <ConnectionIndicator />
          <RegionIndicator />
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Start New Form */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#ef4805]" />
                Start New Form
              </CardTitle>
              <CardDescription>
                Begin a new dental consent form for a patient
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleStartNewForm}
                className="w-full h-14 text-lg bg-[#ef4805] hover:bg-[#d63d04] text-white font-semibold"
                size="lg"
              >
                Start New Form
              </Button>
            </CardContent>
          </Card>

          {/* Resume Draft */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-600" />
                Resume Draft
              </CardTitle>
              <CardDescription>
                Continue working on a previously saved form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowResumeDraftDialog(true)}
                variant="outline"
                className="w-full h-14 text-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-50 font-semibold"
                size="lg"
                disabled={isLoadingDrafts || drafts.length === 0}
              >
                {isLoadingDrafts ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {drafts.length === 0 ? 'No Drafts Available' : `Resume Draft (${drafts.length})`}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Auto-saves progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Multi-region support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure data handling</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Mobile optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Cloud sync when online</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Status */}
        {isInitialized && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Storage: {capabilities.supabase ? 'Cloud + Local' : capabilities.indexedDB ? 'Local (IndexedDB)' : 'Local (Basic)'}
          </div>
        )}

        {/* Resume Draft Dialog */}
        <ResumeDraftDialog
          open={showResumeDraftDialog}
          onOpenChange={setShowResumeDraftDialog}
          drafts={drafts}
          onResumeDraft={handleResumeDraft}
          onDeleteDraft={handleDeleteDraft}
          isOnline={isOnline}
        />
      </div>
    </div>
  );
};

export default Index;
