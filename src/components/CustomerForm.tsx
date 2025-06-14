
import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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

  const isValidPhone = (phone: string) => {
    return phone.length >= 10 && /^\d+$/.test(phone);
  };

  const getCompletionPercentage = () => {
    const fields = [formData.name, formData.phone];
    const completed = fields.filter(field => field.trim() !== '').length;
    return (completed / fields.length) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
        
        <CardHeader className="pb-6 relative">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-8 left-6 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-xl"
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          
          <div className="mt-8">
            <CardTitle className="flex items-center gap-3 text-2xl sm:text-3xl">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Information
              </span>
              <Badge className="bg-green-100 text-green-800">
                {Math.round(getCompletionPercentage())}% Complete
              </Badge>
            </CardTitle>
            <CardDescription className="text-base mt-2">
              We need your details to contact you about your print job and ensure smooth delivery.
              All information is securely handled and never shared.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid gap-6">
            {/* Name Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <Label htmlFor="name" className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-green-600" />
                Full Name *
                {formData.name && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="h-14 text-base border-2 focus:border-green-500 transition-all duration-300 pl-4 bg-white/80 backdrop-blur-sm"
                />
                {formData.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                Phone Number *
                {isValidPhone(formData.phone) && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {formData.phone && !isValidPhone(formData.phone) && (
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  required
                  className={`h-14 text-base border-2 transition-all duration-300 pl-4 bg-white/80 backdrop-blur-sm ${
                    formData.phone && !isValidPhone(formData.phone) 
                      ? 'border-orange-400 focus:border-orange-500' 
                      : 'focus:border-green-500'
                  }`}
                />
                {formData.phone && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {isValidPhone(formData.phone) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                  </motion.div>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${
                  isValidPhone(formData.phone) ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className={isValidPhone(formData.phone) ? 'text-green-700' : 'text-gray-500'}>
                  We'll call you to confirm order details and delivery
                </span>
              </div>
            </motion.div>

            {/* Institute Field */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Label htmlFor="institute" className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-green-600" />
                Institute/Organization
                <Badge variant="secondary" className="text-xs">Optional</Badge>
                {formData.institute && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </Label>
              <div className="relative">
                <Input
                  id="institute"
                  value={formData.institute}
                  onChange={(e) => handleInputChange('institute', e.target.value)}
                  placeholder="School, College, Office, etc."
                  className="h-14 text-base border-2 focus:border-green-500 transition-all duration-300 pl-4 bg-white/80 backdrop-blur-sm"
                />
                {formData.institute && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Special Instructions */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <Label htmlFor="notes" className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-green-600" />
                Special Instructions
                <Badge variant="secondary" className="text-xs">Optional</Badge>
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any special requirements, binding preferences, paper quality, etc..."
                className="min-h-20 text-base border-2 focus:border-green-500 transition-all duration-300 p-4 bg-white/80 backdrop-blur-sm resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Help us serve you better by mentioning any specific requirements
              </p>
            </motion.div>
          </div>

          {/* Progress Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-green-800">Form Completion</h4>
              <Badge className="bg-green-100 text-green-800">
                {Math.round(getCompletionPercentage())}%
              </Badge>
            </div>
            
            <div className="w-full bg-green-100 rounded-full h-3 mb-4 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${getCompletionPercentage()}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${formData.name ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={formData.name ? 'text-green-700 font-medium' : 'text-gray-500'}>
                  Name provided
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${isValidPhone(formData.phone) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={isValidPhone(formData.phone) ? 'text-green-700 font-medium' : 'text-gray-500'}>
                  Phone verified
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${formData.institute ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={formData.institute ? 'text-green-700 font-medium' : 'text-gray-500'}>
                  Institute added
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${formData.notes ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <span className={formData.notes ? 'text-green-700 font-medium' : 'text-gray-500'}>
                  Instructions added
                </span>
              </div>
            </div>
            
            {getCompletionPercentage() === 100 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  🎉 All required information completed!
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Security Notice */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <p className="text-sm text-blue-800">
              🔒 Your information is secure and encrypted. We never share your details with third parties.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CustomerForm;
