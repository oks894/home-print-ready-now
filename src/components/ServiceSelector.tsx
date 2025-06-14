
import React from 'react';
import { Info } from 'lucide-react';
import { Service, SelectedService } from '@/types/service';
import ServiceCard from './service-selector/ServiceCard';
import OrderSummary from './service-selector/OrderSummary';
import DeliveryOption from './service-selector/DeliveryOption';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: SelectedService[];
  onAddService: (service: Service, quantity?: number) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onRemoveService: (serviceId: string) => void;
  totalAmount: number;
  canAccessDelivery: boolean;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServices,
  onAddService,
  onUpdateQuantity,
  onRemoveService,
  totalAmount,
  canAccessDelivery
}) => {
  console.log('ServiceSelector received services:', services);
  console.log('Services length:', services?.length);

  // Show loading state if no services
  if (!services || services.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Services</h3>
          <div className="text-center py-8">
            <p className="text-gray-500">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  const nonDeliveryServices = services.filter(s => s.category !== 'Delivery');
  console.log('Non-delivery services:', nonDeliveryServices);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Services</h3>
        
        {/* Bulk Pricing Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Bulk Pricing Available!</h4>
          </div>
          <p className="text-sm text-green-700">
            Get <span className="font-bold">₹2.5 per page</span> when you print 50+ pages (Black & White or Color)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {nonDeliveryServices.map(service => {
            console.log('Rendering service:', service);
            const selectedService = selectedServices.find(s => s.id === service.id);
            
            return (
              <ServiceCard
                key={service.id}
                service={service}
                selectedService={selectedService}
                onAddService={onAddService}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveService={onRemoveService}
              />
            );
          })}
        </div>
      </div>

      {/* Delivery Option */}
      <DeliveryOption canAccessDelivery={canAccessDelivery} />

      {/* Order Summary */}
      <OrderSummary 
        selectedServices={selectedServices}
        totalAmount={totalAmount}
      />
    </div>
  );
};
