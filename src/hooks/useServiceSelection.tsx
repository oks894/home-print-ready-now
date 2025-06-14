
import { useState, useMemo } from 'react';
import { Service, SelectedService } from '@/types/service';

export const useServiceSelection = (services: Service[]) => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const addService = (service: Service, quantity: number = 1) => {
    const existingIndex = selectedServices.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedServices];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].calculatedPrice = calculateServicePrice(service.price, updated[existingIndex].quantity);
      setSelectedServices(updated);
    } else {
      const newService: SelectedService = {
        ...service,
        quantity,
        calculatedPrice: calculateServicePrice(service.price, quantity)
      };
      setSelectedServices([...selectedServices, newService]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId);
      return;
    }

    const updated = selectedServices.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          quantity,
          calculatedPrice: calculateServicePrice(s.price, quantity)
        };
      }
      return s;
    });
    setSelectedServices(updated);
  };

  const totalAmount = useMemo(() => {
    return selectedServices.reduce((sum, service) => sum + service.calculatedPrice, 0);
  }, [selectedServices]);

  const canAccessDelivery = totalAmount >= 200;

  const clearSelection = () => {
    setSelectedServices([]);
  };

  return {
    selectedServices,
    addService,
    removeService,
    updateQuantity,
    totalAmount,
    canAccessDelivery,
    clearSelection
  };
};

const calculateServicePrice = (priceString: string, quantity: number): number => {
  // Extract numeric value from price string like "₹3.5/page"
  const match = priceString.match(/₹?([\d.]+)/);
  if (match) {
    return parseFloat(match[1]) * quantity;
  }
  return 0;
};
