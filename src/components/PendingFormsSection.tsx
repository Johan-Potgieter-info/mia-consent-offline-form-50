
import React, { useState, useEffect } from 'react';
import { Upload, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useHybridStorage } from '../hooks/useHybridStorage';
import { useConnectivity } from '../hooks/useConnectivity';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types/formTypes';

interface PendingFormsSectionProps {
  onRefresh?: () => void;
}

const PendingFormsSection = ({ onRefresh }: PendingFormsSectionProps) => {
  const [pendingForms, setPendingForms] = useState<FormData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const { getForms, syncData, capabilities } = useHybridStorage();
  const { isOnline } = useConnectivity();
  const { toast } = useToast();

  useEffect(() => {
    loadPendingForms();
  }, []);

  const loadPendingForms = async () => {
    setIsLoading(true);
    try {
      // Get completed forms that haven't been synced
      const forms = await getForms(false);
      const pending = forms.filter(form => !form.synced && form.status === 'completed');
      setPendingForms(pending);
    } catch (error) {
      console.error('Failed to load pending forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Cannot sync while offline. Please check your connection.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      const results = await syncData();
      
      if (results.success > 0) {
        toast({
          title: "Sync Successful",
          description: `Successfully uploaded ${results.success} form${results.success !== 1 ? 's' : ''}.`,
        });
        await loadPendingForms();
        onRefresh?.();
      } else if (results.failed > 0) {
        toast({
          title: "Sync Issues",
          description: `${results.failed} form${results.failed !== 1 ? 's' : ''} failed to upload. Will retry automatically.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Nothing to Sync",
          description: "All forms are already uploaded.",
        });
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync forms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (pendingForms.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-600">
          <Clock className="w-5 h-5" />
          Pending Upload ({pendingForms.length})
        </CardTitle>
        <CardDescription>
          Forms captured offline waiting to be uploaded to the server
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Loading pending forms...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingForms.map((form, index) => (
              <div key={form.id || index} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="font-medium text-sm">
                      {form.patientName || 'Unknown Patient'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {form.submissionId} • {form.timestamp ? new Date(form.timestamp).toLocaleString() : 'Unknown time'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isOnline && (
                    <AlertTriangle className="w-4 h-4 text-amber-500" title="Offline - will sync when connection restored" />
                  )}
                </div>
              </div>
            ))}
            
            {isOnline && capabilities.supabase && (
              <Button 
                onClick={handleManualSync}
                disabled={isSyncing}
                className="w-full mt-4"
                variant="outline"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload All Now
                  </>
                )}
              </Button>
            )}
            
            {!isOnline && (
              <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  <Wifi className="w-4 h-4 inline mr-1" />
                  Will automatically upload when connection is restored
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingFormsSection;
