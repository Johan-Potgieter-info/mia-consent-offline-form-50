
import { useState, useEffect } from 'react';
import { getRegionWithFallback, Region, REGIONS } from '../utils/regionDetection';
import { useToast } from '@/hooks/use-toast';

interface UseRegionDetectionResult {
  currentRegion: Region | null;
  regionDetected: boolean;
  regionDetectionComplete: boolean;
  showManualSelector: boolean;
  detectAndSetRegion: () => Promise<Region>;
  setRegionManually: (region: Region) => void;
  showRegionSelector: () => void;
  hideRegionSelector: () => void;
}

export const useRegionDetection = (): UseRegionDetectionResult => {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regionDetected, setRegionDetected] = useState(false);
  const [regionDetectionComplete, setRegionDetectionComplete] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const { toast } = useToast();

  // Auto-detect region on mount
  useEffect(() => {
    detectAndSetRegion();
  }, []);

  const detectAndSetRegion = async (): Promise<Region> => {
    if (regionDetectionComplete && currentRegion) return currentRegion;
    
    try {
      const region = await getRegionWithFallback();
      setCurrentRegion(region);
      setRegionDetected(true);
      setRegionDetectionComplete(true);
      setShowManualSelector(false);
      
      toast({
        title: "Region Detected",
        description: `Form will be submitted for ${region.name} (${region.code}) - ${region.doctor}`,
      });
      
      return region;
    } catch (error) {
      console.error('Region detection failed:', error);
      
      // Don't set a default region - let user choose manually
      setCurrentRegion(null);
      setRegionDetected(false);
      setRegionDetectionComplete(false);
      setShowManualSelector(true);
      
      toast({
        title: "Region Detection Failed",
        description: "Please select your region manually below",
        variant: "destructive",
      });
      
      // Return a default region for the promise, but don't set it as current
      return REGIONS.PTA;
    }
  };

  const setRegionManually = (region: Region) => {
    setCurrentRegion(region);
    setRegionDetected(true);
    setRegionDetectionComplete(true);
    setShowManualSelector(false);
    
    toast({
      title: "Region Selected",
      description: `Form will be submitted for ${region.name} (${region.code}) - ${region.doctor}`,
    });
  };

  const showRegionSelector = () => {
    setShowManualSelector(true);
  };

  const hideRegionSelector = () => {
    setShowManualSelector(false);
  };

  return {
    currentRegion,
    regionDetected,
    regionDetectionComplete,
    showManualSelector,
    detectAndSetRegion,
    setRegionManually,
    showRegionSelector,
    hideRegionSelector
  };
};
