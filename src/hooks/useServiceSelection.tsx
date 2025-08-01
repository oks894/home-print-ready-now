
import { useState } from 'react';
import { Service, SelectedService } from '@/types/service';
import { calculateBulkPrice, parsePriceFromString } from '@/utils/pricingUtils';

export const useServiceSelection = (services: Service[]) => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const calculateServicePrice = (service: Service, quantity: number, options?: { pages?: number; copies?: number; doubleSided?: boolean; }): number => {
    const basePrice = parsePriceFromString(service.price);
    
    // For printing services, use the advanced pricing calculation if options are provided
    if ((service.category === 'Printing' || service.category === 'Color') && options?.pages && options?.copies) {
      return calculateServicePrice(service, quantity, options);
    }
    
    // Apply bulk pricing for printing services (fallback)
    if (service.category === 'Printing' || service.category === 'Color') {
      return calculateBulkPrice(basePrice, quantity);
    }
    
    // For other services, use standard pricing
    return basePrice * quantity;
  };

  const addService = (service: Service, quantity: number = 1, options?: { pages?: number; copies?: number; doubleSided?: boolean; calculatedPrice?: number; }) => {
    const existingService = selectedServices.find(s => s.id === service.id);
    
    if (existingService) {
      updateQuantity(service.id, existingService.quantity + quantity, options);
    } else {
      // Use pre-calculated price if provided, otherwise calculate
      const calculatedPrice = options?.calculatedPrice ?? calculateServicePrice(service, quantity, options);
      setSelectedServices(prev => [...prev, {
        ...service, // This spreads all properties from Service including id, name, description, price, category, created_at
        quantity,
        calculatedPrice,
        ...(options && { printingOptions: { pages: options.pages, copies: options.copies, doubleSided: options.doubleSided } })
      }]);
    }
  };

  const updateQuantity = (serviceId: string, quantity: number, options?: { pages?: number; copies?: number; doubleSided?: boolean; calculatedPrice?: number; }) => {
    if (quantity <= 0) {
      removeService(serviceId);
      return;
    }

    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    // Use pre-calculated price if provided, otherwise calculate
    const calculatedPrice = options?.calculatedPrice ?? calculateServicePrice(service, quantity, options);
    
    setSelectedServices(prev => prev.map(s => 
      s.id === serviceId 
        ? { 
            ...s, 
            quantity, 
            calculatedPrice,
            ...(options && { printingOptions: { pages: options.pages, copies: options.copies, doubleSided: options.doubleSided } })
          }
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
