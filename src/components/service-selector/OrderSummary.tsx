
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SelectedService } from '@/types/service';
import { getBulkDiscountInfo } from '@/utils/pricingUtils';
import { isPrintingService } from '@/utils/serviceUtils';

interface OrderSummaryProps {
  selectedServices: SelectedService[];
  totalAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  selectedServices,
  totalAmount
}) => {
  if (selectedServices.length === 0) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-lg text-blue-800">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {selectedServices.map(service => {
            const bulkInfo = isPrintingService(service.category) 
              ? getBulkDiscountInfo(service.quantity) 
              : null;
            
            return (
              <div key={service.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>
                    {service.name} (x{service.quantity})
                    {bulkInfo?.hasBulkDiscount && (
                      <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                        Bulk Price
                      </Badge>
                    )}
                  </span>
                  <span className="font-medium">₹{service.calculatedPrice.toFixed(2)}</span>
                </div>
                {bulkInfo?.hasBulkDiscount && (
                  <div className="text-xs text-green-600 ml-2">
                    Saved ₹{bulkInfo.savings.toFixed(2)} with bulk pricing
                  </div>
                )}
              </div>
            );
          })}
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span className="text-blue-600">₹{totalAmount.toFixed(2)}</span>
          </div>
          {totalAmount >= 200 ? (
            <Badge className="bg-green-100 text-green-800">
              ✓ Free delivery included
            </Badge>
          ) : (
            <p className="text-sm text-gray-600">
              Add ₹{(200 - totalAmount).toFixed(2)} more for free delivery
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
