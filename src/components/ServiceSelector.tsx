
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X } from 'lucide-react';
import { Service, SelectedService } from '@/types/service';

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Services</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {services.filter(s => s.category !== 'Delivery').map(service => {
            const selected = selectedServices.find(s => s.id === service.id);
            return (
              <Card key={service.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getServiceIcon(service.category)}</span>
                    <div>
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <CardDescription className="font-semibold text-blue-600">
                        {service.price}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  
                  {selected ? (
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

                  {selected && (
                    <div className="mt-2 text-sm font-medium text-green-600">
                      Total: ₹{selected.calculatedPrice.toFixed(2)}
                    </div>
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
              {selectedServices.map(service => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name} (x{service.quantity})</span>
                  <span className="font-medium">₹{service.calculatedPrice.toFixed(2)}</span>
                </div>
              ))}
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
