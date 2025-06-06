
import { useState, useEffect } from 'react';
import { getRegionWithFallback, Region, REGIONS } from '../utils/regionDetection';
import { useToast } from '@/hooks/use-toast';

interface UseRegionDetectionResult {
  currentRegion: Region | null;
  regionDetected: boolean;
  regionDetectionComplete: boolean;
  detectAndSetRegion: () => Promise<Region>;
}

export const useRegionDetection = (): UseRegionDetectionResult => {
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [regionDetected, setRegionDetected] = useState(false);
  const [regionDetectionComplete, setRegionDetectionComplete] = useState(false);
  const { toast } = useToast();

  const detectAndSetRegion = async (): Promise<Region> => {
    if (regionDetectionComplete) return currentRegion as Region;
    
    try {
      const region = await getRegionWithFallback();
      setCurrentRegion(region);
      setRegionDetected(true);
      setRegionDetectionComplete(true);
      
      toast({
        title: "Region Detected",
        description: `Form will be submitted for ${region.name} (${region.code}) - ${region.doctor}`,
      });
      
      return region;
    } catch (error) {
      console.error('Region detection failed:', error);
      toast({
        title: "Region Detection Failed",
        description: "Using default region (PTA)",
        variant: "destructive",
      });
      
      // Set default region
      const defaultRegion = REGIONS.PTA;
      setCurrentRegion(defaultRegion);
      setRegionDetectionComplete(true);
      return defaultRegion;
    }
  };

  return {
    currentRegion,
    regionDetected,
    regionDetectionComplete,
    detectAndSetRegion
  };
};
