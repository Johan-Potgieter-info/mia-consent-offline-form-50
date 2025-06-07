
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AndroidDatePicker from './AndroidDatePicker';
import { FormData } from '../types/formTypes';

interface PatientDetailsSectionProps {
  formData: FormData;
  onInputChange: (name: string, value: string) => void;
}

const PatientDetailsSection = ({ formData, onInputChange }: PatientDetailsSectionProps) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onInputChange('dateOfBirth', date.toISOString().split('T')[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">Patient Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="text-base font-medium">
              Patient Name *
            </Label>
            <Input
              id="patientName"
              value={formData.patientName || ''}
              onChange={(e) => onInputChange('patientName', e.target.value)}
              className="h-12 text-base"
              placeholder="Enter patient's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber" className="text-base font-medium">
              ID Number *
            </Label>
            <Input
              id="idNumber"
              value={formData.idNumber || ''}
              onChange={(e) => onInputChange('idNumber', e.target.value)}
              className="h-12 text-base"
              placeholder="Enter ID number"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">
              Date of Birth *
            </Label>
            <AndroidDatePicker
              value={formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined}
              onChange={handleDateChange}
              placeholder="Select date of birth"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender" className="text-base font-medium">
              Gender
            </Label>
            <Select value={formData.gender || ''} onValueChange={(value) => onInputChange('gender', value)}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-base font-medium">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber || ''}
              onChange={(e) => onInputChange('phoneNumber', e.target.value)}
              className="h-12 text-base"
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
              className="h-12 text-base"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-base font-medium">
            Address
          </Label>
          <Input
            id="address"
            value={formData.address || ''}
            onChange={(e) => onInputChange('address', e.target.value)}
            className="h-12 text-base"
            placeholder="Enter full address"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDetailsSection;
