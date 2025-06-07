
// Region detection utility for automatic form labeling

export interface Region {
  code: 'CPT' | 'PTA' | 'JHB';
  name: string;
  doctor: string;
  practiceNumber: string;
}

export const REGIONS: Record<string, Region> = {
  CPT: {
    code: 'CPT',
    name: 'Cape Town',
    doctor: 'Dr. Soni',
    practiceNumber: '1030817'
  },
  PTA: {
    code: 'PTA',
    name: 'Pretoria',
    doctor: 'Dr. Vorster',
    practiceNumber: '1227831'
  },
  JHB: {
    code: 'JHB',
    name: 'Johannesburg',
    doctor: 'Dr. Essop',
    practiceNumber: '1182609'
  }
};

// Detect region based on user's geolocation
export const detectRegion = async (): Promise<Region> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported');
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const detectedRegion = getRegionFromCoordinates(latitude, longitude);
        console.log(`Location detected: ${latitude}, ${longitude} - Region: ${detectedRegion.code}`);
        resolve(detectedRegion);
      },
      (error) => {
        console.log('Geolocation error:', error);
        reject(error);
      },
      {
        timeout: 5000, // Shorter timeout to fail faster in sandbox
        maximumAge: 300000, // 5 minutes
        enableHighAccuracy: false
      }
    );
  });
};

// Determine region based on coordinates (approximate boundaries for South African cities)
const getRegionFromCoordinates = (lat: number, lon: number): Region => {
  // Cape Town area (approximately)
  if (lat >= -34.5 && lat <= -33.5 && lon >= 18.0 && lon <= 19.0) {
    return REGIONS.CPT;
  }
  
  // Johannesburg area (approximately)
  if (lat >= -26.5 && lat <= -25.5 && lon >= 27.5 && lon <= 28.5) {
    return REGIONS.JHB;
  }
  
  // Pretoria area (approximately) - also default for other areas
  return REGIONS.PTA;
};

// Fallback: detect region from timezone (less accurate but works without location permission)
export const detectRegionFromTimezone = (): Region => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('Detected timezone:', timezone);
  
  // Default to PTA for South African timezone
  if (timezone === 'Africa/Johannesburg') {
    return REGIONS.PTA; // Default to PTA for SA timezone
  }
  
  return REGIONS.PTA;
};

// Get region with fallback methods - now throws error if all methods fail
export const getRegionWithFallback = async (): Promise<Region> => {
  try {
    return await detectRegion();
  } catch (error) {
    console.log('Primary geolocation failed, trying timezone fallback');
    
    // In sandbox/preview environments, timezone detection might not be reliable either
    // So let's throw an error to trigger manual selection
    if (window.location.hostname.includes('lovable') || 
        window.location.hostname.includes('sandbox') ||
        window.location.hostname.includes('preview')) {
      console.log('Detected sandbox/preview environment - requiring manual region selection');
      throw new Error('Manual region selection required in sandbox environment');
    }
    
    // Use timezone fallback for production environments
    return detectRegionFromTimezone();
  }
};
