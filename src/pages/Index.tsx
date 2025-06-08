
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, MapPin, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useConnectivity } from '../hooks/useConnectivity';
import { useRegionDetection } from '../hooks/useRegionDetection';
import { useHybridStorage } from '../hooks/useHybridStorage';
import ResumeDraftDialog from '../components/ResumeDraftDialog';
import RegionSelector from '../components/RegionSelector';
import PendingFormsSection from '../components/PendingFormsSection';
import { FormData } from '../types/formTypes';

const Index = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<FormData[]>([]);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { isOnline } = useConnectivity();
  const { 
    currentRegion, 
    detectAndSetRegion, 
    regionDetected, 
    showManualSelector,
    setRegionManually,
    showRegionSelector 
  } = useRegionDetection();
  const { getForms, capabilities, isInitialized } = useHybridStorage();

  console.log('Index component loaded');
  console.log('Using new Mia logo: /lovable-uploads/2741077b-1d2b-4fa2-9829-1d43a1a54427.png');

  useEffect(() => {
    if (isInitialized) {
      loadDrafts();
    }
  }, [isInitialized, refreshKey]);

  const loadDrafts = async () => {
    if (!isInitialized) return;
    
    setIsLoadingDrafts(true);
    try {
      // Only load drafts (true) - not completed forms
      const savedDrafts = await getForms(true);
      setDrafts(savedDrafts);
      console.log(`Loaded ${savedDrafts.length} draft forms`);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    } finally {
      setIsLoadingDrafts(false);
    }
  };

  const refreshDrafts = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleStartNewForm = async () => {
    if (!regionDetected) {
      await detectAndSetRegion();
    }
    navigate('/consent-form');
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
      {currentRegion && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={showRegionSelector}
          className="text-xs h-6 px-2"
        >
          Change
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange Header with Mia Healthcare Logo */}
      <div className="bg-[#ef4805] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-3 inline-block rounded-lg">
            <img 
              src="/lovable-uploads/2741077b-1d2b-4fa2-9829-1d43a1a54427.png" 
              alt="Mia Healthcare" 
              className="h-16 w-auto"
              onError={(e) => {
                console.error('New Mia logo failed to load:', e);
                console.log('Attempted path:', e.currentTarget.src);
              }}
              onLoad={() => {
                console.log('New Mia logo loaded successfully');
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Title Section */}
        <div className="text-center mb-8 mt-8">
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

        {/* Manual Region Selector */}
        <RegionSelector
          onRegionSelect={setRegionManually}
          currentRegion={currentRegion}
          isVisible={showManualSelector}
        />

        {/* Pending Forms Section */}
        <PendingFormsSection onRefresh={refreshDrafts} />

        {/* Show draft count if we have drafts */}
        {drafts.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">
              You have {drafts.length} unfinished form{drafts.length !== 1 ? 's' : ''} saved as drafts
            </p>
            <p className="text-blue-600 text-sm mt-1">
              Use "Resume Draft" below to continue where you left off
            </p>
          </div>
        )}

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
                Resume Draft ({drafts.length})
              </CardTitle>
              <CardDescription>
                Continue working on a previously saved draft form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-14 flex items-center">
                <ResumeDraftDialog onDraftsChanged={refreshDrafts} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Storage Status */}
        {isInitialized && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Storage: {capabilities.supabase ? 'Cloud + Local' : capabilities.indexedDB ? 'Local (IndexedDB)' : 'Local (Basic)'}
            <br />
            <span className="text-xs">Drafts saved locally • Completed forms go to cloud database</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
