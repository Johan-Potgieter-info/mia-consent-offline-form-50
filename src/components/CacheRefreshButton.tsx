
import React, { useState } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { clearFormCaches, refreshIndexedDB, detectCacheIssues } from '../utils/cacheManager';

interface CacheRefreshButtonProps {
  onRefresh?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const CacheRefreshButton = ({ 
  onRefresh, 
  variant = 'outline', 
  size = 'sm' 
}: CacheRefreshButtonProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Clear form caches
      await clearFormCaches();
      
      // Refresh IndexedDB connection
      await refreshIndexedDB();
      
      // Call parent refresh if provided
      if (onRefresh) {
        onRefresh();
      }
      
      toast({
        title: "Cache Refreshed",
        description: "Form data cache has been refreshed successfully.",
      });
      
    } catch (error) {
      console.error('Cache refresh failed:', error);
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh cache. Try reloading the page.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const hasCacheIssues = detectCacheIssues();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={hasCacheIssues ? "text-amber-600 border-amber-300" : ""}
        >
          {isRefreshing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              {hasCacheIssues && <AlertTriangle className="w-3 h-3 ml-1 text-amber-500" />}
              Refresh Cache
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Refresh Form Cache</AlertDialogTitle>
          <AlertDialogDescription>
            This will clear temporary form data cache and refresh the connection to local storage. 
            Any unsaved form progress will be preserved, but the app may reload to ensure proper functionality.
            {hasCacheIssues && (
              <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Cache issues detected - refresh recommended
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Refresh Cache'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CacheRefreshButton;
