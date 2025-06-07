
import React from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { REGIONS, Region } from '../utils/regionDetection';

interface RegionSelectorProps {
  onRegionSelect: (region: Region) => void;
  currentRegion?: Region | null;
  isVisible: boolean;
}

const RegionSelector = ({ onRegionSelect, currentRegion, isVisible }: RegionSelectorProps) => {
  const [selectedRegionCode, setSelectedRegionCode] = React.useState<string>(
    currentRegion?.code || ''
  );

  const handleRegionChange = (regionCode: string) => {
    setSelectedRegionCode(regionCode);
    const region = REGIONS[regionCode];
    if (region) {
      onRegionSelect(region);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#ef4805]">
          <MapPin className="w-5 h-5" />
          Select Your Region
        </CardTitle>
        <CardDescription>
          Please select your location to ensure the form is submitted to the correct practice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedRegionCode} onValueChange={handleRegionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose your region..." />
            </SelectTrigger>
            <SelectContent>
              {Object.values(REGIONS).map((region) => (
                <SelectItem key={region.code} value={region.code}>
                  <div className="flex flex-col">
                    <span className="font-medium">{region.name}</span>
                    <span className="text-sm text-gray-500">{region.doctor}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedRegionCode && (
            <div className="p-3 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">
                <strong>Selected:</strong> {REGIONS[selectedRegionCode]?.name} - {REGIONS[selectedRegionCode]?.doctor}
              </p>
              <p className="text-xs text-gray-500">
                Practice Number: {REGIONS[selectedRegionCode]?.practiceNumber}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionSelector;
