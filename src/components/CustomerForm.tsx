
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
  };
  onFormDataChange: (data: { name: string; phone: string; institute: string }) => void;
}

const CustomerForm = ({ formData, onFormDataChange }: CustomerFormProps) => {
  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Your Information
        </CardTitle>
        <CardDescription>
          We need your details to contact you about your print job
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="institute">Institute/Organization (Optional)</Label>
          <Input
            id="institute"
            value={formData.institute}
            onChange={(e) => handleInputChange('institute', e.target.value)}
            placeholder="School, College, Office, etc."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
