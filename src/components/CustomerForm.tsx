
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomerFormProps {
  formData: {
    name: string;
    phone: string;
    institute: string;
    timeSlot: string;
    notes: string;
  };
  onFormDataChange: (data: { name: string; phone: string; institute: string; timeSlot: string; notes: string }) => void;
}

const CustomerForm = ({ formData, onFormDataChange }: CustomerFormProps) => {
  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <User className="w-5 h-5 text-blue-600 flex-shrink-0" />
          Your Information
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          We need your details to contact you about your print job
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="grid gap-4 sm:gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
                className="h-11 text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
                className="h-11 text-base"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="institute" className="text-sm font-medium">Institute/Organization (Optional)</Label>
            <Input
              id="institute"
              value={formData.institute}
              onChange={(e) => handleInputChange('institute', e.target.value)}
              placeholder="School, College, Office, etc."
              className="h-11 text-base"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
