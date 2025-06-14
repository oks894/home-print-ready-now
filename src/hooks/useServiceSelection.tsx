
import { useState } from 'react';
import { Service, SelectedService } from '@/types/service';
import { calculateBulkPrice, parsePriceFromString } from '@/utils/pricingUtils';

export const useServiceSelection = (services: Service[]) => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const calculateServicePrice = (service: Service, quantity: number): number => {
    const basePrice = parsePriceFromString(service.price);
    
    // Apply bulk pricing for printing services
    if (service.category === 'Printing' || service.category === 'Color') {
      return calculateBulkPrice(basePrice, quantity);
    }
    
    // For other services, use standard pricing
    return basePrice * quantity;
  };

  const addService = (service: Service, quantity: number = 1) => {
    const existingService = selectedServices.find(s => s.id === service.id);
    
    if (existingService) {
      updateQuantity(service.id, existingService.quantity + quantity);
    } else {
      const calculatedPrice = calculateServicePrice(service, quantity);
      setSelectedServices(prev => [...prev, {
        id: service.id,
        name: service.name,
        quantity,
        basePrice: parsePriceFromString(service.price),
        calculatedPrice,
        category: service.category || 'Other'
      }]);
    }
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
      return;
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    const calculatedPrice = calculateServicePrice(service, quantity);
    
    setSelectedServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { ...s, quantity, calculatedPrice }
        : s
    ));
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const clearServices = () => {
    setSelectedServices([]);
  };

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.calculatedPrice, 0);
  const canAccessDelivery = totalAmount >= 200;

  return {
    selectedServices,
    addService,
    updateQuantity,
    removeService,
    clearServices,
    totalAmount,
    canAccessDelivery
  };
};
