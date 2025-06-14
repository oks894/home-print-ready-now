
import React from 'react';
import { User, Phone, Building2 } from 'lucide-react';
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
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/30 h-fit">
      <CardHeader className="pb-6">
        <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          Your Information
        </CardTitle>
        <CardDescription className="text-base">
          We need your details to contact you about your print job and ensure smooth delivery
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              Full Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
              required
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter your phone number"
              required
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
            />
            <p className="text-xs text-gray-500">We'll call you to confirm order details</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institute" className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              Institute/Organization
              <span className="text-xs text-gray-400 font-normal">(Optional)</span>
            </Label>
            <Input
              id="institute"
              value={formData.institute}
              onChange={(e) => handleInputChange('institute', e.target.value)}
              placeholder="School, College, Office, etc."
              className="h-12 text-base border-2 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">Completion Status</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${formData.name ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={formData.name ? 'text-green-700' : 'text-gray-500'}>Name provided</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${formData.phone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className={formData.phone ? 'text-green-700' : 'text-gray-500'}>Phone number provided</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerForm;
