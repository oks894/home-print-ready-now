
import { Package } from 'lucide-react';

interface Service {
  name: string;
  quantity: number;
  price: number;
}

interface SelectedServicesProps {
  services: Service[];
  totalAmount?: number;
  deliveryRequested?: boolean;
}

export const SelectedServices = ({ services, totalAmount, deliveryRequested }: SelectedServicesProps) => {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
        <Package className="w-4 h-4" />
        Selected Services
      </h4>
      <div className="space-y-2">
        {services.map((service, index) => (
          <div key={index} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm">
            <div className="min-w-0 flex-1">
              <span className="font-medium truncate block">{service.name}</span>
              <span className="text-xs text-gray-500">Quantity: {service.quantity}</span>
            </div>
            <span className="font-medium flex-shrink-0 ml-2">₹{(service.price * service.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded font-semibold text-sm">
          <span>Total Amount</span>
          <span>₹{totalAmount?.toFixed(2) || '0.00'}</span>
        </div>
        {deliveryRequested && (
          <div className="p-2 sm:p-3 bg-green-50 rounded text-green-800 text-xs sm:text-sm">
            ✓ Delivery requested (₹200+ order)
          </div>
        )}
      </div>
    </div>
  );
};
