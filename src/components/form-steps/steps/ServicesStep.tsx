
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, CheckCircle, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ServiceSelector } from '../../ServiceSelector';
import { Service, SelectedService } from '@/types/service';

interface ServicesStepProps {
  services: Service[];
  selectedServices: SelectedService[];
  onAddService: (service: any, quantity?: number) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onRemoveService: (serviceId: string) => void;
  totalAmount: number;
  canAccessDelivery: boolean;
}

const ServicesStep = ({
  services,
  selectedServices,
  onAddService,
  onUpdateQuantity,
  onRemoveService,
  totalAmount,
  canAccessDelivery
}: ServicesStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <Settings className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose Your Services
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Select the printing options that best suit your needs. Bulk discounts apply automatically.
        </p>
      </div>
      
      <ServiceSelector 
        services={services}
        selectedServices={selectedServices}
        onAddService={onAddService}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveService={onRemoveService}
        totalAmount={totalAmount}
        canAccessDelivery={canAccessDelivery}
      />
      
      {selectedServices.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-purple-900">Order Summary</h4>
            <Badge className="bg-purple-100 text-purple-800">
              {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{service.name} (x{service.quantity})</span>
                <span className="font-medium">₹{service.calculatedPrice.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-purple-900">Total Amount:</span>
            <span className="text-2xl font-bold text-purple-600">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          {canAccessDelivery && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-green-100 rounded-lg flex items-center gap-2"
            >
              <Truck className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                🎉 Free delivery available for orders above ₹200!
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ServicesStep;
