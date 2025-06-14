
import { useState, useMemo } from 'react';
import { Service, SelectedService } from '@/types/service';

export const useServiceSelection = (services: Service[]) => {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  const addService = (service: Service, quantity: number = 1) => {
    const existingIndex = selectedServices.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      const updated = [...selectedServices];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].calculatedPrice = calculateServicePrice(service, updated[existingIndex].quantity);
      setSelectedServices(updated);
    } else {
      const newService: SelectedService = {
        ...service,
        quantity,
        calculatedPrice: calculateServicePrice(service, quantity)
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

    const service = selectedServices.find(s => s.id === serviceId);
    if (!service) return;

    const updated = selectedServices.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          quantity,
          calculatedPrice: calculateServicePrice(s, quantity)
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

const calculateServicePrice = (service: Service, quantity: number): number => {
  // Handle different service types with bulk pricing
  const serviceName = service.name.toLowerCase();
  
  if (serviceName.includes('document') || serviceName.includes('black') || serviceName.includes('b&w')) {
    // Document/B&W printing: ₹3.5 for 1-49 pages, ₹2.5 for 50+ pages
    if (quantity >= 50) {
      return quantity * 2.5;
    } else {
      return quantity * 3.5;
    }
  } else if (serviceName.includes('color')) {
    // Color printing: ₹5 for 1-49 pages, ₹2.5 for 50+ pages
    if (quantity >= 50) {
      return quantity * 2.5;
    } else {
      return quantity * 5;
    }
  } else if (serviceName.includes('passport')) {
    // Passport photos: ₹20 per set of 6
    return quantity * 20;
  } else {
    // Fallback: extract numeric value from price string
    const match = service.price.match(/₹?([\d.]+)/);
    if (match) {
      return parseFloat(match[1]) * quantity;
    }
    return 0;
  }
};
