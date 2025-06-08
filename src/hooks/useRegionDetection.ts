
import { useState, useEffect } from 'react';
import { getRegionWithFallback, Region, REGIONS } from '../utils/regionDetection';
import { useToast } from '@/hooks/use-toast';

interface UseRegionDetectionResult {
  currentRegion: Region | null;
  regionDetected: boolean;
  regionDetectionComplete: boolean;
  showManualSelector: boolean;
  isRegionFromDraft: boolean;
  isRegionDetected: boolean;
  detectAndSetRegion: (overrideRegion?: Region) => Promise<Region>;
  setRegionManually: (region: Region) => void;
  showRegionSelector: () => void;
  hideRegionSelector: () => void;
}

export const useRegionDetection = (): UseRegionDetectionResult => {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regionDetected, setRegionDetected] = useState(false);
  const [regionDetectionComplete, setRegionDetectionComplete] = useState(false);
  const [showManualSelector, setShowManualSelector] = useState(false);
  const [isRegionFromDraft, setIsRegionFromDraft] = useState(false);
  const [isRegionDetected, setIsRegionDetected] = useState(false);
  const { toast } = useToast();

  // Auto-detect region on mount (unless overridden)
  useEffect(() => {
    // Don't auto-detect if we're waiting for a draft region to be set
    const urlParams = new URLSearchParams(window.location.search);
    const draftParam = urlParams.get('draft');
    
    if (!draftParam) {
      detectAndSetRegion();
    }
  }, []);

  const detectAndSetRegion = async (overrideRegion?: Region): Promise<Region> => {
    // If override region is provided (from draft), use it directly
    if (overrideRegion) {
      setCurrentRegion(overrideRegion);
      setRegionDetected(true);
      setRegionDetectionComplete(true);
      setShowManualSelector(false);
      setIsRegionFromDraft(true);
      setIsRegionDetected(false);
      
      toast({
        title: "Region Loaded from Draft",
        description: `Form will be submitted for ${overrideRegion.name} (${overrideRegion.code}) - ${overrideRegion.doctor}`,
      });
      
      return overrideRegion;
    }

    if (regionDetectionComplete && currentRegion) return currentRegion;
    
    try {
      const region = await getRegionWithFallback();
      setCurrentRegion(region);
      setRegionDetected(true);
      setRegionDetectionComplete(true);
      setShowManualSelector(false);
      setIsRegionFromDraft(false);
      setIsRegionDetected(true);
      
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
      setIsRegionFromDraft(false);
      setIsRegionDetected(false);
      
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
    setIsRegionFromDraft(false);
    setIsRegionDetected(false);
    
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
    isRegionFromDraft,
    isRegionDetected,
    detectAndSetRegion,
    setRegionManually,
    showRegionSelector,
    hideRegionSelector
  };
};
