
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Package, User, CreditCard, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SelectedService } from '@/types/service';

interface ReviewStepProps {
  files: File[];
  selectedServices: SelectedService[];
  totalAmount: number;
  formData: {
    name: string;
    phone: string;
    institute: string;
    timeSlot: string;
    notes: string;
  };
  deliveryRequested: boolean;
}

const ReviewStep = ({
  files,
  selectedServices,
  totalAmount,
  formData,
  deliveryRequested
}: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Review Your Order
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Please review all details before submitting your print job.
        </p>
      </div>
      
      <div className="grid gap-6">
        {/* Order Summary */}
        <Card className="border-2 border-indigo-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="font-semibold mb-2">Files ({files.length})</h5>
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="truncate">{file.name}</span>
                    <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h5 className="font-semibold mb-2">Services</h5>
              <div className="space-y-2">
                {selectedServices.map((service, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{service.name} (x{service.quantity})</span>
                    <span className="font-medium">₹{service.calculatedPrice.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-indigo-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Details */}
        <Card className="border-2 border-green-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span>
                <p>{formData.name}</p>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <p>{formData.phone}</p>
              </div>
              {formData.institute && (
                <div className="col-span-2">
                  <span className="font-medium">Institute:</span>
                  <p>{formData.institute}</p>
                </div>
              )}
              <div className="col-span-2">
                <span className="font-medium">Pickup Time:</span>
                <p>{formData.timeSlot}</p>
              </div>
              {deliveryRequested && (
                <div className="col-span-2">
                  <Badge className="bg-blue-100 text-blue-800">
                    <Truck className="w-4 h-4 mr-1" />
                    Delivery Requested
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Info */}
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-yellow-600" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Payment will be collected upon pickup or delivery</span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              We accept cash, UPI, and card payments
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewStep;
