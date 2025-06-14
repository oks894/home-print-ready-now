
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X, Info } from 'lucide-react';
import { Service, SelectedService } from '@/types/service';
import { getBulkDiscountInfo } from '@/utils/pricingUtils';

interface ServiceSelectorProps {
  services: Service[];
  selectedServices: SelectedService[];
  onAddService: (service: Service, quantity?: number) => void;
  onUpdateQuantity: (serviceId: string, quantity: number) => void;
  onRemoveService: (serviceId: string) => void;
  totalAmount: number;
  canAccessDelivery: boolean;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedServices,
  onAddService,
  onUpdateQuantity,
  onRemoveService,
  totalAmount,
  canAccessDelivery
}) => {
  const getServiceIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Printing': '📄',
      'Color': '🎨',
      'Delivery': '🚚',
      'Binding': '📚'
    };
    return icons[category] || '📄';
  };

  const isPrintingService = (category: string) => {
    return category === 'Printing' || category === 'Color';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Services</h3>
        
        {/* Bulk Pricing Info */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-800">Bulk Pricing Available!</h4>
          </div>
          <p className="text-sm text-green-700">
            Get <span className="font-bold">₹2.5 per page</span> when you print 50+ pages (Black & White or Color)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.filter(s => s.category !== 'Delivery').map(service => {
            const selected = selectedServices.find(s => s.id === service.id);
            const bulkInfo = selected && isPrintingService(service.category || '') 
              ? getBulkDiscountInfo(selected.quantity) 
              : null;
            
            return (
              <Card key={service.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getServiceIcon(service.category || '')}</span>
                    <div>
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <CardDescription className="font-semibold text-blue-600">
                        {service.price}
                        {isPrintingService(service.category || '') && (
                          <span className="block text-xs text-green-600">
                            ₹2.5/page for 50+ pages
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  {selected ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(service.id, selected.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={selected.quantity}
                          onChange={(e) => onUpdateQuantity(service.id, parseInt(e.target.value) || 0)}
                          className="w-16 text-center"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUpdateQuantity(service.id, selected.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRemoveService(service.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Bulk Discount Alert */}
                      {bulkInfo?.hasBulkDiscount && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Bulk Discount Applied!
                            </Badge>
                          </div>
                          <p className="text-xs text-green-700">
                            You saved ₹{bulkInfo.savings.toFixed(2)} with bulk pricing
                          </p>
                        </div>
                      )}

                      {/* Show when close to bulk discount */}
                      {selected.quantity >= 40 && selected.quantity < 50 && isPrintingService(service.category || '') && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-xs text-yellow-700">
                            Add {50 - selected.quantity} more pages to unlock ₹2.5/page bulk pricing!
                          </p>
                        </div>
                      )}

                      <div className="text-sm font-medium text-green-600">
                        Total: ₹{selected.calculatedPrice.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onAddService(service)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Delivery Option */}
      {canAccessDelivery && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚚</span>
              <div>
                <CardTitle className="text-base text-green-800">Doorstep Delivery</CardTitle>
                <CardDescription className="text-green-600">
                  FREE - Unlocked for orders ₹200+
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                Available
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-700">
              Powered by DROPEE - Your order qualifies for free doorstep delivery!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Summary */}
      {selectedServices.length > 0 && (
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
      )}
    </div>
  );
};
