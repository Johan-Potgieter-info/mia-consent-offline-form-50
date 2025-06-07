
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
      
      // Show manual selector instead of defaulting
      setShowManualSelector(true);
      
      toast({
        title: "Region Detection Failed",
        description: "Please select your region manually below",
        variant: "destructive",
      });
      
      // Still set default region as fallback
      const defaultRegion = REGIONS.PTA;
      setCurrentRegion(defaultRegion);
      setRegionDetectionComplete(true);
      return defaultRegion;
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
