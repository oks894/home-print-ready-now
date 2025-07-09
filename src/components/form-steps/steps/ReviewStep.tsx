
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, FileText, User, Clock, Package, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedService } from '@/types/service';

interface ReviewStepProps {
  uploadedFiles: Array<{ name: string; url: string; size: number; type: string }>;
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

const ReviewStep = ({ uploadedFiles, selectedServices, totalAmount, formData, deliveryRequested }: ReviewStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Review Your Order
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Please review all the details below before submitting your print job.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {/* Files Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Uploaded Files ({uploadedFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              Selected Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {service.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{service.calculatedPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between items-center">
                <p className="font-bold text-lg">Total Amount:</p>
                <p className="font-bold text-lg text-green-600">₹{totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-600" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{formData.phone}</p>
              </div>
              {formData.institute && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Institute</p>
                  <p className="font-medium">{formData.institute}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Delivery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Schedule & Delivery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Preferred Time Slot</p>
                <p className="font-medium">{formData.timeSlot}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Delivery:</span>
                <Badge variant={deliveryRequested ? "default" : "secondary"}>
                  {deliveryRequested ? "Requested" : "Not Requested"}
                </Badge>
              </div>

              {formData.notes && (
                <div>
                  <p className="text-sm text-gray-600">Special Notes</p>
                  <p className="font-medium text-sm bg-gray-50 p-2 rounded">{formData.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 text-center">
          By submitting this order, you confirm that all information is correct and agree to our terms of service.
        </p>
      </div>
    </div>
  );
};

export default ReviewStep;
