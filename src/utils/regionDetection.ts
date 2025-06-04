
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
    doctor: 'Dr. Cape Town Practice',
    practiceNumber: 'TBD'
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
    doctor: 'Dr. Johannesburg Practice',
    practiceNumber: 'TBD'
  }
};

// Detect region based on user's geolocation
export const detectRegion = async (): Promise<Region> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, defaulting to PTA');
      resolve(REGIONS.PTA);
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
        console.log('Geolocation error, defaulting to PTA:', error);
        resolve(REGIONS.PTA);
      },
      {
        timeout: 10000,
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

// Get region with fallback methods
export const getRegionWithFallback = async (): Promise<Region> => {
  try {
    return await detectRegion();
  } catch (error) {
    console.log('Primary detection failed, using timezone fallback');
    return detectRegionFromTimezone();
  }
};
