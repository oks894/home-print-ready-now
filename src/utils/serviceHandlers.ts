
import { SelectedService } from '@/types/service';
import { calculateServicePrice } from '@/utils/pricingUtils';

export const createServiceHandlers = (
  setSelectedServices: React.Dispatch<React.SetStateAction<SelectedService[]>>
) => {
  const handleServiceAdd = (service: any, quantity = 1, options?: { pages?: number; copies?: number; doubleSided?: boolean; calculatedPrice?: number; }) => {
    console.log('Adding service:', service, 'quantity:', quantity, 'options:', options);
    
    // Use pre-calculated price if provided (from PrintingOptionsCard), otherwise calculate
    const calculatedPrice = options?.calculatedPrice ?? calculateServicePrice(service, quantity, options);
    
    const newService: SelectedService = { 
      ...service, 
      quantity, 
      calculatedPrice,
      ...(options && { printingOptions: { pages: options.pages, copies: options.copies, doubleSided: options.doubleSided } })
    };
    setSelectedServices(prev => [...prev, newService]);
  };

  const handleServiceUpdate = (serviceId: string, quantity: number, options?: { pages?: number; copies?: number; doubleSided?: boolean; calculatedPrice?: number; }) => {
    console.log('Updating service:', serviceId, 'quantity:', quantity, 'options:', options);
    setSelectedServices(services => 
      services.map(s => {
        if (s.id === serviceId) {
          // Use pre-calculated price if provided, otherwise calculate
          const calculatedPrice = options?.calculatedPrice ?? calculateServicePrice(s, quantity, options);
          return { 
            ...s, 
            quantity, 
            calculatedPrice,
            ...(options && { printingOptions: { pages: options.pages, copies: options.copies, doubleSided: options.doubleSided } })
          };
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
