
import { SelectedService } from '@/types/service';
import { calculateServicePrice } from '@/utils/pricingUtils';

export const createServiceHandlers = (
  setSelectedServices: React.Dispatch<React.SetStateAction<SelectedService[]>>
) => {
  const handleServiceAdd = (service: any, quantity = 1) => {
    console.log('Adding service:', service, 'quantity:', quantity);
    const calculatedPrice = calculateServicePrice(service, quantity);
    const newService: SelectedService = { 
      ...service, 
      quantity, 
      calculatedPrice
    };
    setSelectedServices(prev => [...prev, newService]);
  };

  const handleServiceUpdate = (serviceId: string, quantity: number) => {
    console.log('Updating service:', serviceId, 'quantity:', quantity);
    setSelectedServices(services => 
      services.map(s => {
        if (s.id === serviceId) {
          const calculatedPrice = calculateServicePrice(s, quantity);
          return { ...s, quantity, calculatedPrice };
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
