
import { Package, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBulkDiscountInfo } from '@/utils/pricingUtils';
import { PrintJob } from '@/types/printJob';

interface SelectedServicesProps {
  job: PrintJob;
}

export const SelectedServices = ({ job }: SelectedServicesProps) => {
  const services = job.selected_services || [];
  const totalAmount = job.total_amount;
  const deliveryRequested = job.delivery_requested;

  if (!services || services.length === 0) {
    return null;
  }

  const isPrintingService = (serviceName: string) => {
    return serviceName.toLowerCase().includes('print') || 
           serviceName.toLowerCase().includes('color') ||
           serviceName.toLowerCase().includes('black');
  };

  let totalBulkSavings = 0;

  return (
    <div>
      <h4 className="font-medium mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
        <Package className="w-4 h-4" />
        Selected Services
      </h4>
      <div className="space-y-2">
        {services.map((service, index) => {
          const bulkInfo = isPrintingService(service.name) 
            ? getBulkDiscountInfo(service.quantity) 
            : null;
          
          if (bulkInfo?.hasBulkDiscount) {
            totalBulkSavings += bulkInfo.savings;
          }

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded text-sm">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate block">{service.name}</span>
                    {bulkInfo?.hasBulkDiscount && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Bulk
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">Quantity: {service.quantity}</span>
                </div>
                <span className="font-medium flex-shrink-0 ml-2">₹{(service.price * service.quantity).toFixed(2)}</span>
              </div>
              {bulkInfo?.hasBulkDiscount && (
                <div className="ml-2 sm:ml-3 text-xs text-green-600">
                  💰 Bulk discount saved ₹{bulkInfo.savings.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
        
        {totalBulkSavings > 0 && (
          <div className="p-2 sm:p-3 bg-green-50 rounded border border-green-200 text-sm">
            <div className="flex items-center gap-2 text-green-800 font-semibold">
              <Star className="w-4 h-4" />
              Total Bulk Savings: ₹{totalBulkSavings.toFixed(2)}
            </div>
          </div>
        )}
        
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
