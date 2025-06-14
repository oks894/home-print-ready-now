
import { SelectedService } from '@/types/service';

export const createServiceHandlers = (
  setSelectedServices: React.Dispatch<React.SetStateAction<SelectedService[]>>
) => {
  const handleServiceAdd = (service: any, quantity = 1) => {
    console.log('Adding service:', service, 'quantity:', quantity);
    const basePrice = parseFloat(service.price.replace(/[₹\/\w\s]/g, '')) || 0;
    const newService: SelectedService = { 
      ...service, 
      quantity, 
      calculatedPrice: basePrice * quantity 
    };
    setSelectedServices(prev => [...prev, newService]);
  };

  const handleServiceUpdate = (serviceId: string, quantity: number) => {
    console.log('Updating service:', serviceId, 'quantity:', quantity);
    setSelectedServices(services => 
      services.map(s => {
        if (s.id === serviceId) {
          const basePrice = parseFloat(s.price.replace(/[₹\/\w\s]/g, '')) || 0;
          return { ...s, quantity, calculatedPrice: basePrice * quantity };
        }
        return s;
      })
    );
  };

  const handleServiceRemove = (serviceId: string) => {
    console.log('Removing service:', serviceId);
    setSelectedServices(services => services.filter(s => s.id !== serviceId));
  };

  return {
    handleServiceAdd,
    handleServiceUpdate,
    handleServiceRemove
  };
};
